// app/(legal)/privacidad/page.tsx
// URL pública: /privacidad
// Requisito de Meta: "URL de la política de privacidad" para publicar la app
// de Facebook (también sirve como página de privacidad para Google OAuth).
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | NEXORA STORE",
  description:
    "Cómo NEXORA STORE & Logistics recopila, usa, comparte y protege tus datos personales.",
};

const LAST_UPDATE = "18 de octubre de 2026";
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

export default function PoliticaDePrivacidadPage() {
  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-wide">
        Política de Privacidad
      </h1>
      <p className="mt-2 text-xs text-slate-400 font-medium">
        Última actualización: {LAST_UPDATE}
      </p>

      <p className={`${p} mt-6`}>
        Esta política explica qué datos personales recopila NEXORA STORE &amp; Logistics
        («NEXORA», «nosotros») a través de su tienda en línea y de sus servicios de
        logística, para qué los usamos, con quién los compartimos y cómo puedes ejercer
        tus derechos.
      </p>

      <Section title="1. Responsable del tratamiento">
        <p className={p}>
          NEXORA STORE &amp; Logistics, con domicilio en Lima, Perú. Para cualquier
          consulta sobre esta política puedes escribirnos a{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-purple-600 font-medium hover:text-purple-700"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </Section>

      <Section title="2. Datos que recopilamos">
        <ul className={ul}>
          <li>
            <strong>Datos de cuenta:</strong> nombre completo, correo electrónico y, de
            forma opcional, número de teléfono y foto de perfil.
          </li>
          <li>
            <strong>Credenciales:</strong> tu contraseña se almacena únicamente como un
            <em> hash</em> criptográfico irreversible (bcrypt). Nunca guardamos ni podemos
            leer tu contraseña en texto claro.
          </li>
          <li>
            <strong>Datos de acceso e identidad:</strong> fecha de creación y actualización
            de la cuenta, estado de la cuenta y el proveedor con el que iniciaste sesión
            (correo y contraseña, Google o Facebook), junto con el identificador que dicho
            proveedor nos entrega.
          </li>
          <li>
            <strong>Recuperación de contraseña:</strong> cuando solicitas restablecerla,
            registramos un token temporal, su fecha de expiración, si fue usado y la
            <strong> dirección IP</strong> desde la que se solicitó, con fines de seguridad.
          </li>
          <li>
            <strong>Datos de pedidos y envíos:</strong> la información necesaria para
            gestionar tus compras y entregas.
          </li>
        </ul>
        <p className={p}>
          No procesamos pagos con tarjeta ni almacenamos datos financieros: la tienda no
          integra una pasarela de pagos.
        </p>
      </Section>

      <Section title="3. Para qué usamos tus datos">
        <ul className={ul}>
          <li>Crear y administrar tu cuenta, y autenticar tu acceso al sitio.</li>
          <li>Gestionar pedidos, envíos, devoluciones y el panel de administración.</li>
          <li>Enviarte correos de recuperación de contraseña cuando lo solicitas.</li>
          <li>
            Mantener la seguridad del servicio: detectar accesos indebidos, abusos o
            intentos de fraude.
          </li>
          <li>Atender tus consultas y solicitudes de soporte.</li>
        </ul>
      </Section>

      <Section title="4. Base legal">
        <p className={p}>
          Tratamos tus datos con base en tu consentimiento (que otorgas al crear la cuenta
          o al iniciar sesión con un proveedor externo) y en la ejecución de la relación
          contractual cuando realizas una compra. Aplicamos la Ley N.º 29733, Ley de
          Protección de Datos Personales del Perú, y su reglamento.
        </p>
      </Section>

      <Section title="5. Con quién compartimos tus datos">
        <p className={p}>
          Solo compartimos los datos con proveedores que nos permiten operar el servicio,
          en calidad de encargados del tratamiento:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-slate-600 border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="text-left font-semibold px-3 py-2">Proveedor</th>
                <th className="text-left font-semibold px-3 py-2">Finalidad</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-200">
                <td className="px-3 py-2">InsForge</td>
                <td className="px-3 py-2">Alojamiento de la base de datos PostgreSQL.</td>
              </tr>
              <tr className="border-t border-slate-200">
                <td className="px-3 py-2">Render</td>
                <td className="px-3 py-2">Alojamiento de la aplicación y del sitio web.</td>
              </tr>
              <tr className="border-t border-slate-200">
                <td className="px-3 py-2">Cloudinary</td>
                <td className="px-3 py-2">
                  Almacenamiento y entrega de imágenes (fotos de perfil y de producto).
                </td>
              </tr>
              <tr className="border-t border-slate-200">
                <td className="px-3 py-2">Google</td>
                <td className="px-3 py-2">
                  Inicio de sesión con Google, si eliges ese método.
                </td>
              </tr>
              <tr className="border-t border-slate-200">
                <td className="px-3 py-2">Meta (Facebook)</td>
                <td className="px-3 py-2">
                  Inicio de sesión con Facebook, si eliges ese método.
                </td>
              </tr>
              <tr className="border-t border-slate-200">
                <td className="px-3 py-2">Proveedor de correo</td>
                <td className="px-3 py-2">Envío de correos de recuperación de contraseña.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className={p}>
          <strong>No vendemos, alquilamos ni cedemos tus datos personales</strong> a
          terceros con fines publicitarios. Podemos divulgar información si una norma legal
          o una autoridad competente nos lo exige.
        </p>
      </Section>

      <Section title="6. Transferencias internacionales">
        <p className={p}>
          Algunos de los proveedores indicados se encuentran fuera del Perú (por ejemplo,
          en Estados Unidos). Al utilizar el servicio aceptas que tus datos sean tratados en
          esas jurisdicciones, siempre bajo las condiciones contractuales y de seguridad de
          cada proveedor.
        </p>
      </Section>

      <Section title="7. Conservación de los datos">
        <p className={p}>
          Conservamos tus datos mientras tu cuenta permanezca activa. Si solicitas la
          eliminación, los borraremos en un plazo máximo de 30 días, salvo aquellos que
          debamos conservar por una obligación legal. Puedes consultar el procedimiento en
          nuestra página de{" "}
          <a
            href="/eliminacion-de-datos"
            className="text-purple-600 font-medium hover:text-purple-700"
          >
            Eliminación de datos
          </a>
          .
        </p>
      </Section>

      <Section title="8. Cookies y almacenamiento local">
        <p className={p}>
          No utilizamos cookies de publicidad ni de seguimiento de terceros. Guardamos tu
          token de sesión y los datos básicos de tu perfil en el almacenamiento local
          (<em>localStorage</em>) de tu navegador, con la única finalidad de mantener la
          sesión iniciada. Esa información se elimina cuando cierras sesión o limpias los
          datos del navegador.
        </p>
      </Section>

      <Section title="9. Seguridad">
        <p className={p}>
          Aplicamos medidas técnicas razonables: contraseñas con hash bcrypt, cifrado en
          tránsito mediante HTTPS, tokens de sesión firmados y con caducidad, y acceso
          restringido a la base de datos. Ningún sistema es infalible; si detectas una
          vulnerabilidad, escríbenos a {CONTACT_EMAIL}.
        </p>
      </Section>

      <Section title="10. Tus derechos">
        <p className={p}>
          Puedes ejercer tus derechos de <strong>acceso</strong> (conocer qué datos
          tenemos), <strong>rectificación</strong> (corregir datos inexactos),{" "}
          <strong>cancelación</strong> (solicitar su eliminación) y{" "}
          <strong>oposición</strong> al tratamiento, escribiendo a{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-purple-600 font-medium hover:text-purple-700"
          >
            {CONTACT_EMAIL}
          </a>
          . Desde tu perfil también puedes actualizar tu nombre, teléfono y foto.
        </p>
        <p className={p}>
          Si consideras que no atendimos tu solicitud correctamente, puedes acudir a la
          Autoridad Nacional de Protección de Datos Personales del Ministerio de Justicia y
          Derechos Humanos del Perú.
        </p>
      </Section>

      <Section title="11. Menores de edad">
        <p className={p}>
          El servicio está dirigido a personas mayores de 18 años. No recopilamos
          conscientemente datos de menores; si detectamos una cuenta de un menor sin
          autorización de su tutor, la eliminaremos.
        </p>
      </Section>

      <Section title="12. Cambios en esta política">
        <p className={p}>
          Podemos actualizar esta política para reflejar cambios en el servicio o en la
          normativa. Publicaremos siempre la fecha de la última actualización en la parte
          superior de esta página.
        </p>
      </Section>

      <Section title="13. Contacto">
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
      </Section>
    </>
  );
}
