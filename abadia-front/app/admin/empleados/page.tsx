"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import EmpleadoModal from "@/components/EmpleadoModal";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";

export default function EmpleadosPage() {
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEmpleados = async (search = "") => {
    setLoading(true);
    try {
      // The backend uses /users endpoint
      const url = search ? `/users?search=${encodeURIComponent(search)}&limit=50` : "/users?limit=50";
      const response = await fetchApi(url);
      setEmpleados(response.data || response || []);
    } catch (error) {
      console.error("Error cargando empleados", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Implement debounce for search
    const delayDebounceFn = setTimeout(() => {
      fetchEmpleados(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleOpenNew = () => {
    setSelectedEmpleado(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (empleado: any) => {
    setSelectedEmpleado(empleado);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este empleado?")) {
      try {
        await fetchApi(`/users/${id}`, { method: "DELETE" });
        fetchEmpleados(searchTerm);
      } catch (error) {
        alert("Error al eliminar el empleado.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-white p-6 rounded-3xl shadow-sm border border-[var(--mv-sage)]/10 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--mv-ink)] uppercase tracking-wide">Directorio de Empleados</h2>
          <p className="text-gray-500 mt-1 text-sm">Gestiona los accesos y roles de tu personal.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar empleado..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-[var(--mv-blue)] outline-none text-sm w-64 transition-all"
            />
          </div>
          <button 
            onClick={handleOpenNew}
            className="flex items-center gap-2 bg-[var(--mv-blue)] hover:bg-[#0b3c66] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-md shrink-0"
          >
            <PlusIcon className="w-5 h-5" />
            Nuevo Empleado
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-[var(--mv-sage)]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--mv-cream)]/50 border-b border-[var(--mv-sage)]/10">
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">ID</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Empleado</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Contacto</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Rol</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--mv-sage)]/10">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-400">
                    <div className="animate-pulse flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-[var(--mv-blue)] border-t-transparent rounded-full animate-spin"></div>
                        <span>Cargando empleados...</span>
                    </div>
                  </td>
                </tr>
              ) : empleados.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No se encontraron empleados que coincidan con tu búsqueda.
                  </td>
                </tr>
              ) : (
                empleados.map((empleado) => (
                  <tr key={empleado.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4">
                      <span className="text-gray-500 text-sm">#{empleado.id}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[var(--mv-ink)]">{empleado.nombre || empleado.username}</span>
                        <span className="text-gray-500 text-xs">@{empleado.username}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col text-sm">
                        <span className="text-gray-700">{empleado.telefono || 'Sin teléfono'}</span>
                        <span className="text-gray-500">{empleado.email || 'Sin correo'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold uppercase">
                        {empleado.rol}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button 
                              onClick={() => handleOpenEdit(empleado)}
                              className="p-2 text-gray-400 hover:text-[var(--mv-blue)] hover:bg-[var(--mv-blue)]/10 rounded-lg transition-all"
                            >
                              <PencilIcon className="w-5 h-5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Editar Empleado</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button 
                              onClick={() => handleDelete(empleado.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Eliminar Empleado</TooltipContent>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EmpleadoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        empleado={selectedEmpleado}
        onSuccess={() => fetchEmpleados(searchTerm)}
      />
    </div>
  );
}
