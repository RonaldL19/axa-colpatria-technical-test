import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import {
  OPCIONES_ANTIGUEDAD,
  VALOR_MAXIMO,
  VALOR_MINIMO,
  formatearEntradaMiles,
  formatearMonedaCOP,
  type AntiguedadId,
} from '../lib/calculos';

interface TooltipInfoProps {
  id: string;
  etiquetaAria: string;
  texto: string;
}

function TooltipInfo({ id, etiquetaAria, texto }: TooltipInfoProps) {
  const [abierto, setAbierto] = useState(false);
  const contenedorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAbierto(false);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (
        contenedorRef.current &&
        !contenedorRef.current.contains(event.target as Node)
      ) {
        setAbierto(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [abierto]);

  return (
    <div
      ref={contenedorRef}
      className="inline-flex items-center"
      onMouseEnter={() => setAbierto(true)}
      onMouseLeave={() => setAbierto(false)}
    >
      <button
        type="button"
        aria-label={etiquetaAria}
        aria-expanded={abierto}
        aria-controls={id}
        onClick={() => setAbierto((prev) => !prev)}
        onFocus={() => setAbierto(true)}
        onBlur={(event) => {
          if (!contenedorRef.current?.contains(event.relatedTarget as Node)) {
            setAbierto(false);
          }
        }}
        className="inline-flex h-[18px] w-[18px] cursor-pointer items-center justify-center rounded-full border border-slate-500 text-[11px] font-semibold leading-none text-slate-600 transition hover:border-[#0F2D9C] hover:text-[#0F2D9C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F2D9C]"
      >
        <span aria-hidden="true">i</span>
      </button>

      <span
        id={id}
        role="tooltip"
        className={
          abierto
            ? 'pointer-events-none absolute bottom-full left-0 z-20 mb-2 w-64 max-w-full rounded-lg bg-[#0B1A59] px-3 py-2 text-xs leading-relaxed font-normal text-white shadow-lg'
            : 'sr-only'
        }
      >
        {texto}
      </span>
    </div>
  );
}

export interface FormularioVehiculoProps {
  valorInput: string;
  antiguedad: AntiguedadId;
  necesitaReemplazo: boolean;
  errorValor: string | null;
  onValorChange: (nuevoValorFormateado: string) => void;
  onAntiguedadChange: (nuevaAntiguedad: AntiguedadId) => void;
  onNecesitaReemplazoChange: (checked: boolean) => void;
  onSubmit: () => boolean;
}

export function FormularioVehiculo({
  valorInput,
  antiguedad,
  necesitaReemplazo,
  errorValor,
  onValorChange,
  onAntiguedadChange,
  onNecesitaReemplazoChange,
  onSubmit,
}: FormularioVehiculoProps) {
  const inputValorRef = useRef<HTMLInputElement>(null);

  const handleValorChange = (event: ChangeEvent<HTMLInputElement>) => {
    const formateado = formatearEntradaMiles(event.target.value);
    onValorChange(formateado);
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const esValido = onSubmit();
    if (!esValido) {
      inputValorRef.current?.focus();
    }
  };

  const describedByIds = errorValor
    ? 'valor-comercial-error valor-comercial-ayuda'
    : 'valor-comercial-ayuda';

  return (
    <section
      aria-labelledby="titulo-formulario"
      className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_32px_-8px_rgba(11,26,89,0.10)] sm:p-7"
    >
      <h2
        id="titulo-formulario"
        className="text-xl font-bold tracking-tight text-[#0B1A59]"
      >
        1. Cuéntanos sobre tu vehículo
      </h2>

      <form onSubmit={handleFormSubmit} noValidate className="mt-6 space-y-5">
        {/* Campo: Valor comercial */}
        <div>
          <div className="relative flex items-center gap-1.5">
            <label
              htmlFor="valor-comercial"
              className="text-sm font-semibold text-slate-800"
            >
              Valor comercial del vehículo
            </label>
            <TooltipInfo
              id="valor-comercial-ayuda"
              etiquetaAria="Información sobre el valor comercial del vehículo"
              texto={`Ingresa un valor en COP entre ${formatearMonedaCOP(VALOR_MINIMO)} y ${formatearMonedaCOP(VALOR_MAXIMO)}.`}
            />
          </div>

          <div className="relative mt-2">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-base font-medium text-slate-600"
            >
              $
            </span>
            <input
              ref={inputValorRef}
              id="valor-comercial"
              name="valorComercial"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="85.000.000"
              value={valorInput}
              onChange={handleValorChange}
              aria-invalid={errorValor ? 'true' : 'false'}
              aria-describedby={describedByIds}
              className={`w-full rounded-xl border bg-[#F8FAFC] py-3 pr-4 pl-8 text-base font-medium text-slate-900 placeholder:text-slate-500 transition focus:bg-white focus:outline-none focus:ring-2 ${
                errorValor
                  ? 'border-red-600 focus:border-red-600 focus:ring-red-200'
                  : 'border-slate-300 focus:border-[#0F2D9C] focus:ring-[#0F2D9C]/20'
              }`}
            />
          </div>

          {errorValor && (
            <p
              id="valor-comercial-error"
              role="alert"
              className="mt-1.5 text-xs font-medium text-red-700"
            >
              {errorValor}
            </p>
          )}
        </div>

        {/* Selector: Antigüedad del vehículo */}
        <div>
          <div className="relative flex items-center gap-1.5">
            <label
              htmlFor="antiguedad-vehiculo"
              className="text-sm font-semibold text-slate-800"
            >
              Antigüedad del vehículo
            </label>
            <TooltipInfo
              id="antiguedad-ayuda"
              etiquetaAria="Información sobre la antigüedad del vehículo"
              texto="Ajusta la prima base según el rango de años del vehículo."
            />
          </div>

          <div className="relative mt-2">
            <select
              id="antiguedad-vehiculo"
              name="antiguedadVehiculo"
              value={antiguedad}
              aria-describedby="antiguedad-ayuda"
              onChange={(event) =>
                onAntiguedadChange(event.target.value as AntiguedadId)
              }
              className="select-sin-flecha w-full rounded-xl border border-slate-300 bg-[#F8FAFC] py-3 pr-10 pl-3.5 text-base font-medium text-slate-900 transition focus:border-[#0F2D9C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2D9C]/20"
              style={{
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
              }}
            >
              {OPCIONES_ANTIGUEDAD.map((opcion) => (
                <option key={opcion.id} value={opcion.id}>
                  {opcion.etiqueta}
                </option>
              ))}
            </select>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="pointer-events-none absolute top-1/2 right-3.5 h-5 w-5 -translate-y-1/2 text-slate-600"
            >
              <path
                fillRule="evenodd"
                d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Casilla: Vehículo de reemplazo */}
        <div className="pt-1">
          <label
            htmlFor="vehiculo-reemplazo"
            className="flex cursor-pointer items-start gap-3 rounded-lg py-1 text-sm text-slate-800"
          >
            <input
              id="vehiculo-reemplazo"
              name="vehiculoReemplazo"
              type="checkbox"
              checked={necesitaReemplazo}
              onChange={(event) =>
                onNecesitaReemplazoChange(event.target.checked)
              }
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-[#0F2D9C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F2D9C]"
            />
            <span>Necesito vehículo de reemplazo en caso de siniestro</span>
          </label>
        </div>

        {/* Botón principal */}
        <button
          type="submit"
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-[#0F2D9C] px-5 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-[#0A227A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F2D9C] active:bg-[#081A61]"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="8" y1="6" x2="16" y2="6" />
            <line x1="8" y1="11" x2="8.01" y2="11" />
            <line x1="12" y1="11" x2="12.01" y2="11" />
            <line x1="16" y1="11" x2="16.01" y2="11" />
            <line x1="8" y1="15" x2="8.01" y2="15" />
            <line x1="12" y1="15" x2="12.01" y2="15" />
            <line x1="16" y1="15" x2="16.01" y2="15" />
            <line x1="8" y1="19" x2="12" y2="19" />
            <line x1="16" y1="19" x2="16.01" y2="19" />
          </svg>
          Calcular y comparar planes
        </button>
      </form>
    </section>
  );
}
