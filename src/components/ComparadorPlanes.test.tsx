import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ComparadorPlanes } from './ComparadorPlanes';

function normalizarEspacios(texto: string): string {
  return texto.replace(/\u00a0/g, ' ');
}

function extraerTarjetaPlan(html: string, planId: 'esencial' | 'plus'): string {
  const expresion = new RegExp(
    `<article[^>]*aria-labelledby="plan-titulo-${planId}"[\\s\\S]*?</article>`,
  );
  const coincidencia = html.match(expresion);
  if (!coincidencia) {
    throw new Error(`No se encontró la tarjeta para el plan "${planId}".`);
  }
  return coincidencia[0];
}

describe('ComparadorPlanes', () => {
  it('muestra el estado inicial cuando aún no se ha calculado la prima base', () => {
    const html = renderToStaticMarkup(
      <ComparadorPlanes primaBase={null} necesitaReemplazo={false} />,
    );

    expect(html).toContain('2. Compara nuestras coberturas');
    expect(html).toContain('Ingresa los datos de tu vehículo para comparar planes');
    expect(html).not.toContain('Diferencia entre planes:');
  });

  it('muestra la etiqueta "Recomendado" en Plan Plus y el motivo correcto cuando se selecciona vehículo de reemplazo', () => {
    const html = normalizarEspacios(
      renderToStaticMarkup(
        <ComparadorPlanes primaBase={2_805_000} necesitaReemplazo={true} />,
      ),
    );

    const tarjetaEsencial = extraerTarjetaPlan(html, 'esencial');
    const tarjetaPlus = extraerTarjetaPlan(html, 'plus');

    expect(html).toContain('2. Compara nuestras coberturas');
    expect(tarjetaPlus).toContain('Recomendado');
    expect(tarjetaPlus).toContain('border-[#6875EB]');
    expect(tarjetaPlus).toContain('bg-[#F5F6FF]');
    expect(tarjetaEsencial).not.toContain('Recomendado');
    expect(tarjetaEsencial).toContain('border-slate-200 bg-white');

    expect(tarjetaEsencial).toContain('Plan Esencial');
    expect(tarjetaEsencial).toContain('Protección básica para tu vehículo');
    expect(tarjetaEsencial).toContain('$ 2.805.000');
    expect(tarjetaEsencial).toContain('prima anual estimada');

    expect(tarjetaPlus).toContain('Plan Plus');
    expect(tarjetaPlus).toContain('Mayor cobertura y respaldo en todo momento');
    expect(tarjetaPlus).toContain('$ 3.786.750');
    expect(tarjetaPlus).toContain('prima anual estimada');

    expect(html).toContain('Diferencia entre planes:');
    expect(html).toContain('$ 981.750');
    expect(html).toContain('al año');
    expect(html).toContain(
      'Te recomendamos el Plan Plus porque indicaste que necesitas vehículo de reemplazo.',
    );
  });

  it('muestra la etiqueta "Recomendado" en Plan Esencial y el motivo correcto cuando no se selecciona vehículo de reemplazo', () => {
    const html = normalizarEspacios(
      renderToStaticMarkup(
        <ComparadorPlanes primaBase={2_805_000} necesitaReemplazo={false} />,
      ),
    );

    const tarjetaEsencial = extraerTarjetaPlan(html, 'esencial');
    const tarjetaPlus = extraerTarjetaPlan(html, 'plus');

    expect(tarjetaEsencial).toContain('Recomendado');
    expect(tarjetaEsencial).toContain('border-[#6875EB]');
    expect(tarjetaEsencial).toContain('bg-[#F5F6FF]');
    expect(tarjetaPlus).not.toContain('Recomendado');
    expect(tarjetaPlus).toContain('border-slate-200 bg-white');

    expect(html).toContain('$ 981.750');
    expect(html).toContain(
      'Te recomendamos el Plan Esencial por ser la opción de menor precio.',
    );
  });

  it('muestra coberturas incluidas y no incluidas con contexto accesible para lectores de pantalla', () => {
    const html = renderToStaticMarkup(
      <ComparadorPlanes primaBase={1_000_000} necesitaReemplazo={false} />,
    );

    const tarjetaEsencial = extraerTarjetaPlan(html, 'esencial');
    const tarjetaPlus = extraerTarjetaPlan(html, 'plus');

    expect(tarjetaEsencial).toContain(
      '<span class="sr-only">Incluye: </span><span class="font-medium text-slate-800">Asistencia en carretera</span>',
    );
    expect(tarjetaEsencial).toContain(
      '<span class="sr-only">No incluye: </span><span class="text-slate-600">Vehículo de reemplazo</span>',
    );
    expect(tarjetaEsencial).toContain(
      '<span class="sr-only">No incluye: </span><span class="text-slate-600">Asistencia jurídica</span>',
    );

    expect(tarjetaPlus).toContain(
      '<span class="sr-only">Incluye: </span><span class="font-medium text-slate-800">Asistencia en carretera</span>',
    );
    expect(tarjetaPlus).toContain(
      '<span class="sr-only">Incluye: </span><span class="font-medium text-slate-800">Vehículo de reemplazo</span>',
    );
    expect(tarjetaPlus).toContain(
      '<span class="sr-only">Incluye: </span><span class="font-medium text-slate-800">Asistencia jurídica</span>',
    );
  });

  it('coloca la etiqueta "Recomendado" después del encabezado del plan en el orden del DOM', () => {
    const html = renderToStaticMarkup(
      <ComparadorPlanes primaBase={2_805_000} necesitaReemplazo={true} />,
    );

    const tarjetaPlus = extraerTarjetaPlan(html, 'plus');
    const indiceTitulo = tarjetaPlus.indexOf('Plan Plus</h3>');
    const indiceRecomendado = tarjetaPlus.indexOf('Recomendado');

    expect(indiceTitulo).toBeGreaterThan(-1);
    expect(indiceRecomendado).toBeGreaterThan(indiceTitulo);
  });
});
