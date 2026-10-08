"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { EyeIcon, EyeSlashIcon, LockClosedIcon } from "@heroicons/react/24/outline";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuthStore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("remember_email");
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = await fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (data.user) {
        setUser(data.user);

        // Manage Remember Me in localStorage
        if (typeof window !== "undefined") {
          if (rememberMe) {
            localStorage.setItem("remember_email", email);
          } else {
            localStorage.removeItem("remember_email");
          }
        }

        router.push("/admin");
      }
    } catch (err: any) {
      setError(err.message || "Error de inicio de sesión. Revisa tus credenciales.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl border border-[var(--mv-sage)]/10">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-blue-50 text-[var(--mv-blue)] rounded-2xl flex items-center justify-center mx-auto mb-3 border border-blue-100 shadow-xs">
          <LockClosedIcon className="w-7 h-7 stroke-[2]" />
        </div>
        <h2 className="text-2xl font-extrabold text-[var(--mv-ink)] uppercase tracking-wide">
          Bienvenido
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Ingresa tus credenciales para acceder al panel de administración
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200 animate-in fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" method="POST" action="#">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Correo Electrónico
          </label>
          <input
            id="email"
            name="username"
            type="email"
            autoComplete="username email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--mv-blue)]/30 focus:border-[var(--mv-blue)] transition-all bg-slate-50/50 focus:bg-white"
            placeholder="admin@ejemplo.com"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-2xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--mv-blue)]/30 focus:border-[var(--mv-blue)] transition-all bg-slate-50/50 focus:bg-white"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5 stroke-[2]" />
              ) : (
                <EyeIcon className="w-5 h-5 stroke-[2]" />
              )}
            </button>
          </div>
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded text-[var(--mv-blue)] focus:ring-[var(--mv-blue)]/30 border-slate-300 w-4 h-4 cursor-pointer"
            />
            <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
              Recordarme en este navegador
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-[var(--mv-blue)] to-[#0b3c66] hover:from-[#0b3c66] hover:to-[#082a48] text-white rounded-2xl font-bold tracking-wider uppercase text-xs transition-all shadow-md shadow-blue-900/10 hover:shadow-lg disabled:opacity-70 flex justify-center items-center"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Verificando...</span>
            </div>
          ) : (
            "Iniciar Sesión"
          )}
        </button>
      </form>
    </div>
  );
}
