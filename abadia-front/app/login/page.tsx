import LoginForm from "@/components/LoginForm";
import Image from "next/image";

export const metadata = {
  title: "Iniciar Sesión | Abadia",
  description: "Acceso al panel de administración",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[var(--mv-cream)] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--mv-sage)] opacity-10 blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--mv-blue)] opacity-10 blur-[120px]"></div>
      
      <div className="w-full flex justify-center mb-8 z-10">
        {/* Aquí puedes usar el logo.png que tienes en public */}
        <div className="relative w-40 h-16">
           {/* Fallback por si la imagen no carga, un texto estilizado */}
           <h1 className="text-4xl mv-script text-[var(--mv-ink)] text-center w-full">Abadia</h1>
        </div>
      </div>
      
      <div className="z-10 w-full flex justify-center">
        <LoginForm />
      </div>
      
      <div className="mt-12 text-center text-xs text-gray-400 z-10">
        &copy; {new Date().getFullYear()} Abadia. Todos los derechos reservados.
      </div>
    </div>
  );
}
