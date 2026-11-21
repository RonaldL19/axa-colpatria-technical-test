export const VALOR_MINIMO = 20_000_000;
export const VALOR_MAXIMO = 300_000_000;
export const TASA_BASE = 0.03;

export type AntiguedadId = '0-2' | '3-5' | '6-10' | 'mas-10';

export interface OpcionAntiguedad {
  id: AntiguedadId;
  etiqueta: string;
  factor: number;
}

export const OPCIONES_ANTIGUEDAD: readonly OpcionAntiguedad[] = [
  { id: '0-2', etiqueta: '0 a 2 años', factor: 1.0 },
  { id: '3-5', etiqueta: '3 a 5 años', factor: 1.1 },
  { id: '6-10', etiqueta: '6 a 10 años', factor: 1.25 },
  { id: 'mas-10', etiqueta: 'Más de 10 años', factor: 1.4 },
] as const;

export const FACTORES_ANTIGUEDAD: Record<AntiguedadId, number> = {
  '0-2': 1.0,
  '3-5': 1.1,
  '6-10': 1.25,
  'mas-10': 1.4,
};

export type CodigoErrorValor =
  | 'vacio'
  | 'no_numerico'
  | 'menor_minimo'
  | 'mayor_maximo';

export type ResultadoValidacionValor =
  | { valido: true; valor: number }
  | { valido: false; codigo: CodigoErrorValor; mensaje: string };

const formateadorMonedaCOP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const formateadorMilesCO = new Intl.NumberFormat('es-CO', {
  maximumFractionDigits: 0,
});

/**
 * Formatea un monto en pesos colombianos (COP) sin decimales.
 */
export function formatearMonedaCOP(valor: number): string {
  return formateadorMonedaCOP.format(Math.round(valor));
}

/**
 * Formatea una entrada de texto con separador de miles (es-CO) mientras el usuario escribe.
 * Si contiene caracteres no numéricos (letras, signos negativos, comas), conserva el texto
 * original para que la validación muestre el mensaje de error correspondiente.
 */
export function formatearEntradaMiles(entrada: string): string {
  const recortada = entrada.trim();
  if (recortada === '') {
    return '';
  }

  const sinFormato = recortada.replace(/[$\s.]/g, '');
  if (sinFormato === '' || !/^\d+$/.test(sinFormato)) {
    return entrada;
  }

  // Evitar pérdida de precisión visual si se pegan demasiados dígitos
  if (sinFormato.length > 15) {
    return sinFormato.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  return formateadorMilesCO.format(Number(sinFormato));
}

/**
 * Valida el valor comercial del vehículo (cadena ingresada por el usuario o número)
 * contra los límites permitidos ($20.000.000 a $300.000.000 COP).
 */
export function validarValorComercial(
  entrada: string | number,
): ResultadoValidacionValor {
  let valorNumerico: number;

  if (typeof entrada === 'number') {
    if (!Number.isFinite(entrada)) {
      return {
        valido: false,
        codigo: 'no_numerico',
        mensaje: 'Ingresa un valor numérico válido en pesos colombianos.',
      };
    }
    valorNumerico = entrada;
  } else {
    const recortada = entrada.trim();
    if (recortada === '') {
      return {
        valido: false,
        codigo: 'vacio',
        mensaje: 'Ingresa el valor comercial del vehículo.',
      };
    }

    const sinFormato = recortada.replace(/[$\s.]/g, '');
    if (sinFormato === '' || !/^\d+$/.test(sinFormato)) {
      return {
        valido: false,
        codigo: 'no_numerico',
        mensaje: 'Ingresa un valor numérico válido (solo números, sin letras ni decimales).',
      };
    }

    valorNumerico = Number(sinFormato);
    if (!Number.isFinite(valorNumerico)) {
      return {
        valido: false,
        codigo: 'mayor_maximo',
        mensaje: `El valor comercial máximo permitido es de ${formatearMonedaCOP(VALOR_MAXIMO)}.`,
      };
    }
  }

  if (valorNumerico < VALOR_MINIMO) {
    return {
      valido: false,
      codigo: 'menor_minimo',
      mensaje: `El valor comercial mínimo permitido es de ${formatearMonedaCOP(VALOR_MINIMO)}.`,
    };
  }

  if (valorNumerico > VALOR_MAXIMO) {
    return {
      valido: false,
      codigo: 'mayor_maximo',
      mensaje: `El valor comercial máximo permitido es de ${formatearMonedaCOP(VALOR_MAXIMO)}.`,
    };
  }

  return { valido: true, valor: valorNumerico };
}

/**
 * Calcula la prima base anual redondeada al peso colombiano más cercano.
 * Fórmula: Math.round(valorComercial * 3% * factorAntiguedad).
 */
export function calcularPrimaBase(
  valorComercial: number,
  antiguedad: AntiguedadId,
): number {
  const validacion = validarValorComercial(valorComercial);
  if (!validacion.valido) {
    throw new Error(validacion.mensaje);
  }

  const factor = FACTORES_ANTIGUEDAD[antiguedad];
  return Math.round(validacion.valor * TASA_BASE * factor);
}

/**
 * Devuelve la metadata de una opción de antigüedad a partir de su identificador.
 */
export function obtenerOpcionAntiguedad(id: AntiguedadId): OpcionAntiguedad {
  const opcion = OPCIONES_ANTIGUEDAD.find((item) => item.id === id);
  if (!opcion) {
    throw new Error(`Antigüedad no reconocida: ${id}`);
  }
  return opcion;
}
