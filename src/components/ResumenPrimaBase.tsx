import {
  formatearMonedaCOP,
  obtenerOpcionAntiguedad,
  type AntiguedadId,
} from '../lib/calculos';

export interface ResultadoPrimaBase {
  valorComercial: number;
  antiguedad: AntiguedadId;
  necesitaReemplazo: boolean;
  primaBase: number;
}

interface ResumenPrimaBaseProps {
  resultado: ResultadoPrimaBase | null;
}

export function ResumenPrimaBase({ resultado }: ResumenPrimaBaseProps) {
  return (
    <section
      aria-labelledby="titulo-resultado"
      aria-live="polite"
      className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_32px_-8px_rgba(11,26,89,0.10)] sm:p-7"
    >
      <h2
        id="titulo-resultado"
        className="text-xl font-bold tracking-tight text-[#0B1A59]"
      >
        2. Resultado de tu prima base
      </h2>

      {!resultado ? (
        <div className="mt-6 flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-[#F8FAFE] p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E3ECFA] text-[#0F2D9C]">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <p className="mt-4 text-base font-semibold text-[#0B1A59]">
            Ingresa los datos de tu vehículo para calcular
          </p>
          <p className="mt-1.5 max-w-sm text-sm text-slate-600">
            Completa el valor comercial y la antigüedad, luego haz clic en{' '}
            <strong className="font-semibold text-slate-800">
              Calcular y comparar planes
            </strong>{' '}
            para conocer tu prima base anual estimada.
          </p>
        </div>
      ) : (
        <div className="mt-6 flex flex-1 flex-col justify-between gap-5">
          <div className="rounded-xl border border-[#C7D7F9] bg-[#F5F8FF] p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#17307A]">
              Prima base anual estimada
            </p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-[#0B1A59] sm:text-4xl">
              {formatearMonedaCOP(resultado.primaBase)}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Calculada como valor comercial × 3% × factor de antigüedad,
              redondeada al peso.
            </p>
          </div>

          <dl className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-slate-500">Valor comercial</dt>
              <dd className="mt-0.5 font-semibold text-slate-900">
                {formatearMonedaCOP(resultado.valorComercial)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Antigüedad y factor</dt>
              <dd className="mt-0.5 font-semibold text-slate-900">
                {obtenerOpcionAntiguedad(resultado.antiguedad).etiqueta} (×
                {obtenerOpcionAntiguedad(resultado.antiguedad)
                  .factor.toFixed(2)
                  .replace('.', ',')}
                )
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs text-slate-500">
                Vehículo de reemplazo en siniestro
              </dt>
              <dd className="mt-0.5 font-semibold text-slate-900">
                {resultado.necesitaReemplazo ? 'Sí solicitado' : 'No solicitado'}
              </dd>
            </div>
          </dl>

          <p className="rounded-lg bg-[#EEF3FC] px-4 py-3 text-xs text-[#17307A]">
            En la siguiente fase de desarrollo se integrará aquí el comparador
            entre Plan Esencial y Plan Plus con recomendación personalizada.
          </p>
        </div>
      )}
    </section>
  );
}
