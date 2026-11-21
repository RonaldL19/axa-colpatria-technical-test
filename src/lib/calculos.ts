export const VALOR_MINIMO = 20_000_000;
export const VALOR_MAXIMO = 300_000_000;
export const TASA_BASE = 0.03;
export const MULTIPLICADOR_ESENCIAL = 1.0;
export const MULTIPLICADOR_PLUS = 1.35;

export type AntiguedadId = '0-2' | '3-5' | '6-10' | 'mas-10';

export const COBERTURAS_CATALOGO = [
  'Asistencia en carretera',
  'Vehículo de reemplazo',
  'Asistencia jurídica',
] as const;

export type Cobertura = (typeof COBERTURAS_CATALOGO)[number];

export type PlanId = 'esencial' | 'plus';

export interface DefinicionPlan {
  id: PlanId;
  nombre: string;
  descripcion: string;
  multiplicador: number;
  coberturas: readonly Cobertura[];
}

export interface PrimasPlanes {
  esencial: number;
  plus: number;
}

export interface ResultadoRecomendacion {
  planRecomendado: PlanId;
  diferenciaAnual: number;
  motivo: string;
}

export const PLANES: readonly DefinicionPlan[] = [
  {
    id: 'esencial',
    nombre: 'Plan Esencial',
    descripcion: 'Protección básica para tu vehículo',
    multiplicador: MULTIPLICADOR_ESENCIAL,
    coberturas: ['Asistencia en carretera'],
  },
  {
    id: 'plus',
    nombre: 'Plan Plus',
    descripcion: 'Mayor cobertura y respaldo en todo momento',
    multiplicador: MULTIPLICADOR_PLUS,
    coberturas: [
      'Asistencia en carretera',
      'Vehículo de reemplazo',
      'Asistencia jurídica',
    ],
  },
] as const;

export const PLANES_POR_ID: Record<PlanId, DefinicionPlan> = {
  esencial: PLANES[0],
  plus: PLANES[1],
};

export const MOTIVOS_RECOMENDACION: Record<PlanId, string> = {
  plus: 'Te recomendamos el Plan Plus porque indicaste que necesitas vehículo de reemplazo.',
  esencial: 'Te recomendamos el Plan Esencial por ser la opción de menor precio.',
};

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

/**
 * Calcula las primas anuales del Plan Esencial (prima base × 1,00) y del
 * Plan Plus (prima base × 1,35), redondeando cada prima al peso con Math.round.
 */
export function calcularPrimasPlanes(primaBase: number): PrimasPlanes {
  if (!Number.isFinite(primaBase) || primaBase < 0) {
    throw new Error(
      'La prima base debe ser un número finito mayor o igual a cero.',
    );
  }

  return {
    esencial: Math.round(primaBase * MULTIPLICADOR_ESENCIAL),
    plus: Math.round(primaBase * MULTIPLICADOR_PLUS),
  };
}

/**
 * Calcula la diferencia anual entre Plan Plus y Plan Esencial (Plus − Esencial)
 * utilizando las primas ya redondeadas al peso.
 */
export function calcularDiferenciaAnual(primas: PrimasPlanes): number {
  return primas.plus - primas.esencial;
}

/**
 * Determina el plan recomendado, la diferencia anual (Plus − Esencial) usando
 * las primas ya redondeadas y el texto de recomendación.
 */
export function obtenerRecomendacionPlan(
  necesitaReemplazo: boolean,
  primas: PrimasPlanes,
): ResultadoRecomendacion {
  const planRecomendado: PlanId = necesitaReemplazo ? 'plus' : 'esencial';
  const diferenciaAnual = calcularDiferenciaAnual(primas);

  return {
    planRecomendado,
    diferenciaAnual,
    motivo: MOTIVOS_RECOMENDACION[planRecomendado],
  };
}
