import { describe, expect, it } from 'vitest';
import {
  VALOR_MAXIMO,
  VALOR_MINIMO,
  calcularPrimaBase,
  formatearEntradaMiles,
  formatearMonedaCOP,
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
