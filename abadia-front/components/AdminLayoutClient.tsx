"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { fetchApi, API_URL } from "../lib/api";
import Link from "next/link";
import Image from "next/image";
import {
  HomeIcon,
  UsersIcon,
  CalendarDaysIcon,
  KeyIcon,
  CalendarIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  BanknotesIcon,
  DocumentTextIcon,
  ChartBarIcon,
  BriefcaseIcon,
  ClipboardDocumentListIcon,
  ClipboardDocumentCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon
} from "@heroicons/react/24/outline";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/Tooltip";
import { useAuthStore } from "../store/authStore";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: HomeIcon, roles: ["superadmin", "admin", "supervisor", "empleado", "employee"] },
  { name: "Calendario", href: "/admin/calendario", icon: CalendarDaysIcon, roles: ["superadmin", "admin", "supervisor", "empleado", "employee"] },
  { name: "Clientes", href: "/admin/clientes", icon: UsersIcon, roles: ["superadmin", "admin", "supervisor", "empleado", "employee"] },
  { name: "Cotizaciones y Reservas", href: "/admin/cotizaciones-reservas", icon: ClipboardDocumentListIcon, roles: ["superadmin", "admin", "supervisor"] },
  { name: "Habitaciones", href: "/admin/habitaciones", icon: KeyIcon, roles: ["superadmin", "admin", "supervisor"] },
  { name: "Tareas", href: "/admin/tareas", icon: ClipboardDocumentCheckIcon, roles: ["superadmin", "admin", "supervisor", "empleado", "employee"] },
  { name: "Empleados", href: "/admin/empleados", icon: BriefcaseIcon, roles: ["superadmin", "admin"] },
  { name: "Finanzas", href: "/admin/finanzas", icon: ChartBarIcon, roles: ["superadmin", "admin"] },
  { name: "Configuración", href: "/admin/settings", icon: Cog6ToothIcon, roles: ["superadmin", "admin"] },
];

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading: loading, checkSession, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sidebar collapse state: default true (collapsed pill mode)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    // Read persisted sidebar state from localStorage
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("admin_sidebar_collapsed");
      if (savedState !== null) {
        setIsCollapsed(savedState === "true");
      } else {
        setIsCollapsed(true); // Default collapsed
      }
      setIsMounted(true);
    }
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(prev => {
      const nextState = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("admin_sidebar_collapsed", String(nextState));
      }
      return nextState;
    });
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("google") === "success") {
        setToastMessage("¡Google Calendar conectado exitosamente!");
        window.history.replaceState({}, document.title, pathname);
        setTimeout(() => setToastMessage(null), 5000);
      }
    }
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
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
        <aside className={`${
          isCollapsed ? 'w-20' : 'w-64'
        } bg-white border-r border-[var(--mv-sage)]/10 flex flex-col justify-between transition-all duration-300 shadow-sm z-20 relative`}>
          <div>
            {/* Header / Logo */}
            <div className="h-20 flex items-center justify-between px-4 border-b border-[var(--mv-sage)]/10 w-full relative">
              <div className="flex items-center justify-center w-full">
                {!isCollapsed ? (
                  <Image
                    src="/abadia.png"
                    alt="Abadia Logo"
                    width={80}
                    height={80}
                    className="object-contain transition-all duration-300"
                    priority
                  />
                ) : (
                  <Image
                    src="/abadia.png"
                    alt="Abadia Logo"
                    width={38}
                    height={38}
                    className="object-contain transition-all duration-300"
                    priority
                  />
                )}
              </div>

              {/* Collapse Button inside Sidebar */}
              <button 
                onClick={toggleSidebar}
                className="absolute -right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-600 hover:text-[var(--mv-blue)] hover:scale-110 transition-all z-30"
                title={isCollapsed ? "Expandir Menú" : "Contraer Menú"}
              >
                {isCollapsed ? (
                  <ChevronRightIcon className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  <ChevronLeftIcon className="w-4 h-4 stroke-[2.5]" />
                )}
              </button>
            </div>

            {/* Navigation items */}
            <nav className="mt-6 flex flex-col gap-2 px-3">
              {navigation.filter(item => {
                if (!user.rol) return true;
                const userRoleNorm = user.rol.toLowerCase().replace(/_/g, '');
                return item.roles.some(r => r.toLowerCase().replace(/_/g, '') === userRoleNorm);
              }).map((item) => {
                const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
                return (
                  <Tooltip key={item.name}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={`group flex items-center ${isCollapsed ? 'justify-center px-0 py-3' : 'px-4 py-3'} rounded-xl transition-all ${
                          isActive
                            ? "bg-[var(--mv-blue)] text-white shadow-md"
                            : "text-gray-500 hover:bg-[var(--mv-blue)]/10 hover:text-[var(--mv-blue)]"
                        }`}
                      >
                        <div className={`flex w-full ${isCollapsed ? 'justify-center' : 'justify-start'} items-center`}>
                          <item.icon className="w-6 h-6 shrink-0" />
                          {!isCollapsed && (
                            <span className="ml-3 text-sm font-medium whitespace-nowrap animate-in fade-in duration-200">
                              {item.name}
                            </span>
                          )}
                        </div>
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right">
                        {item.name}
                      </TooltipContent>
                    )}
                  </Tooltip>
                );
              })}
            </nav>
          </div>

          {/* Footer / Logout */}
          <div className="p-3 border-t border-[var(--mv-sage)]/10">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0 py-3' : 'px-4 py-3'} rounded-xl text-red-500 hover:bg-red-50 transition-colors`}
                >
                  <ArrowLeftOnRectangleIcon className="w-6 h-6 shrink-0" />
                  {!isCollapsed && (
                    <span className="ml-3 text-sm font-medium whitespace-nowrap">Cerrar Sesión</span>
                  )}
                </button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" className="text-red-100 bg-red-600">
                  Cerrar Sesión
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col relative overflow-hidden">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="absolute top-4 right-8 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">{toastMessage}</span>
            </div>
          )}

          <header className="h-20 bg-white/80 backdrop-blur-md border-b border-[var(--mv-sage)]/10 flex items-center justify-between px-6 z-10">
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleSidebar}
                className="p-2 rounded-xl text-gray-500 hover:text-[var(--mv-blue)] hover:bg-gray-100 transition-colors"
                title={isCollapsed ? "Expandir Sidebar" : "Contraer Sidebar"}
              >
                <Bars3Icon className="w-6 h-6 stroke-[2]" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <a
                href={`${API_URL}/google-calendar/auth`}
                className="hidden md:flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z" />
                </svg>
                Vincular Calendario
              </a>
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

