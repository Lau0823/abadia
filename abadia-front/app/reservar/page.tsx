"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { fetchApi } from "@/lib/api";

export default function ReservarPage() {
  const [habitaciones, setHabitaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [aceptaPoliticas, setAceptaPoliticas] = useState(false);

  const [reservaData, setReservaData] = useState({
    checkIn: "",
    checkOut: "",
    habitacion_id: "",
    numeroAdultos: 1,
    numeroNinos: 0,
    notas_admin: "",
  });

  const [clienteData, setClienteData] = useState({
    nombre: "",
    documento: "",
    tipoDocumento: "CC",
    correo: "",
    telefono: "",
  });

  const [fechasCompletas, setFechasCompletas] = useState(false);

  useEffect(() => {
    const fetchHabitacionesDisponibles = async () => {
      if (!reservaData.checkIn || !reservaData.checkOut) {
        setHabitaciones([]);
        setFechasCompletas(false);
        return;
      }
      
      if (new Date(reservaData.checkOut) <= new Date(reservaData.checkIn)) {
        setHabitaciones([]);
        setFechasCompletas(true); // Las fechas están llenas pero son inválidas (se validan en el form)
        return;
      }

      setLoading(true);
      setFechasCompletas(true);
      try {
        const url = `/habitaciones/disponibles?checkIn=${new Date(reservaData.checkIn).toISOString()}&checkOut=${new Date(reservaData.checkOut).toISOString()}`;
        const data = await fetchApi(url);
        setHabitaciones(data);
      } catch (error) {
        console.error("Error cargando habitaciones disponibles", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Solo buscar si ambas fechas cambian
    fetchHabitacionesDisponibles();
  }, [reservaData.checkIn, reservaData.checkOut]);

  // Precargar si viene de la URL (?room=id)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const roomId = urlParams.get('room');
      if (roomId) {
        setReservaData(prev => ({ ...prev, habitacion_id: roomId }));
      }
    }
  }, []);

  const handleChangeReserva = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setReservaData(prev => ({ ...prev, [name]: value }));
  };

  const handleChangeCliente = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setClienteData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservaData.habitacion_id || !reservaData.checkIn || !reservaData.checkOut) {
      setError("Por favor completa los datos de tu estancia.");
      return;
    }
    
    // Validar check-out posterior a check-in
    if (new Date(reservaData.checkOut) <= new Date(reservaData.checkIn)) {
      setError("La fecha de salida debe ser posterior a la de ingreso.");
      return;
    }

    if (!aceptaPoliticas) {
      setError("Debes aceptar las políticas y condiciones del hotel para continuar.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        cliente: {
          ...clienteData
        },
        reserva: {
          habitacion_id: reservaData.habitacion_id,
          checkIn: new Date(reservaData.checkIn).toISOString(),
          checkOut: new Date(reservaData.checkOut).toISOString(),
          numeroAdultos: Number(reservaData.numeroAdultos),
          numeroNinos: Number(reservaData.numeroNinos),
          notas_admin: reservaData.notas_admin ? `[Huésped]: ${reservaData.notas_admin}` : "",
        }
      };

      await fetchApi("/reservations/book", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al procesar tu reserva. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f1ea]/40 text-[#3d342e] antialiased">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Playfair+Display:ital,wght@1,400;1,600&family=Raleway:wght@200;300;400;500;600&display=swap" />
      <style>{`
        body { font-family: 'Raleway', sans-serif !important; }
        .font-luxury-title { font-weight: 300 !important; letter-spacing: 0.08em; }
        .font-luxury-script { font-family: 'Alex Brush', cursive !important; }
      `}</style>

      {/* HEADER SIMPLE */}
      <header className="bg-[#3d342e] py-6 px-4 flex justify-center border-b border-[#e6dfd1]">
        <button onClick={() => window.location.href = '/'} className="relative w-40 h-16 filter brightness-0 invert opacity-90 transition-opacity hover:opacity-100">
          <Image src="/logo.png" alt="Abadía Logo" fill className="object-contain" />
        </button>
      </header>

      <section className="py-12 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#3d342e]/50 font-medium block mb-2">— RESERVAS</span>
            <h1 className="text-3xl md:text-5xl text-[#3d342e] uppercase font-luxury-title">Planifica tu Estadía</h1>
          </div>

          {success ? (
            <div className="bg-white rounded-[2rem] p-10 md:p-16 shadow-sm border border-[#e6dfd1] text-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-luxury-title uppercase text-[#3d342e] mb-2">¡Solicitud Recibida!</h2>
              <p className="text-neutral-500 font-light text-sm md:text-base mb-8 leading-relaxed max-w-md mx-auto">
                Hemos registrado tu solicitud de reserva con éxito. Nos pondremos en contacto contigo pronto para confirmar la disponibilidad y gestionar el pago.
              </p>
              <button 
                onClick={() => window.location.href = '/'}
                className="bg-[#3d342e] text-white px-8 py-3.5 text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-neutral-800 transition-all shadow-sm"
              >
                Volver al Inicio
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-[#e6dfd1]">
              <form onSubmit={handleSubmit} className="space-y-10">
                {error && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100">
                    {error}
                  </div>
                )}

                {/* PASO 1: LA ESTANCIA */}
                <div>
                  <h3 className="text-lg font-luxury-title uppercase text-[#3d342e] border-b border-[#e6dfd1] pb-3 mb-6">1. Tu Estancia</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] uppercase font-medium text-[#3d342e]/60 tracking-wider block mb-2">Check-In</label>
                      <input 
                        type="date" 
                        name="checkIn"
                        required
                        value={reservaData.checkIn}
                        onChange={handleChangeReserva}
                        className="w-full bg-[#f4f1ea]/40 border border-[#e6dfd1]/50 rounded-xl px-4 py-3 text-sm text-[#3d342e] outline-none focus:border-[#3d342e]/30 transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-medium text-[#3d342e]/60 tracking-wider block mb-2">Check-Out</label>
                      <input 
                        type="date" 
                        name="checkOut"
                        required
                        value={reservaData.checkOut}
                        onChange={handleChangeReserva}
                        className="w-full bg-[#f4f1ea]/40 border border-[#e6dfd1]/50 rounded-xl px-4 py-3 text-sm text-[#3d342e] outline-none focus:border-[#3d342e]/30 transition-colors" 
                      />
                    </div>
                  </div>
                  
                  <div className={`mt-6 transition-all duration-500 ${!fechasCompletas ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                    <label className="text-[10px] uppercase font-medium text-[#3d342e]/60 tracking-wider block mb-2">Habitación Preferida</label>
                    {loading ? (
                      <p className="text-sm text-gray-500 italic py-2">Buscando disponibilidad...</p>
                    ) : !fechasCompletas ? (
                      <p className="text-sm text-gray-500 italic py-2">Por favor selecciona tus fechas primero.</p>
                    ) : habitaciones.length === 0 ? (
                      <p className="text-sm text-red-500 font-medium py-2">Lo sentimos, no hay habitaciones libres para estas fechas.</p>
                    ) : (
                      <select 
                        name="habitacion_id"
                        required
                        value={reservaData.habitacion_id}
                        onChange={handleChangeReserva}
                        className="w-full bg-[#f4f1ea]/40 border border-[#e6dfd1]/50 rounded-xl px-4 py-3 text-sm text-[#3d342e] outline-none focus:border-[#3d342e]/30 transition-colors"
                      >
                        <option value="">Selecciona una habitación disponible</option>
                        {habitaciones.map((hab) => (
                          <option key={hab.id} value={hab.id}>
                            {hab.titulo} - {hab.subtitulo} (${Number(hab.precio).toLocaleString('es-CO')} / noche)
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="text-[10px] uppercase font-medium text-[#3d342e]/60 tracking-wider block mb-2">Adultos</label>
                      <input 
                        type="number" 
                        name="numeroAdultos"
                        min="1"
                        required
                        value={reservaData.numeroAdultos}
                        onChange={handleChangeReserva}
                        className="w-full bg-[#f4f1ea]/40 border border-[#e6dfd1]/50 rounded-xl px-4 py-3 text-sm text-[#3d342e] outline-none focus:border-[#3d342e]/30 transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-medium text-[#3d342e]/60 tracking-wider block mb-2">Niños</label>
                      <input 
                        type="number" 
                        name="numeroNinos"
                        min="0"
                        required
                        value={reservaData.numeroNinos}
                        onChange={handleChangeReserva}
                        className="w-full bg-[#f4f1ea]/40 border border-[#e6dfd1]/50 rounded-xl px-4 py-3 text-sm text-[#3d342e] outline-none focus:border-[#3d342e]/30 transition-colors" 
                      />
                    </div>
                  </div>
                </div>

                {/* PASO 2: DATOS PERSONALES */}
                <div>
                  <h3 className="text-lg font-luxury-title uppercase text-[#3d342e] border-b border-[#e6dfd1] pb-3 mb-6">2. Tus Datos (Titular)</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] uppercase font-medium text-[#3d342e]/60 tracking-wider block mb-2">Nombre Completo</label>
                      <input 
                        type="text" 
                        name="nombre"
                        required
                        value={clienteData.nombre}
                        onChange={handleChangeCliente}
                        placeholder="Ej. Juan Pérez"
                        className="w-full bg-[#f4f1ea]/40 border border-[#e6dfd1]/50 rounded-xl px-4 py-3 text-sm text-[#3d342e] outline-none focus:border-[#3d342e]/30 transition-colors" 
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1">
                        <label className="text-[10px] uppercase font-medium text-[#3d342e]/60 tracking-wider block mb-2">Tipo Doc.</label>
                        <select 
                          name="tipoDocumento"
                          value={clienteData.tipoDocumento}
                          onChange={handleChangeCliente}
                          className="w-full bg-[#f4f1ea]/40 border border-[#e6dfd1]/50 rounded-xl px-4 py-3 text-sm text-[#3d342e] outline-none focus:border-[#3d342e]/30 transition-colors"
                        >
                          <option value="CC">C.C.</option>
                          <option value="CE">C.E.</option>
                          <option value="PASAPORTE">Pasaporte</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] uppercase font-medium text-[#3d342e]/60 tracking-wider block mb-2">Número de Documento</label>
                        <input 
                          type="text" 
                          name="documento"
                          required
                          value={clienteData.documento}
                          onChange={handleChangeCliente}
                          className="w-full bg-[#f4f1ea]/40 border border-[#e6dfd1]/50 rounded-xl px-4 py-3 text-sm text-[#3d342e] outline-none focus:border-[#3d342e]/30 transition-colors" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-[10px] uppercase font-medium text-[#3d342e]/60 tracking-wider block mb-2">Correo Electrónico</label>
                        <input 
                          type="email" 
                          name="correo"
                          required
                          value={clienteData.correo}
                          onChange={handleChangeCliente}
                          placeholder="tu@correo.com"
                          className="w-full bg-[#f4f1ea]/40 border border-[#e6dfd1]/50 rounded-xl px-4 py-3 text-sm text-[#3d342e] outline-none focus:border-[#3d342e]/30 transition-colors" 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-medium text-[#3d342e]/60 tracking-wider block mb-2">Teléfono / Celular</label>
                        <input 
                          type="tel" 
                          name="telefono"
                          required
                          value={clienteData.telefono}
                          onChange={handleChangeCliente}
                          placeholder="+57 300 000 0000"
                          className="w-full bg-[#f4f1ea]/40 border border-[#e6dfd1]/50 rounded-xl px-4 py-3 text-sm text-[#3d342e] outline-none focus:border-[#3d342e]/30 transition-colors" 
                        />
                      </div>
                    </div>
                  <div className="mt-6">
                    <label className="text-[10px] uppercase font-medium text-[#3d342e]/60 tracking-wider block mb-2">Peticiones Especiales o Mensajes</label>
                    <textarea 
                      name="notas_admin"
                      value={reservaData.notas_admin}
                      onChange={handleChangeReserva as any}
                      placeholder="Ej. Llegaremos después de las 8PM, es nuestro aniversario, necesitamos cuna..."
                      rows={3}
                      className="w-full bg-[#f4f1ea]/40 border border-[#e6dfd1]/50 rounded-xl px-4 py-3 text-sm text-[#3d342e] outline-none focus:border-[#3d342e]/30 transition-colors resize-none"
                    />
                  </div>
                </div>

                <div className="pt-8 border-t border-[#e6dfd1]">
                  <h3 className="text-lg font-luxury-title uppercase text-[#3d342e] mb-4">3. Políticas del Hotel</h3>
                  <div className="bg-[#f4f1ea]/30 p-5 rounded-xl border border-[#e6dfd1]/50 text-xs text-neutral-500 leading-relaxed font-light mb-6 space-y-3">
                    <p><strong>Check-In y Check-Out:</strong> El ingreso a las habitaciones está habilitado a partir de las 3:00 PM y la salida debe realizarse antes de la 1:00 PM para garantizar el tiempo necesario de aseo y desinfección.</p>
                    <p><strong>Política de Cancelación:</strong> Puedes reprogramar o cancelar tu estadía sin penalidad hasta 48 horas antes de tu fecha de llegada. Pasado este tiempo se cobrará el valor de la primera noche o se retendrá el anticipo abonado.</p>
                    <p><strong>Tratamiento de Datos:</strong> Al solicitar esta reserva, autorizas el registro de los datos de todos los huéspedes para fines de control hotelero ante las autoridades competentes de Colombia (SIRE / TRA).</p>
                  </div>
                  
                  <label className="flex items-start gap-3 cursor-pointer mb-6 group">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input 
                        type="checkbox" 
                        required
                        checked={aceptaPoliticas}
                        onChange={(e) => setAceptaPoliticas(e.target.checked)}
                        className="peer appearance-none w-5 h-5 border border-[#3d342e]/30 rounded bg-white checked:bg-[#3d342e] checked:border-[#3d342e] transition-all"
                      />
                      <svg className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs text-neutral-600 font-medium select-none group-hover:text-[#3d342e] transition-colors">
                      He leído y acepto las políticas de cancelación, horarios de ingreso/salida y normas de convivencia del hotel.
                    </span>
                  </label>

                  <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#3d342e] text-white py-4 rounded-xl text-[11px] uppercase tracking-widest hover:bg-neutral-800 transition-colors shadow-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                    Solicitar Reserva
                  </button>
                </div>

              </form>
            </div>
          )}

        </div>
      </section>
    </main>
  );
}
