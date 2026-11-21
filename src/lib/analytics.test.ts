import { describe, expect, it } from 'vitest';
import {
  construirEventoCotizacion,
  registrarCotizacionCalculada,
  type VentanaConDataLayer,
} from './analytics';
import {
  calcularPrimaBase,
  calcularPrimasPlanes,
  obtenerRecomendacionPlan,
} from './calculos';

describe('construirEventoCotizacion', () => {
  it('genera exactamente las 4 propiedades requeridas sin datos personales ni valor comercial', () => {
    const evento = construirEventoCotizacion('plus', 3_786_750);

    expect(evento).toEqual({
      event: 'cotizacion_calculada',
      producto: 'seguro_autos',
      plan_seleccionado: 'plus',
      prima_estimada: 3_786_750,
    });
    expect(Object.keys(evento)).toEqual([
      'event',
      'producto',
      'plan_seleccionado',
      'prima_estimada',
    ]);
  });

  it('rechaza primas no finitas o negativas', () => {
    expect(() => construirEventoCotizacion('esencial', -100)).toThrow();
    expect(() => construirEventoCotizacion('esencial', Number.NaN)).toThrow();
  });
});

describe('registrarCotizacionCalculada', () => {
  it('inicializa window.dataLayer de forma segura cuando no existe', () => {
    const mockWindow: VentanaConDataLayer = {};

    const evento = registrarCotizacionCalculada('esencial', 2_805_000, mockWindow);

    expect(evento).toEqual({
      event: 'cotizacion_calculada',
      producto: 'seguro_autos',
      plan_seleccionado: 'esencial',
      prima_estimada: 2_805_000,
    });
    expect(mockWindow.dataLayer).toEqual([
      {
        event: 'cotizacion_calculada',
        producto: 'seguro_autos',
        plan_seleccionado: 'esencial',
        prima_estimada: 2_805_000,
      },
    ]);
  });

  it('conserva eventos previos en dataLayer y envía la prima del plan recomendado según el caso de control', () => {
    const mockWindow: VentanaConDataLayer = {
      dataLayer: [{ event: 'gtm.js' }],
    };

    const primaBase = calcularPrimaBase(85_000_000, '3-5');
    const primas = calcularPrimasPlanes(primaBase);

    const recPlus = obtenerRecomendacionPlan(true, primas);
    registrarCotizacionCalculada(
      recPlus.planRecomendado,
      primas[recPlus.planRecomendado],
      mockWindow,
    );

    const recEsencial = obtenerRecomendacionPlan(false, primas);
    registrarCotizacionCalculada(
      recEsencial.planRecomendado,
      primas[recEsencial.planRecomendado],
      mockWindow,
    );

    expect(mockWindow.dataLayer).toEqual([
      { event: 'gtm.js' },
      {
        event: 'cotizacion_calculada',
        producto: 'seguro_autos',
        plan_seleccionado: 'plus',
        prima_estimada: 3_786_750,
      },
      {
        event: 'cotizacion_calculada',
        producto: 'seguro_autos',
        plan_seleccionado: 'esencial',
        prima_estimada: 2_805_000,
      },
    ]);
  });

  it('no falla si se ejecuta fuera del navegador (sin window)', () => {
    expect(registrarCotizacionCalculada('esencial', 2_805_000)).toBeNull();
  });
});
