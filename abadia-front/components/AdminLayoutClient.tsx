"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { fetchApi } from "../lib/api";
import Link from "next/link";
import {
  HomeIcon,
  UsersIcon,
  CalendarDaysIcon,
  KeyIcon,
  CalendarIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/Tooltip";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: HomeIcon },
  { name: "Calendario", href: "/admin/calendario", icon: CalendarIcon },
  { name: "Reservas", href: "/admin/reservas", icon: CalendarDaysIcon },
  { name: "Habitaciones", href: "/admin/habitaciones", icon: KeyIcon },
  { name: "Clientes", href: "/admin/clientes", icon: UsersIcon },
  { name: "Configuración", href: "/admin/settings", icon: Cog6ToothIcon },
];

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const data = await fetchApi("/auth/check-session");
        if (data && data.user) {
          setUser(data.user);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error verificando sesión:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetchApi("/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--mv-cream)]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[var(--mv-blue)] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm text-[var(--mv-ink)] tracking-widest uppercase">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-screen bg-[var(--mv-cream)] overflow-hidden">
        {/* Sidebar */}
        <aside className="w-20 lg:w-64 bg-white border-r border-[var(--mv-sage)]/10 flex flex-col justify-between transition-all duration-300 shadow-sm z-20">
          <div>
            <div className="h-20 flex items-center justify-center lg:justify-start lg:px-8 border-b border-[var(--mv-sage)]/10">
              <span className="mv-script text-2xl lg:text-3xl text-[var(--mv-ink)] hidden lg:block">Abadia</span>
              <span className="mv-script text-2xl text-[var(--mv-ink)] lg:hidden">A</span>
            </div>
            
            <nav className="mt-6 flex flex-col gap-2 px-3">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Tooltip key={item.name}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={`group flex items-center lg:px-4 py-3 rounded-xl transition-all ${
                          isActive
                            ? "bg-[var(--mv-blue)] text-white shadow-md"
                            : "text-gray-500 hover:bg-[var(--mv-blue)]/10 hover:text-[var(--mv-blue)]"
                        }`}
                      >
                        <div className="flex w-full justify-center lg:justify-start items-center">
                          <item.icon className="w-6 h-6 shrink-0" />
                          <span className="ml-3 hidden lg:block text-sm font-medium">{item.name}</span>
                        </div>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="lg:hidden">
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-[var(--mv-sage)]/10">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center lg:justify-start lg:px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                >
                  <ArrowLeftOnRectangleIcon className="w-6 h-6 shrink-0" />
                  <span className="ml-3 hidden lg:block text-sm font-medium">Cerrar Sesión</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="lg:hidden text-red-100 bg-red-600">
                Cerrar Sesión
              </TooltipContent>
            </Tooltip>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="h-20 bg-white/80 backdrop-blur-md border-b border-[var(--mv-sage)]/10 flex items-center justify-between px-8 z-10">
            <h1 className="text-xl font-semibold text-[var(--mv-ink)] tracking-wide">
              {navigation.find((n) => pathname === n.href || pathname.startsWith(n.href + "/"))?.name || "Panel"}
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-[var(--mv-ink)]">{user.username}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{user.rol}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[var(--mv-blue)]/10 flex items-center justify-center text-[var(--mv-blue)] font-bold border border-[var(--mv-blue)]/20 shadow-inner">
                {user.username.charAt(0).toUpperCase()}
              </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto p-8 mv-scrollbar">
            {children}
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
