import LoginForm from "@/components/LoginForm";
import Image from "next/image";

export const metadata = {
  title: "Iniciar Sesión | Abadia",
  description: "Acceso al panel de administración",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex relative overflow-hidden bg-white">
      
      {/* Lado izquierdo: Formulario */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 z-10 bg-white relative">
        <div className="absolute top-12 left-12 lg:top-16 lg:left-16 max-w-sm hidden sm:block">
          <h2 className="text-3xl font-light mb-2 uppercase tracking-widest font-luxury-title text-[#3d342e]">Panel de Control</h2>
          <p className="text-xs font-light tracking-wider text-gray-500 leading-relaxed">Gestiona la disponibilidad, revisa tus reservas y administra el hotel.</p>
        </div>
        <div className="w-full flex justify-center mb-10">
          <div className="relative w-64 h-28 filter brightness-0">
             <Image 
               src="/logo.png" 
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
          &copy; {new Date().getFullYear()} Abadía. Todos los derechos reservados.
        </div>
      </div>

      {/* Lado derecho: Imagen Profesional */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 bg-[#3d342e]">
        <Image 
          src="/WhatsApp Image 2026-07-06 at 20.33.43.jpeg" 
          alt="Abadia Hotel" 
          fill 
          className="object-cover opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/5 via-black/20 to-black/40"></div>
      </div>

    </div>
  );
}
