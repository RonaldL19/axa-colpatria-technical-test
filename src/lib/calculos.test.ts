import { describe, expect, it } from 'vitest';
import {
  MOTIVOS_RECOMENDACION,
  PLANES,
  PLANES_POR_ID,
  VALOR_MAXIMO,
  VALOR_MINIMO,
  calcularDiferenciaAnual,
  calcularPrimaBase,
  calcularPrimasPlanes,
  formatearEntradaMiles,
  formatearMonedaCOP,
  obtenerRecomendacionPlan,
  validarValorComercial,
} from './calculos';

describe('validarValorComercial', () => {
  it('rechaza valores vacíos o solo espacios', () => {
    expect(validarValorComercial('')).toMatchObject({
      valido: false,
      codigo: 'vacio',
    });
    expect(validarValorComercial('   ')).toMatchObject({
      valido: false,
      codigo: 'vacio',
    });
  });

  it('rechaza entradas no numéricas', () => {
    expect(validarValorComercial('abc')).toMatchObject({
      valido: false,
      codigo: 'no_numerico',
    });
    expect(validarValorComercial('85.000.000abc')).toMatchObject({
      valido: false,
      codigo: 'no_numerico',
    });
    expect(validarValorComercial('-50000000')).toMatchObject({
      valido: false,
      codigo: 'no_numerico',
    });
    expect(validarValorComercial(Number.NaN)).toMatchObject({
      valido: false,
      codigo: 'no_numerico',
    });
  });

  it('rechaza valores por debajo del mínimo ($20.000.000) y por encima del máximo ($300.000.000)', () => {
    expect(validarValorComercial('19.999.999')).toMatchObject({
      valido: false,
      codigo: 'menor_minimo',
    });
    expect(validarValorComercial('300.000.001')).toMatchObject({
      valido: false,
      codigo: 'mayor_maximo',
    });
  });

  it('acepta exactamente los límites mínimo y máximo, y formatos con puntos o signo $', () => {
    expect(validarValorComercial(VALOR_MINIMO)).toEqual({
      valido: true,
      valor: 20_000_000,
    });
    expect(validarValorComercial(VALOR_MAXIMO)).toEqual({
      valido: true,
      valor: 300_000_000,
    });
    expect(validarValorComercial('$ 85.000.000')).toEqual({
      valido: true,
      valor: 85_000_000,
    });
  });
});

describe('calcularPrimaBase', () => {
  it('calcula correctamente el caso de control ($85.000.000 + 3 a 5 años = $2.805.000)', () => {
    expect(calcularPrimaBase(85_000_000, '3-5')).toBe(2_805_000);
  });

  it('aplica correctamente cada factor de antigüedad', () => {
    expect(calcularPrimaBase(100_000_000, '0-2')).toBe(3_000_000);
    expect(calcularPrimaBase(100_000_000, '3-5')).toBe(3_300_000);
    expect(calcularPrimaBase(100_000_000, '6-10')).toBe(3_750_000);
    expect(calcularPrimaBase(100_000_000, 'mas-10')).toBe(4_200_000);
  });

  it('calcula correctamente en los límites mínimo y máximo', () => {
    expect(calcularPrimaBase(VALOR_MINIMO, '0-2')).toBe(600_000);
    expect(calcularPrimaBase(VALOR_MAXIMO, 'mas-10')).toBe(12_600_000);
  });

  it('redondea al peso para evitar errores de coma flotante', () => {
    // 20.000.001 * 0.03 * 1.25 = 750.000,0375 -> 750.000
    expect(calcularPrimaBase(20_000_001, '6-10')).toBe(750_000);
    // 20.000.015 * 0.03 * 1.25 = 750.000,5625 -> 750.001
    expect(calcularPrimaBase(20_000_015, '6-10')).toBe(750_001);
  });

  it('lanza error si el valor comercial está fuera de rango', () => {
    expect(() => calcularPrimaBase(19_999_999, '0-2')).toThrow();
    expect(() => calcularPrimaBase(300_000_001, '0-2')).toThrow();
  });
});

describe('utilidades de formato', () => {
  it('formatea miles en es-CO mientras se escribe y conserva texto no numérico', () => {
    expect(formatearEntradaMiles('85000000')).toBe('85.000.000');
    expect(formatearEntradaMiles('85.000.000')).toBe('85.000.000');
    expect(formatearEntradaMiles('85abc')).toBe('85abc');
    expect(formatearEntradaMiles('')).toBe('');
  });

  it('formatea moneda en COP sin decimales', () => {
    // Normalizamos espacios no separables (NBSP) de Intl para la aserción
    expect(formatearMonedaCOP(2_805_000).replace(/\u00a0/g, ' ')).toBe(
      '$ 2.805.000',
    );
  });
});

describe('constantes de planes', () => {
  it('define Plan Esencial y Plan Plus con sus multiplicadores y coberturas', () => {
    expect(PLANES).toHaveLength(2);
    expect(PLANES_POR_ID.esencial).toMatchObject({
      id: 'esencial',
      nombre: 'Plan Esencial',
      descripcion: 'Protección básica para tu vehículo',
      multiplicador: 1.0,
      coberturas: ['Asistencia en carretera'],
    });
    expect(PLANES_POR_ID.plus).toMatchObject({
      id: 'plus',
      nombre: 'Plan Plus',
      descripcion: 'Mayor cobertura y respaldo en todo momento',
      multiplicador: 1.35,
      coberturas: [
        'Asistencia en carretera',
        'Vehículo de reemplazo',
        'Asistencia jurídica',
      ],
    });
  });
});

describe('calcularPrimasPlanes', () => {
  it('calcula correctamente el caso de control ($2.805.000 -> Esencial $2.805.000, Plus $3.786.750)', () => {
    expect(calcularPrimasPlanes(2_805_000)).toEqual({
      esencial: 2_805_000,
      plus: 3_786_750,
    });
  });

  it('redondea al peso con Math.round cuando ×1,35 genera decimales', () => {
    // 750.001 * 1,35 = 1.012.501,35 -> redondea a 1.012.501
    expect(calcularPrimasPlanes(750_001)).toEqual({
      esencial: 750_001,
      plus: 1_012_501,
    });

    // 750.002 * 1,35 = 1.012.502,70 -> redondea a 1.012.503
    expect(calcularPrimasPlanes(750_002)).toEqual({
      esencial: 750_002,
      plus: 1_012_503,
    });

    // 1.000.010 * 1,35 = 1.350.013,50 -> Math.round redondea a 1.350.014
    expect(calcularPrimasPlanes(1_000_010)).toEqual({
      esencial: 1_000_010,
      plus: 1_350_014,
    });
  });

  it('calcula correctamente en los límites mínimo ($20.000.000) y máximo ($300.000.000) de extremo a extremo', () => {
    const baseMin = calcularPrimaBase(VALOR_MINIMO, '0-2'); // 600.000
    const primasMin = calcularPrimasPlanes(baseMin);
    expect(primasMin).toEqual({ esencial: 600_000, plus: 810_000 });
    expect(calcularDiferenciaAnual(primasMin)).toBe(210_000);

    const baseMax = calcularPrimaBase(VALOR_MAXIMO, 'mas-10'); // 12.600.000
    const primasMax = calcularPrimasPlanes(baseMax);
    expect(primasMax).toEqual({ esencial: 12_600_000, plus: 17_010_000 });
    expect(calcularDiferenciaAnual(primasMax)).toBe(4_410_000);
  });

  it('rechaza primas base negativas o no finitas', () => {
    expect(() => calcularPrimasPlanes(-1)).toThrow();
    expect(() => calcularPrimasPlanes(Number.NaN)).toThrow();
    expect(() => calcularPrimasPlanes(Number.POSITIVE_INFINITY)).toThrow();
  });
});

describe('calcularDiferenciaAnual', () => {
  it('calcula Plus − Esencial sobre las primas redondeadas', () => {
    const primasControl = calcularPrimasPlanes(2_805_000);
    expect(calcularDiferenciaAnual(primasControl)).toBe(981_750);

    const primasAbajo = calcularPrimasPlanes(750_001); // 750.001 y 1.012.501
    expect(calcularDiferenciaAnual(primasAbajo)).toBe(262_500);

    const primasArriba = calcularPrimasPlanes(750_002); // 750.002 y 1.012.503
    expect(calcularDiferenciaAnual(primasArriba)).toBe(262_501);
  });
});

describe('obtenerRecomendacionPlan', () => {
  it('recomienda Plan Plus y calcula la diferencia anual cuando se necesita vehículo de reemplazo', () => {
    const primas = calcularPrimasPlanes(2_805_000);
    const resultado = obtenerRecomendacionPlan(true, primas);

    expect(resultado).toEqual({
      planRecomendado: 'plus',
      diferenciaAnual: 981_750,
      motivo: MOTIVOS_RECOMENDACION.plus,
    });
  });

  it('recomienda Plan Esencial cuando no se necesita vehículo de reemplazo', () => {
    const primas = calcularPrimasPlanes(2_805_000);
    const resultado = obtenerRecomendacionPlan(false, primas);

    expect(resultado).toEqual({
      planRecomendado: 'esencial',
      diferenciaAnual: 981_750,
      motivo: MOTIVOS_RECOMENDACION.esencial,
    });
  });

  it('calcula la diferencia anual usando las primas ya redondeadas (Plus − Esencial)', () => {
    const primasAbajo = calcularPrimasPlanes(750_001);
    expect(obtenerRecomendacionPlan(false, primasAbajo).diferenciaAnual).toBe(
      262_500,
    );

    const primasArriba = calcularPrimasPlanes(750_002);
    expect(obtenerRecomendacionPlan(true, primasArriba).diferenciaAnual).toBe(
      262_501,
    );
  });
});

describe('flujo completo del comparador', () => {
  it('verifica el caso de control ($85.000.000 y "3 a 5 años"): base $2.805.000, Esencial $2.805.000, Plus $3.786.750 y diferencia $981.750', () => {
    const validacion = validarValorComercial('85.000.000');
    expect(validacion).toEqual({ valido: true, valor: 85_000_000 });
    if (!validacion.valido) return;

    const primaBase = calcularPrimaBase(validacion.valor, '3-5');
    const primas = calcularPrimasPlanes(primaBase);
    const diferencia = calcularDiferenciaAnual(primas);
    const conReemplazo = obtenerRecomendacionPlan(true, primas);
    const sinReemplazo = obtenerRecomendacionPlan(false, primas);

    expect(primaBase).toBe(2_805_000);
    expect(primas).toEqual({
      esencial: 2_805_000,
      plus: 3_786_750,
    });
    expect(diferencia).toBe(981_750);

    expect(conReemplazo).toEqual({
      planRecomendado: 'plus',
      diferenciaAnual: 981_750,
      motivo: MOTIVOS_RECOMENDACION.plus,
    });
    expect(sinReemplazo).toEqual({
      planRecomendado: 'esencial',
      diferenciaAnual: 981_750,
      motivo: MOTIVOS_RECOMENDACION.esencial,
    });
  });

  it('redondea correctamente prima base, primas de planes y diferencia cuando se generan decimales', () => {
    // 20.000.015 * 0,03 * 1,25 = 750.000,5625 -> base 750.001
    // Esencial: 750.001 | Plus: 750.001 * 1,35 = 1.012.501,35 -> 1.012.501 | Dif: 262.500
    const base1 = calcularPrimaBase(20_000_015, '6-10');
    const primas1 = calcularPrimasPlanes(base1);
    expect(base1).toBe(750_001);
    expect(primas1).toEqual({ esencial: 750_001, plus: 1_012_501 });
    expect(obtenerRecomendacionPlan(false, primas1).diferenciaAnual).toBe(
      262_500,
    );

    // 20.000.040 * 0,03 * 1,25 = 750.001,50 -> base 750.002
    // Esencial: 750.002 | Plus: 750.002 * 1,35 = 1.012.502,70 -> 1.012.503 | Dif: 262.501
    const base2 = calcularPrimaBase(20_000_040, '6-10');
    const primas2 = calcularPrimasPlanes(base2);
    expect(base2).toBe(750_002);
    expect(primas2).toEqual({ esencial: 750_002, plus: 1_012_503 });
    expect(obtenerRecomendacionPlan(true, primas2).diferenciaAnual).toBe(
      262_501,
    );
  });

  it('valida y calcula correctamente los límites mínimo ($20.000.000) y máximo ($300.000.000)', () => {
    // Mínimo permitido
    const minVal = validarValorComercial(VALOR_MINIMO);
    expect(minVal).toEqual({ valido: true, valor: 20_000_000 });
    const baseMin = calcularPrimaBase(VALOR_MINIMO, '0-2');
    const primasMin = calcularPrimasPlanes(baseMin);
    expect(baseMin).toBe(600_000);
    expect(primasMin).toEqual({ esencial: 600_000, plus: 810_000 });
    expect(obtenerRecomendacionPlan(false, primasMin)).toEqual({
      planRecomendado: 'esencial',
      diferenciaAnual: 210_000,
      motivo: MOTIVOS_RECOMENDACION.esencial,
    });

    // Máximo permitido
    const maxVal = validarValorComercial(VALOR_MAXIMO);
    expect(maxVal).toEqual({ valido: true, valor: 300_000_000 });
    const baseMax = calcularPrimaBase(VALOR_MAXIMO, 'mas-10');
    const primasMax = calcularPrimasPlanes(baseMax);
    expect(baseMax).toBe(12_600_000);
    expect(primasMax).toEqual({ esencial: 12_600_000, plus: 17_010_000 });
    expect(obtenerRecomendacionPlan(true, primasMax)).toEqual({
      planRecomendado: 'plus',
      diferenciaAnual: 4_410_000,
      motivo: MOTIVOS_RECOMENDACION.plus,
    });

    // Fuera de rango inmediato
    expect(validarValorComercial(VALOR_MINIMO - 1)).toMatchObject({
      valido: false,
      codigo: 'menor_minimo',
    });
    expect(validarValorComercial(VALOR_MAXIMO + 1)).toMatchObject({
      valido: false,
      codigo: 'mayor_maximo',
    });
  });
});
