"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "../lib/api";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Llamamos al endpoint de NestJS (la cookie jwt vendrá en el header set-cookie)
      const data = await fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (data.user) {
        // Redirigir al panel de administración
        router.push("/admin");
      }
    } catch (err: any) {
      setError(err.message || "Error de inicio de sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-[var(--mv-sage)]/10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[var(--mv-blue)] uppercase tracking-wide">
          Bienvenido
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Ingresa a tu panel de administración
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[var(--mv-ink)] mb-1"
          >
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--mv-blue)] focus:border-transparent transition-all"
            placeholder="admin@ejemplo.com"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[var(--mv-ink)] mb-1"
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--mv-blue)] focus:border-transparent transition-all"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-[var(--mv-blue)] hover:bg-[#0b3c66] text-white rounded-xl font-medium tracking-wider uppercase text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex justify-center items-center"
        >
          {isLoading ? (
            <svg
              className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            "Iniciar Sesión"
          )}
        </button>
      </form>
    </div>
  );
}
