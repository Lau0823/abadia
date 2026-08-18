import { XMarkIcon, IdentificationIcon, UserCircleIcon, CalendarDaysIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";

interface DetalleReservaModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: any;
}

export default function DetalleReservaModal({ isOpen, onClose, reservation }: DetalleReservaModalProps) {
  if (!isOpen || !reservation) return null;

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('es-CO', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    }).format(new Date(dateString));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(Number(amount));
  };

  const statusColors: any = {
    'completed': 'bg-gray-100 text-gray-700',
    'confirmed': 'bg-green-100 text-green-700',
    'pending': 'bg-yellow-100 text-yellow-700',
    'cancelled': 'bg-red-100 text-red-700'
  };

  const statusText: any = {
    'completed': 'Completada',
    'confirmed': 'Confirmada',
    'pending': 'Pendiente',
    'cancelled': 'Cancelada'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[var(--mv-cream)]/30">
          <h3 className="text-xl font-bold text-[var(--mv-ink)]">Detalles de la Reserva</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header Resumen */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-medium">ID de Reserva: #{reservation.id}</p>
              <h4 className="text-2xl font-bold text-[var(--mv-blue)] mt-1">{reservation.habitacion?.titulo}</h4>
              <p className="text-sm text-gray-600 mt-1">{reservation.numeroAdultos} Adultos, {reservation.numeroNinos} Niños</p>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase ${statusColors[reservation.status] || 'bg-gray-100 text-gray-700'}`}>
              {statusText[reservation.status] || reservation.status}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fechas */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 text-[var(--mv-blue)] mb-3">
                <CalendarDaysIcon className="w-5 h-5" />
                <h5 className="font-semibold">Estadía</h5>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Check-in</span>
                  <span className="text-sm font-medium text-gray-800 capitalize">{formatDate(reservation.checkIn)}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Check-out</span>
                  <span className="text-sm font-medium text-gray-800 capitalize">{formatDate(reservation.checkOut)}</span>
                </div>
              </div>
            </div>

            {/* Finanzas */}
            <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100">
              <div className="flex items-center gap-2 text-[var(--mv-blue)] mb-3">
                <CurrencyDollarIcon className="w-5 h-5" />
                <h5 className="font-semibold">Finanzas</h5>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Valor Total</span>
                  <span className="text-sm font-bold text-gray-800">{formatCurrency(reservation.value)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Anticipo / Pagado</span>
                  <span className="text-sm font-medium text-green-600">{formatCurrency(reservation.anticipo || 0)}</span>
                </div>
                <div className="pt-2 border-t border-blue-100 flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-800">Saldo Pendiente</span>
                  <span className="text-lg font-bold text-red-600">
                    {formatCurrency(Number(reservation.value) - Number(reservation.anticipo || 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Información del Titular */}
          <div>
            <div className="flex items-center gap-2 text-[var(--mv-ink)] mb-3 border-b border-gray-100 pb-2">
              <UserCircleIcon className="w-5 h-5" />
              <h5 className="font-semibold">Titular de la Reserva</h5>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="block text-xs text-gray-500">Nombre</span>
                <span className="text-sm font-medium text-gray-800">{reservation.cliente?.nombre}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-500">Documento</span>
                <span className="text-sm font-medium text-gray-800">{reservation.cliente?.documento || 'N/A'}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-500">Email</span>
                <span className="text-sm font-medium text-gray-800">{reservation.cliente?.correo || 'N/A'}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-500">Teléfono</span>
                <span className="text-sm font-medium text-gray-800">{reservation.cliente?.telefono || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Notas (si existen) */}
          {reservation.notas_admin && (
            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
              <h5 className="text-xs font-bold text-yellow-800 uppercase tracking-widest mb-1">Notas Administrativas</h5>
              <p className="text-sm text-yellow-900">{reservation.notas_admin}</p>
            </div>
          )}

        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-white bg-[var(--mv-ink)] hover:bg-[#2a2420] rounded-full transition-colors shadow-md"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
