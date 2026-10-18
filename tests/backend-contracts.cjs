const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

// Exercise the real services without credentials or writes to PostgreSQL.
const calls = [];
const cache = new Map();
const response = { ok: true, status: 200, json: async () => ({}), blob: async () => new Blob(['export']) };
const taskEnv = { NEXT_PUBLIC_API_URL: 'https://backend.example/api/' };
function load(file) {
  if (cache.has(file)) return cache.get(file);
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(source, {
    module, exports: module.exports,
    require: name => {
      if (name === '@/lib/api-client') return load('lib/api-client.ts');
      throw new Error(`Unexpected runtime import: ${name}`);
    },
    process: { env: taskEnv }, Headers, FormData, Blob, URLSearchParams,
    window: {}, localStorage: { getItem: key => key === 'auth_token' ? 'session-token' : null },
    fetch: async (url, options) => { calls.push({ url, options }); return response; },
  }, { filename: file });
  cache.set(file, module.exports);
  return module.exports;
}

async function main() {
  const api = load('lib/api-client.ts');
  const { catalogService } = load('services/catalog.service.ts');
  const { productService } = load('services/product.service.ts');
  const { authService } = load('services/auth.service.ts');
  assert.equal(api.getApiUrl('/api/products'), 'https://backend.example/api/products');
  assert.equal(api.getApiUrl('/admin/products'), 'https://backend.example/api/admin/products');
  await productService.list();
  assert.equal(calls.at(-1).url, 'https://backend.example/api/products');
  assert.equal(calls.at(-1).options.headers.get('Authorization'), 'Bearer session-token');
  const product = { name: 'Taladro', sku: 'T-1', price: 100, stock: 5, imageUrl: 'https://example.com/image.jpg', active: false };
  await catalogService.createProduct(product);
  assert.equal(calls.at(-1).url, 'https://backend.example/api/admin/products');
  assert.equal(JSON.parse(calls.at(-1).options.body).active, false);
  const file = new File(['image'], 'product.png', { type: 'image/png' });
  await catalogService.createProduct(product, file);
  let call = calls.at(-1);
  assert.equal(call.url, 'https://backend.example/api/products');
  assert.equal(call.options.headers.has('Content-Type'), false);
  assert.equal(call.options.body.get('file').name, 'product.png');
  assert.equal(call.options.body.get('active'), 'false');
  await catalogService.updateProduct('product-id', product, file);
  assert.equal(calls.at(-1).options.method, 'PUT');
  assert.equal(calls.at(-1).url, 'https://backend.example/api/products/product-id');
  await catalogService.listInventory({ page: 0, size: 20, stockStatus: 'LOW' });
  const inventoryUrl = new URL(calls.at(-1).url);
  assert.equal(inventoryUrl.pathname, '/api/admin/products/inventory');
  assert.equal(inventoryUrl.searchParams.get('stockStatus'), 'LOW');
  await catalogService.downloadInventory('xlsx', new URLSearchParams({ stockStatus: 'LOW' }));
  call = calls.at(-1);
  assert.equal(call.url, 'https://backend.example/api/admin/products/inventory/export.xlsx?stockStatus=LOW');
  assert.equal(call.options.headers.Authorization, 'Bearer session-token');
  await authService.loginWithGoogle('google-credential');
  assert.equal(calls.at(-1).url, 'https://backend.example/api/v1/auth/google');
  assert.deepEqual(JSON.parse(calls.at(-1).options.body), { credential: 'google-credential' });
  await api.fetchFromAPI('/v1/auth/me', { headers: { Authorization: 'Bearer explicit-token' } });
  assert.equal(calls.at(-1).options.headers.get('Authorization'), 'Bearer explicit-token');
  console.log('Contratos verificados: URLs, JWT, JSON, multipart, inventario, exportación y Google.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
