import { test } from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import vm from 'node:vm';
import fs from 'node:fs';

function setup() {
  const data = new Map();
  const events = new EventTarget();
  const storage = { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
  const context = vm.createContext({ exports: {}, window: { localStorage: storage,
    addEventListener: events.addEventListener.bind(events), removeEventListener: events.removeEventListener.bind(events),
    dispatchEvent: events.dispatchEvent.bind(events) }, Event });
  const source = ts.transpileModule(fs.readFileSync('lib/cart.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInContext(source, context);
  return { cart: context.exports, storage, events };
}
const product = { id: 'real-product', name: 'Mchose Ace 68', slug: 'mchose-ace-68', price: 150, stock: 3, sku: 'ACE', image: '/ace.png' };

test('persiste cantidades y slug; el snapshot permanece estable y se recupera tras una recarga', () => {
  const { cart, storage } = setup();
  cart.addToCart(product, 2);
  assert.equal(cart.readCart()[0].cantidad, 2);
  assert.equal(cart.readCart()[0].slug, product.slug);
  assert.equal(cart.readCart(), cart.readCart());
  const reloaded = setup();
  reloaded.storage.setItem(cart.CART_KEY, storage.getItem(cart.CART_KEY));
  assert.equal(reloaded.cart.readCart()[0].cantidad, 2);
});

test('rechaza exceder stock acumulado, cantidades inválidas, agotados y precios inválidos', () => {
  const { cart } = setup();
  cart.addToCart(product, 2);
  assert.throws(() => cart.addToCart(product, 2));
  for (const quantity of [0, -1, 1.5, NaN]) assert.throws(() => cart.addToCart(product, quantity));
  assert.throws(() => cart.addToCart({ ...product, stock: 0 }));
  assert.throws(() => cart.addToCart({ ...product, price: NaN }));
  assert.equal(cart.readCart()[0].cantidad, 2);
});

test('restar en uno no elimina; eliminar y vaciar se guardan correctamente', () => {
  const { cart } = setup();
  cart.addToCart(product);
  cart.changeQuantity(product.id, -1);
  assert.equal(cart.readCart()[0].cantidad, 1);
  cart.removeFromCart(product.id);
  assert.equal(cart.readCart().length, 0);
  cart.addToCart(product);
  cart.writeCart([]);
  assert.equal(cart.readCart().length, 0);
});

test('tolera JSON dañado y entradas inválidas; combina IDs duplicados sin duplicar líneas', () => {
  const { cart, storage } = setup();
  storage.setItem(cart.CART_KEY, '{broken');
  assert.equal(cart.readCart().length, 0);
  cart.addToCart(product);
  const item = cart.readCart()[0];
  storage.setItem(cart.CART_KEY, JSON.stringify([null, { ...item, cantidad: -2 }, item, item]));
  assert.equal(cart.readCart().length, 1);
  assert.equal(cart.readCart()[0].cantidad, 2);
});

test('consulta actualiza precio/slug, reduce cantidades y marca productos desaparecidos sin borrarlos', () => {
  const { cart } = setup();
  cart.addToCart(product, 3);
  cart.reconcileCart([{ ...product, stock: 1, price: 180, slug: 'nuevo-slug' }], [product.id]);
  assert.equal(cart.readCart()[0].cantidad, 1);
  assert.equal(cart.readCart()[0].precio, 180);
  assert.equal(cart.readCart()[0].slug, 'nuevo-slug');
  cart.reconcileCart([], [product.id]);
  assert.equal(cart.readCart()[0].stock, 0);
  assert.throws(() => cart.changeQuantity(product.id, 1));
});

test('una consulta pendiente no resucita productos eliminados ni borra artículos nuevos', () => {
  const { cart } = setup();
  cart.addToCart(product);
  const ids = cart.readCart().map(item => item.id);
  cart.removeFromCart(product.id);
  cart.addToCart({ ...product, id: 'other' });
  cart.reconcileCart([product], ids);
  assert.equal(cart.readCart().length, 1);
  assert.equal(cart.readCart()[0].id, 'other');
});

test('notifica cambios de esta pestaña y de otras; elimina suscripciones', () => {
  const { cart, events, storage } = setup();
  let updates = 0;
  const unsubscribe = cart.subscribeToCart(() => updates++);
  cart.addToCart(product);
  storage.setItem(cart.CART_KEY, '[]');
  const event = new Event('storage');
  event.key = cart.CART_KEY;
  events.dispatchEvent(event);
  assert.equal(updates, 2);
  assert.equal(cart.readCart().length, 0);
  unsubscribe();
  cart.addToCart(product);
  assert.equal(updates, 2);
});

test('un error del almacenamiento informa del fallo y no finge agregar el producto', () => {
  const { cart, storage } = setup();
  storage.setItem = () => { throw new Error('QuotaExceeded'); };
  assert.throws(() => cart.addToCart(product), /No se pudo guardar/);
  assert.equal(cart.readCart().length, 0);
});

function catalogSetup() {
  const { cart, storage } = setup();
  const realId = '33333333-3333-4333-8333-333333333333';
  const remote = { ...product, id: realId, isActive: true };
  const service = { get: async () => remote, list: async () => [remote] };
  const context = vm.createContext({ exports: {}, require: name => {
    if (name === '@/data/products') return { newArrivals: [], moreProducts: [] };
    if (name === '@/lib/catalog') return { apiProductToEcommerce: value => value };
    if (name === '@/services/product.service') return { productService: service };
    if (name === '@/lib/cart') return cart;
    throw new Error(name);
  } });
  vm.runInContext(ts.transpileModule(fs.readFileSync('lib/cart-catalog.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, context);
  return { cart, storage, service, remote, catalog: context.exports };
}

test('agregar un producto real consulta el stock actual en lugar del stock de la tarjeta', async () => {
  const { cart, service, remote, catalog } = catalogSetup();
  let calls = 0;
  service.get = async id => { calls++; assert.equal(id, remote.id); return { ...remote, stock: 1 }; };
  await catalog.addCatalogProduct({ ...remote, stock: 99 });
  await assert.rejects(() => catalog.addCatalogProduct({ ...remote, stock: 99 }));
  assert.equal(calls, 2);
  assert.equal(cart.readCart()[0].cantidad, 1);
});

test('fallos de red e inactividad no agregan artículos; un fallo de consulta conserva los datos', async () => {
  const { cart, storage, service, remote, catalog } = catalogSetup();
  service.get = async () => ({ ...remote, isActive: false });
  await assert.rejects(() => catalog.addCatalogProduct(remote), /no está disponible/);
  assert.equal(cart.readCart().length, 0);
  service.get = async () => { throw new Error('Network'); };
  await assert.rejects(() => catalog.addCatalogProduct(remote), /Network/);
  cart.addToCart(remote);
  const before = storage.getItem(cart.CART_KEY);
  service.list = async () => { throw new Error('Offline'); };
  await assert.rejects(() => catalog.refreshCartStock(), /Offline/);
  assert.equal(storage.getItem(cart.CART_KEY), before);
});
