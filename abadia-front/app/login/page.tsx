import LoginForm from "@/components/LoginForm";
import Image from "next/image";
import { API_URL } from "@/lib/api";

export const metadata = {
  title: "Iniciar Sesión | Abadia",
  description: "Acceso al panel de administración",
};

async function getSettings() {
  try {
    const res = await fetch(`${API_URL}/settings`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.data || []);
  } catch (e) {
    return [];
  }
}

export default async function LoginPage() {
  const settings = await getSettings();
  const getSetting = (key: string, def: string) => {
    const s = settings.find((x: any) => x.key === key);
    return s && s.value ? s.value : def;
  };

  const logoUrl = getSetting('logo_principal', '/logo.png');
  const bgUrl = getSetting('login_bg', '/WhatsApp Image 2026-07-06 at 20.33.43.jpeg');

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-white">

      {/* Lado izquierdo: Formulario */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 z-10 bg-white relative">
        <div className="absolute top-12 left-12 lg:top-16 lg:left-16 max-w-sm hidden sm:block">
        </div>
        <div className="w-full flex justify-center mb-10">
          <div className="relative w-64 h-28 filter brightness-0">
            <Image
              src={logoUrl}
              alt="Abadía Hotel Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="w-full flex justify-center">
          <LoginForm />
        </div>

        <div className="mt-16 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} {getSetting('nombre_hotel', 'Abadía')}. Todos los derechos reservados.
        </div>
      </div>

      {/* Lado derecho: Imagen Profesional */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 bg-[#3d342e]">
        <Image
          src={bgUrl}
          alt="Abadia Hotel"
          fill
          className="object-cover opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-l from-black/5 via-black/20 to-black/40"></div>
      </div>

    </div>
  );
}
