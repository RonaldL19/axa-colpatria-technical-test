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

/**
 * Construye el payload exacto del evento `cotizacion_calculada`.
 * No incluye datos personales ni el valor comercial del vehículo.
 */
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

/**
 * Inicializa `window.dataLayer` de forma segura y envía el evento
 * `cotizacion_calculada` tras un cálculo válido.
 */
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
