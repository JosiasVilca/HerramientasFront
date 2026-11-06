// app/(legal)/terms/page.tsx
// URL pública: /terms
// Términos y condiciones de uso del sitio. Enlazada desde el formulario de
// registro y desde el pie de página de la tienda.
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones | NEXORA STORE",
  description:
    "Términos y condiciones de uso de la tienda y de los servicios de NEXORA STORE & Logistics.",
};

const LAST_UPDATE = "19 de octubre de 2026";
const CONTACT_EMAIL = "ventas@nexora.pe";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
        {title}
      </h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

const p = "text-sm text-slate-600 leading-relaxed";
const ul = "list-disc pl-5 space-y-1.5 text-sm text-slate-600 leading-relaxed";

export default function TerminosYCondicionesPage() {
  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-wide">
        Términos y Condiciones
      </h1>
      <p className="mt-2 text-xs text-slate-400 font-medium">
        Última actualización: {LAST_UPDATE}
      </p>

      <p className={`${p} mt-6`}>
        Estos términos regulan el uso del sitio web y de los servicios de NEXORA STORE
        &amp; Logistics («NEXORA», «nosotros»). Al crear una cuenta, iniciar sesión o
        utilizar la tienda, aceptas estas condiciones en su totalidad.
      </p>

      <Section title="1. Aceptación de los términos">
        <p className={p}>
          Para usar el servicio debes leer y aceptar estos términos. Si no estás de
          acuerdo con alguna de las condiciones, no debes utilizar el sitio. Si utilizas
          el servicio en nombre de una empresa, declaras contar con facultades suficientes
          para obligarla.
        </p>
      </Section>

      <Section title="2. Descripción del servicio">
        <p className={p}>
          NEXORA es una plataforma que combina una tienda en línea de productos
          tecnológicos con servicios de logística y seguimiento de envíos. El sitio te
          permite consultar el catálogo, gestionar tu cuenta y, según tu rol, acceder a
          herramientas de administración de inventario y de gestión de envíos.
        </p>
        <p className={p}>
          El servicio se ofrece en la modalidad y con las funcionalidades disponibles en
          cada momento. Podemos añadir, modificar o retirar funcionalidades para mejorar
          la plataforma o por razones técnicas y legales.
        </p>
      </Section>

      <Section title="3. Registro y cuenta">
        <ul className={ul}>
          <li>
            Debes ser mayor de edad y proporcionar información veraz, exacta y
            actualizada al registrarte.
          </li>
          <li>
            Puedes crear tu cuenta con correo y contraseña, o mediante un proveedor
            externo como Google o Facebook. En ese caso, aplican también las condiciones
            de dicho proveedor.
          </li>
          <li>
            Eres responsable de mantener la confidencialidad de tu contraseña y de toda
            actividad realizada desde tu cuenta. Notifícanos de inmediato cualquier uso
            no autorizado.
          </li>
          <li>
            Los roles de administración se asignan únicamente por NEXORA. El
            auto-registro crea siempre una cuenta de cliente.
          </li>
        </ul>
      </Section>

      <Section title="4. Uso aceptable">
        <p className={p}>Al utilizar el servicio te comprometes a no:</p>
        <ul className={ul}>
          <li>
            Acceder a áreas, cuentas o datos para los que no cuentas con autorización.
          </li>
          <li>
            Realizar acciones que afecten la disponibilidad, integridad o seguridad del
            sitio, como ataques, automatizaciones abusivas o intentos de eludir la
            autenticación.
          </li>
          <li>
            Publicar contenido ilícito, ofensivo o que vulnere derechos de terceros,
            incluida la propiedad intelectual.
          </li>
          <li>
            Suplantar la identidad de otra persona o de NEXORA, o crear cuentas con datos
            falsos.
          </li>
        </ul>
        <p className={p}>
          El incumplimiento de estas reglas puede dar lugar a la suspensión o cancelación
          de tu cuenta, sin perjuicio de las acciones legales que correspondan.
        </p>
      </Section>

      <Section title="5. Productos, precios y disponibilidad">
        <ul className={ul}>
          <li>
            La información del catálogo se ofrece de forma referencial. Podemos corregir
            errores evidentes de descripción, imagen, precio o stock.
          </li>
          <li>
            Los precios se expresan en soles peruanos (PEN) e incluyen los impuestos
            aplicables, salvo que se indique lo contrario.
          </li>
          <li>
            La disponibilidad está sujeta al stock registrado. Si un producto se agota
            después de tu pedido, te lo comunicaremos para acordar una alternativa o la
            anulación correspondiente.
          </li>
          <li>
            Las imágenes son ilustrativas y pueden presentar variaciones respecto del
            producto final.
          </li>
        </ul>
      </Section>

      <Section title="6. Pedidos y entregas">
        <p className={p}>
          Los pedidos quedan sujetos a confirmación y a la disponibilidad del producto.
          Las fechas estimadas de entrega son referenciales y pueden variar por causas
          ajenas a nuestro control, como condiciones climáticas, restricciones de tránsito
          o incidencias del transportista.
        </p>
        <p className={p}>
          Es tu responsabilidad proporcionar una dirección de entrega correcta y estar
          disponible para recibir el pedido. Si necesitas coordinar un cambio, escríbenos
          antes de que el envío salga a ruta.
        </p>
      </Section>

      <Section title="7. Pagos">
        <p className={p}>
          Este sitio <strong>no integra una pasarela de pagos</strong> ni procesa datos de
          tarjetas o información financiera. Las condiciones de pago se acuerdan de forma
          directa con NEXORA al momento de concretar una compra.
        </p>
      </Section>

      <Section title="8. Propiedad intelectual">
        <p className={p}>
          El nombre NEXORA, su identidad visual, los textos, el diseño del sitio y el
          código que lo soporta son propiedad de NEXORA STORE &amp; Logistics o de sus
          licenciantes, y están protegidos por la normativa de propiedad intelectual. No
          se permite su reproducción, distribución ni uso comercial sin autorización
          previa por escrito.
        </p>
        <p className={p}>
          Las marcas y logotipos de terceros que aparecen en el catálogo pertenecen a sus
          respectivos titulares y se muestran únicamente con fines de identificación del
          producto.
        </p>
      </Section>

      <Section title="9. Contenido que publicas">
        <p className={p}>
          Cuando subes contenido a tu perfil, como una foto de avatar, conservas su
          titularidad, pero nos otorgas una autorización para almacenarlo y mostrarlo con
          la única finalidad de prestar el servicio. Declaras contar con los derechos
          necesarios sobre ese contenido.
        </p>
      </Section>

      <Section title="10. Servicios de terceros">
        <p className={p}>
          El sitio se apoya en proveedores externos de alojamiento, base de datos,
          almacenamiento de imágenes, correo electrónico e inicio de sesión. El uso de sus
          funcionalidades puede quedar sujeto a las condiciones propias de esos
          proveedores. El detalle de los datos que comparten con nosotros figura en nuestra
          Política de Privacidad.
        </p>
      </Section>

      <Section title="11. Suspensión y cancelación">
        <p className={p}>
          Podemos suspender o cancelar tu cuenta si incumples estos términos, si
          detectamos un uso fraudulento o si la ley nos lo exige. También puedes cancelar
          tu cuenta en cualquier momento solicitando la eliminación de tus datos según el
          procedimiento publicado en nuestro sitio.
        </p>
      </Section>

      <Section title="12. Limitación de responsabilidad">
        <p className={p}>
          El servicio se presta sobre la base de un esfuerzo razonable. En la medida en
          que la ley lo permita, NEXORA no responde por daños indirectos, lucro cesante ni
          pérdida de datos derivados del uso o de la imposibilidad de usar el sitio, ni por
          interrupciones ajenas a su control. Nada en esta cláusula excluye los derechos
          que la normativa de protección al consumidor te reconoce.
        </p>
      </Section>

      <Section title="13. Modificaciones de los términos">
        <p className={p}>
          Podemos actualizar estos términos para reflejar cambios en el servicio o en la
          normativa. Publicaremos siempre la fecha de la última actualización en la parte
          superior de esta página. El uso continuado del sitio después de una
          actualización implica su aceptación.
        </p>
      </Section>

      <Section title="14. Ley aplicable y jurisdicción">
        <p className={p}>
          Estos términos se rigen por las leyes de la República del Perú. Cualquier
          controversia se someterá a los tribunales competentes de Lima, Perú, sin
          perjuicio de tu derecho a acudir a los mecanismos de protección al consumidor.
        </p>
      </Section>

      <Section title="15. Contacto">
        <p className={p}>
          Correo:{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-purple-600 font-medium hover:text-purple-700"
          >
            {CONTACT_EMAIL}
          </a>
          <br />
          Lima, Perú.
        </p>
        <p className={p}>
          Consulta también nuestra{" "}
          <a
            href="/privacidad"
            className="text-purple-600 font-medium hover:text-purple-700"
          >
            Política de Privacidad
          </a>{" "}
          y las instrucciones de{" "}
          <a
            href="/eliminacion-de-datos"
            className="text-purple-600 font-medium hover:text-purple-700"
          >
            Eliminación de datos
          </a>
          .
        </p>
      </Section>
    </>
  );
}
