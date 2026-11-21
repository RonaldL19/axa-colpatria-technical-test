import type { PlanId } from './calculos';

export interface EventoCotizacionCalculada {
  event: 'cotizacion_calculada';
  producto: 'seguro_autos';
  plan_seleccionado: PlanId;
  prima_estimada: number;
}

export interface VentanaConDataLayer {
  dataLayer?: Record<string, unknown>[];
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

// Solo se envían los 4 campos requeridos, sin datos personales ni valor comercial
export function construirEventoCotizacion(
  planSeleccionado: PlanId,
  primaEstimada: number,
): EventoCotizacionCalculada {
  if (!Number.isFinite(primaEstimada) || primaEstimada < 0) {
    throw new Error(
      'La prima estimada debe ser un número finito mayor o igual a cero.',
    );
  }

  return {
    event: 'cotizacion_calculada',
    producto: 'seguro_autos',
    plan_seleccionado: planSeleccionado,
    prima_estimada: Math.round(primaEstimada),
  };
}

export function registrarCotizacionCalculada(
  planSeleccionado: PlanId,
  primaEstimada: number,
  targetWindow?: VentanaConDataLayer,
): EventoCotizacionCalculada | null {
  const evento = construirEventoCotizacion(planSeleccionado, primaEstimada);
  const win =
    targetWindow ?? (typeof window !== 'undefined' ? window : undefined);

  if (!win) {
    return null;
  }

  win.dataLayer = win.dataLayer || [];
  win.dataLayer.push({ ...evento });
  return evento;
}
