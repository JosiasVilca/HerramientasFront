// app/(legal)/eliminacion-de-datos/page.tsx
// URL pública: /eliminacion-de-datos
// Requisito de Meta: "URL de instrucciones para la eliminación de datos" de la app
// de Facebook. Explica cómo solicitar el borrado de los datos personales, incluidos
// los obtenidos al iniciar sesión con Facebook.
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eliminación de datos | NEXORA STORE",
  description:
    "Cómo solicitar la eliminación de tus datos personales en NEXORA STORE & Logistics.",
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

export default function EliminacionDeDatosPage() {
  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-wide">
        Eliminación de datos
      </h1>
      <p className="mt-2 text-xs text-slate-400 font-medium">
        Última actualización: {LAST_UPDATE}
      </p>

      <p className={`${p} mt-6`}>
        En NEXORA STORE &amp; Logistics puedes solicitar en cualquier momento la
        eliminación de los datos personales que tenemos sobre ti. Esto incluye los datos
        que obtuvimos cuando creaste tu cuenta o cuando iniciaste sesión con{" "}
        <strong>Facebook</strong> o Google.
      </p>

      <Section title="Cómo solicitar la eliminación">
        <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-600 leading-relaxed">
          <li>
            Envía un correo a{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-purple-600 font-medium hover:text-purple-700"
            >
              {CONTACT_EMAIL}
            </a>{" "}
            <strong>desde la misma dirección de correo con la que creaste la cuenta</strong>,
            con el asunto «Eliminación de datos».
          </li>
          <li>
            Indícanos tu nombre completo y, si lo recuerdas, con qué método iniciaste sesión
            (correo y contraseña, Google o Facebook).
          </li>
          <li>
            Te confirmaremos la recepción de la solicitud y, para proteger tu cuenta, te
            pediremos una verificación sencilla de identidad. El proceso se realizará desde
            el correo registrado.
          </li>
          <li>
            Una vez verificada la solicitud, eliminaremos tus datos y te enviaremos un correo
            de confirmación.
          </li>
        </ol>
        <p className={p}>
          No es necesario que tengas la sesión abierta ni que descargues nada.
        </p>
      </Section>

      <Section title="Qué datos eliminamos">
        <ul className={ul}>
          <li>Tu cuenta y tus credenciales de acceso.</li>
          <li>Nombre completo, correo electrónico y número de teléfono.</li>
          <li>Tu foto de perfil almacenada en nuestro proveedor de imágenes.</li>
          <li>
            El identificador que nos entregó el proveedor con el que iniciaste sesión (Google
            o Facebook).
          </li>
          <li>
            Los tokens de recuperación de contraseña, junto con la dirección IP y las marcas
            de tiempo asociadas.
          </li>
        </ul>
      </Section>

      <Section title="Qué podemos conservar y por qué">
        <p className={p}>
          Únicamente conservaremos, de forma bloqueada y por el tiempo estrictamente
          necesario, aquella información que una obligación legal o contable nos exija
          mantener (por ejemplo, el respaldo de una operación comercial). Esos datos no se
          usarán para ninguna otra finalidad y se eliminarán al vencer el plazo legal.
        </p>
        <p className={p}>
          Cuando conservemos registros de pedidos, los anonimizaremos para que no permitan
          identificarte.
        </p>
      </Section>

      <Section title="Plazo">
        <p className={p}>
          Atenderemos tu solicitud en un plazo máximo de <strong>30 días</strong> desde que
          confirmemos tu identidad.
        </p>
      </Section>

      <Section title="Si solo quieres revocar el acceso de Facebook">
        <p className={p}>
          Si tu intención no es eliminar tu cuenta, sino dejar de usar Facebook para iniciar
          sesión, puedes revocar el acceso desde Facebook:{" "}
          <em>Configuración y privacidad → Configuración → Aplicaciones y sitios web</em>,
          busca NEXORA STORE y selecciona «Eliminar». Tu cuenta seguirá existiendo y podrás
          acceder con tu correo y contraseña o con Google.
        </p>
      </Section>

      <Section title="Contacto">
        <p className={p}>
          Correo para solicitudes de privacidad:{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-purple-600 font-medium hover:text-purple-700"
          >
            {CONTACT_EMAIL}
          </a>
          <br />
          Consulta también nuestra{" "}
          <a
            href="/privacidad"
            className="text-purple-600 font-medium hover:text-purple-700"
          >
            Política de Privacidad
          </a>
          .
        </p>
      </Section>
    </>
  );
}
