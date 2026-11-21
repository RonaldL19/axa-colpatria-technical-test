# Registro de uso de Inteligencia Artificial (`uso_ia.md`)

Este documento describe de forma transparente cómo utilicé herramientas de Inteligencia Artificial durante la prueba técnica, con foco principal en la **Actividad 3 (comparador de planes)** y una nota breve sobre su uso en las demás actividades. Todos los prompts, resultados y correcciones descritos a continuación corresponden a la interacción real realizada durante el desarrollo.

---

## 1. Herramienta utilizada

- **Herramienta / agente:** Google Antigravity (asistente de programación agéntico basado en modelos Gemini).
- **Dinámica de trabajo:** Para la Actividad 3 abrí una conversación limpia dentro de Antigravity para que el agente inspeccionara el repositorio tal como estaba tras la Fase 1 y ejecutara una secuencia progresiva de 5 prompts controlados por mí, validando cada paso antes de continuar.

---

## 2. Prompts reales utilizados en la Actividad 3

### Prompts principales (citados textualmente)

#### Prompt principal 1 — Lógica de precios y tarjetas del comparador
> Perfecto, para darte un contexto en resumen, estoy desarrollando una prueba técnica en React, TypeScript,  Tailwind CSS y Vitest, la cual es una calculadora de prima de seguro de autos con datos ficticios. Ya tengo construida la fase 1 que es formulario con validación de $20.000.000 a $300.000.000 COP, antigüedad del vehículo, casilla de vehículo de reemplazo y cálculo de prima base en un archivo con la ruta src/lib/calculos.ts.
>
> Lo que necesito ahora es reemplazar el resultado temporal de prima base por el comparador "2. Compara nuestras coberturas" guiándonos por la imagen de referencia. Extiende src/lib/calculos.ts para calcular el precio anual del Plan Esencial (prima base × 1,00) y del Plan Plus (prima base x 1,35), redondeando cada prima al peso con math.round, ademas crea el componente del comparador con las dos tarjetas mostrando título, descripción corta, prima anual estimada en COP y las coberturas con chulito verde y x que en este caso lo utilizariamos en esencial:
>
> * solo asistencia en carretera
> * Plus: asistencia en carretera
> * vehículo de reemplazo y asistencia jurídica

**Qué generó la IA:**
- Extendió `src/lib/calculos.ts` con constantes de planes (`MULTIPLICADOR_ESENCIAL = 1.0`, `MULTIPLICADOR_PLUS = 1.35`, `COBERTURAS_CATALOGO`, `PLANES`, `PLANES_POR_ID`) y la función pura `calcularPrimasPlanes(primaBase)` redondeando cada plan al peso con `Math.round`.
- Creó `src/components/ComparadorPlanes.tsx` con las dos tarjetas (Plan Esencial y Plan Plus), sus precios formateados en COP y la lista de coberturas con íconos SVG (✓ y ✕).
- Reemplazó `src/components/ResumenPrimaBase.tsx` en `src/App.tsx` por el nuevo comparador.

---

#### Prompt principal 2 — Regla de recomendación dinámica y diferencia anual
> Por ahora, necesito que agregues la lógica de recomendación y la diferencia anual entre planes en src/lib/calculos.ts y conéctala en la interfaz. Si el usuario marcó "Necesito vehículo de reemplazo en caso de siniestro", el sistema debe recomendar el Plan Plus, si no lo marcó, debe recomendar el Plan Esencial por menor precio. La etiqueta "Recomendado" y el borde/fondo resaltado deben aplicarse dinámicamente a la tarjeta recomendada, y debajo de las tarjetas agrega el recuadro "Diferencia entre planes: $ X al año" con un mensaje claro que explique el motivo de la recomendación.

**Qué generó la IA:**
- Agregó `calcularDiferenciaAnual(primas)` (calculando `primas.plus - primas.esencial` sobre las primas ya redondeadas) y `obtenerRecomendacionPlan(necesitaReemplazo, primas)` en `src/lib/calculos.ts`, junto con los mensajes de recomendación en `MOTIVOS_RECOMENDACION`.
- Actualizó `src/components/ComparadorPlanes.tsx` y `src/App.tsx` para aplicar dinámicamente la etiqueta `"Recomendado"` y el borde/fondo resaltado sobre la tarjeta recomendada (Plus con vehículo de reemplazo; Esencial sin vehículo de reemplazo) y mostrar el recuadro inferior `"Diferencia entre planes: $ X al año"` con la explicación del motivo.

---

#### Prompt principal 3 — Revisión crítica de casos borde, accesibilidad y responsive
> Necesito que hagas una revisión del comparador y del flujo completo de la calculadora ya que necesito que verifiques casos en los límites de $20.000.000 y $300.000.000, redondeo al peso en primas y diferencia, qué pasa si el usuario cambia datos o la casilla de reemplazo después de calcular, y estados vacío o con error, accesibilidad  que es el contraste, navegación por teclado, aria-live y que los lectores de pantalla distingan claramente qué coberturas están incluidas o no.  Y por ultimo, comportamiento responsive en escritorio y móvil de 360 px.
>
> Un detalle que olvide mencionar previamente, y es que si encuentras algún error, explícame cuál es y corrígelo.

**Qué generó la IA:**
- Auditó el flujo completo en vivo (escritorio 1280 px, 1024 px y móvil 360 px) y el comportamiento reactivo de `src/App.tsx` (actualización en vivo tras el primer cálculo y ocultamiento del comparador si el valor pasa a ser inválido).
- Aplicó correcciones concretas en `src/components/EncabezadoHero.tsx`, `src/components/FormularioVehiculo.tsx`, `src/components/ComparadorPlanes.tsx` y `src/index.css` (detalladas en la sección 3).

---

### Otros prompts de la secuencia (resumen)

1. **Prompt inicial de contexto:** *"Explícame lo que entiendes de este proyecto de axacolpatria prueba tecnica."* — Sirvió para verificar que la sesión limpia entendía la estructura existente (Fase 1 y `email.html`) antes de modificar archivos.
2. **Prompt final de pruebas automatizadas:** Solicité ampliar `src/lib/calculos.test.ts` para cubrir el caso de control (`$85.000.000` y `"3 a 5 años"` → base `$2.805.000`, Esencial `$2.805.000`, Plus `$3.786.750`, diferencia `$981.750`), recomendación con y sin vehículo de reemplazo, redondeos con decimales y límites mínimo/máximo, y ejecutar `npm test` y `npm run build`. La IA amplió `src/lib/calculos.test.ts` (23 pruebas) y añadió `src/components/ComparadorPlanes.test.tsx` (5 pruebas de renderizado y accesibilidad del comparador).

---

## 3. Qué se revisó y qué se corrigió

En los pasos de creación de precios, recomendación y pruebas, la lógica matemática coincidió desde el inicio con los valores esperados y no requirió corrección de fórmulas. Sin embargo, durante la revisión crítica en navegador (Prompt principal 3) se detectaron y corrigieron **6 problemas reales**:

1. **Imágenes rotas en encabezado y hero (`src/components/EncabezadoHero.tsx`):** Las rutas apuntaban a `/assets/logo-axa.png`, `/assets/logo-axa-colpatria.png` y `/assets/vehiculo.jpg`, pero los archivos reales estaban en `src/assets/` y la foto del auto era `vehiculo.png`. Se corrigió importando las 3 imágenes como módulos ES para que Vite las sirva y empaquete en `dist/`.
2. **Placeholder residual y recorte en móvil 360 px (`src/components/EncabezadoHero.tsx`):** Había quedado el contenedor punteado del placeholder junto a los logos reales, duplicando el bloque y generando recorte vertical en `360 px`. Se eliminó el placeholder residual y se ajustaron las alturas responsivas (`h-9`/`h-8` en móvil, `h-11`/`h-10` en escritorio).
3. **Doble flecha en el selector de antigüedad (`src/index.css` y `src/components/FormularioVehiculo.tsx`):** En Chromium seguía visible el triángulo nativo `▼` junto al chevron SVG personalizado. Se agregó `.select-sin-flecha` con `appearance: none !important`, prefijos de navegador y `.select-sin-flecha::picker-icon { display: none; }`.
4. **Orden del DOM del badge "Recomendado" (`src/components/ComparadorPlanes.tsx`):** El `<span>Recomendado</span>` aparecía antes del `<h3>`, haciendo que lectores de pantalla navegando por encabezados lo omitieran. Se reubicó inmediatamente después del `<h3>` manteniendo su posición visual arriba a la derecha con `absolute -top-3 right-4`, y se dejó `<span className="sr-only">Incluye: / No incluye: </span>` como hijo directo de cada `<li>`.
5. **Contraste WCAG AA en íconos y textos secundarios (`ComparadorPlanes.tsx` y `FormularioVehiculo.tsx`):** El ícono `✕` (`text-slate-400`) daba 2.56:1 sobre blanco (debajo del mínimo 3:1 para gráficos informativos) y el placeholder tenía bajo contraste. Se subieron a `text-slate-500` (4.76:1 sobre blanco), chulitos `text-emerald-700`, badge `#3E56C4` y textos de ayuda `text-slate-600`.
6. **Desalineación vertical de precios en 1024 px (`ComparadorPlanes.tsx`):** A `1024×768`, la descripción de Plan Plus ocupaba una línea extra y desplazaba el precio `16.5 px` hacia abajo respecto a Plan Esencial. Se añadió `sm:min-h-[5.5rem] xl:min-h-[4.25rem]` al encabezado de tarjeta y `whitespace-nowrap text-2xl xl:text-3xl` al precio para mantenerlos alineados incluso en el valor máximo (`$ 17.010.000`).

---

## 4. Cómo se comprobó el resultado

- **Pruebas automatizadas (`npm test`):** Ejecuté Vitest con **28/28 pruebas aprobadas** (`23` pruebas puras en `src/lib/calculos.test.ts` y `5` pruebas de componente/accesibilidad en `src/components/ComparadorPlanes.test.tsx`).
- **Verificación de casos de control:**
  - Valor comercial `$ 85.000.000` + antigüedad `"3 a 5 años"` (factor `1,10`):
    - Prima base: **`$ 2.805.000`**
    - Plan Esencial (`× 1,00`): **`$ 2.805.000`**
    - Plan Plus (`× 1,35`): **`$ 3.786.750`**
    - Diferencia anual (`Plus − Esencial`): **`$ 981.750`**
  - Con casilla de vehículo de reemplazo marcada → recomienda **Plan Plus**; sin marcar → recomienda **Plan Esencial**.
  - Límites exactos (`$ 20.000.000` y `$ 300.000.000`), valores fuera de rango y casos con redondeo decimal (`Math.round`).
- **Compilación (`npm run build`):** `tsc -b && vite build` finalizó sin errores de TypeScript ni de empaquetado.
- **Revisión visual y de interacción:** Verifiqué la aplicación en navegador en escritorio (`1280 px` y `1024 px`) y móvil (`360 px`), comprobando la navegación con teclado, el formato de miles en vivo, las imágenes cargadas y la ausencia de desbordamiento horizontal.

---

## 5. Uso de IA en las demás actividades

Además de la Actividad 3, utilicé Google Antigravity como apoyo transparente en el resto del proyecto, revisando y validando cada fase antes de avanzar:

- **Preparación (Fase 0):** Configuración inicial del proyecto (Vite, React, TypeScript, Tailwind CSS y Vitest) y resolución de error de tipado `TS2882` añadiendo `src/vite-env.d.ts`.
- **Actividad 1 (Calculadora de prima base):** Estructuración inicial de `src/lib/calculos.ts`, formulario accesible, diseño base según la referencia visual y pruebas unitarias iniciales.
- **Actividad 2 (`email.html`):** Definición del enfoque compatible con Gmail y Outlook (tablas, estilos inline, VML `v:roundrect`, preheader y variables) y corrección de apilamiento móvil en la cabecera para `360 px`.
- **Actividades 4 y 5 (Calidad, medición y documentación):** Integración del evento `cotizacion_calculada` en `window.dataLayer`, pruebas correspondientes y redacción de la documentación técnica en `README.md`.
