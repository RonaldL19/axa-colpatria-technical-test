import {
  COBERTURAS_CATALOGO,
  PLANES,
  calcularPrimasPlanes,
  formatearMonedaCOP,
  obtenerRecomendacionPlan,
  type PlanId,
} from '../lib/calculos';

export interface ComparadorPlanesProps {
  primaBase: number | null;
  necesitaReemplazo: boolean;
}

function IconoPlan({ planId }: { planId: PlanId }) {
  if (planId === 'esencial') {
    return (
      <span
        aria-hidden="true"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-emerald-700"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E4E9FB] text-[#0B1A59]"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path
          fill="currentColor"
          d="m12 8.2 1.15 2.33 2.57.37-1.86 1.82.44 2.56L12 14.07l-2.3 1.21.44-2.56-1.86-1.82 2.57-.37L12 8.2Z"
        />
      </svg>
    </span>
  );
}

export function ComparadorPlanes({
  primaBase,
  necesitaReemplazo,
}: ComparadorPlanesProps) {
  const primas = primaBase !== null ? calcularPrimasPlanes(primaBase) : null;
  const recomendacion =
    primas !== null
      ? obtenerRecomendacionPlan(necesitaReemplazo, primas)
      : null;

  return (
    <section
      aria-labelledby="titulo-comparador"
      aria-live="polite"
      className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_32px_-8px_rgba(11,26,89,0.10)] sm:p-7"
    >
      <h2
        id="titulo-comparador"
        className="text-xl font-bold tracking-tight text-[#0B1A59]"
      >
        2. Compara nuestras coberturas
      </h2>

      {primas === null || recomendacion === null ? (
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
            Ingresa los datos de tu vehículo para comparar planes
          </p>
          <p className="mt-1.5 max-w-sm text-sm text-slate-600">
            Completa el valor comercial y la antigüedad, luego haz clic en{' '}
            <strong className="font-semibold text-slate-800">
              Calcular y comparar planes
            </strong>{' '}
            para ver el valor anual del Plan Esencial y del Plan Plus.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">
            {PLANES.map((plan) => {
              const esRecomendado = recomendacion.planRecomendado === plan.id;
              const primaPlan = primas[plan.id];

              return (
                <article
                  key={plan.id}
                  aria-labelledby={`plan-titulo-${plan.id}`}
                  className={`relative flex flex-col rounded-2xl p-5 transition ${
                    esRecomendado
                      ? 'border-[1.5px] border-[#3E56C4] bg-[#F4F7FF] shadow-[0_10px_28px_-10px_rgba(15,45,156,0.18)]'
                      : 'border border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3 sm:min-h-[5.5rem] xl:min-h-[4.25rem]">
                    <IconoPlan planId={plan.id} />
                    <div className="min-w-0">
                      <h3
                        id={`plan-titulo-${plan.id}`}
                        className="text-lg font-bold leading-snug text-[#0B1A59]"
                      >
                        {plan.nombre}
                      </h3>
                      {esRecomendado && (
                        <span className="absolute -top-3 right-4 inline-flex items-center rounded-full bg-[#3E56C4] px-3.5 py-0.5 text-xs font-semibold tracking-wide text-white shadow-sm">
                          Recomendado
                        </span>
                      )}
                      <p className="mt-0.5 text-sm leading-snug text-slate-600">
                        {plan.descripcion}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="whitespace-nowrap text-2xl font-extrabold tracking-tight text-[#0B1A59] xl:text-3xl">
                      {formatearMonedaCOP(primaPlan)}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-600">
                      prima anual estimada
                    </p>
                  </div>

                  <hr className="my-4 border-slate-200/80" />

                  <ul
                    aria-label={`Coberturas de ${plan.nombre}`}
                    className="space-y-2.5 text-sm"
                  >
                    {COBERTURAS_CATALOGO.map((cobertura) => {
                      const incluida = plan.coberturas.includes(cobertura);

                      return (
                        <li key={cobertura} className="flex items-start gap-2.5">
                          {incluida ? (
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 20 20"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700"
                            >
                              <path d="M4.5 10.5 8 14l7.5-8" />
                            </svg>
                          ) : (
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 20 20"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mt-0.5 h-4 w-4 shrink-0 text-slate-500"
                            >
                              <path d="M6 6l8 8M14 6l-8 8" />
                            </svg>
                          )}
                          <span className="sr-only">
                            {incluida ? 'Incluye: ' : 'No incluye: '}
                          </span>
                          <span
                            className={
                              incluida
                                ? 'font-medium text-slate-800'
                                : 'text-slate-600'
                            }
                          >
                            {cobertura}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </article>
              );
            })}
          </div>

          <aside
            aria-label="Diferencia anual y recomendación"
            className="mt-5 flex items-center gap-3.5 rounded-xl bg-[#EEF2FC] px-4 py-3.5"
          >
            <span
              aria-hidden="true"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[1.75px] border-[#0B1A59] text-xs font-bold text-[#0B1A59]"
            >
              i
            </span>
            <div className="space-y-0.5 text-sm">
              <p className="text-base font-bold text-[#0B1A59]">
                Diferencia entre planes:{' '}
                <span>{formatearMonedaCOP(recomendacion.diferenciaAnual)}</span>{' '}
                al año
              </p>
              <p className="text-slate-700">{recomendacion.motivo}</p>
            </div>
          </aside>
        </>
      )}
    </section>
  );
}
