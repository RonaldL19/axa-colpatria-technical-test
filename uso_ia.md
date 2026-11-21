# Uso de IA

**Proyecto:** Prueba técnica AXA Colpatria: calculadora y comparador de seguro de autos (React + TypeScript + Tailwind CSS + Vitest), con datos ficticios.

---

## 1. Herramienta utilizada

**Antigravity**, como asistente de IA para analizar el proyecto, generar y modificar código, revisar el flujo completo, escribir pruebas unitarias y ejecutar pruebas y build.

---

## 2. Prompts reales y qué generó la IA

### Interacción 1: Comprensión general del proyecto

**Prompt:**

Explícame lo que entiendes de este proyecto de AXA Colpatria prueba técnica.

**Qué generó la IA (resumen):**

La IA describió el proyecto como una calculadora y comparador de seguro de autos en React + TypeScript, acompañada de una plantilla de correo comercial HTML compatible con clientes de email. Su explicación cubrió cinco puntos:

1. **Stack técnico:** React 19, TypeScript, Vite, Tailwind CSS 4 y Vitest (en entorno `node`, con `renderToStaticMarkup`), sobre Node >= 22.
2. **Aplicación web:**
   - **Cálculo de la prima base** (`src/lib/calculos.ts`): valida el valor comercial entre $20.000.000 y $300.000.000 COP, formatea miles y aplica la fórmula `round(valorComercial × 0.03 × factorAntiguedad)`, con factores de 1.0 (0-2 años), 1.1 (3-5), 1.25 (6-10) y 1.4 (más de 10).
   - **Planes** (`src/lib/planes.ts`): Esencial (× 1.00, con asistencia en carretera) y Plus (× 1.35, con asistencia en carretera, vehículo de reemplazo y asistencia jurídica), más la diferencia anual y la recomendación según la casilla de vehículo de reemplazo.
   - **Componentes:** `EncabezadoHero`, `FormularioVehiculo` (con `aria-invalid`, `aria-describedby`, `role="alert"` y foco automático en error), `ResumenPrimaBase`, `ComparadorPlanes` y `FranjaBeneficios`.
3. **Plantilla de correo (`email.html`):** maquetación 100% con tablas y estilos inline, ancho máximo de 600 px, botón CTA con VML para Outlook, preheader oculto, diseño responsive y variables de plantilla (`{{nombre_cliente}}`, `{{producto}}`, `{{prima_estimada}}`).
4. **Pruebas automatizadas:** tres suites en Vitest (`calculos.test.ts`, `planes.test.ts` y `ComparadorPlanes.test.tsx`), incluido el caso de control de $85.000.000 con 3-5 años = $2.805.000.
5. **Estado actual:** Fase 0, Actividad 1 y Actividad 2 ya commiteadas en `main`; el comparador de planes, en progreso; y pendiente la redacción final de `uso_ia.md`.

Además, la IA **detectó dos errores** en `EncabezadoHero.tsx`: las rutas de las imágenes eran incorrectas (`/assets/...` y `.jpg` cuando los archivos están en `src/assets/` y el vehículo es `.png`) y quedaba un placeholder de logo duplicado junto a la etiqueta `<img>`. Ofreció corregirlos, correr los tests o seguir con la siguiente fase.

---

### Interacción 2: Comparador de planes: cálculo y componente

**Prompt:**

Perfecto, para darte un contexto en resumen, estoy desarrollando una prueba técnica en React, TypeScript, Tailwind CSS y Vitest, la cual es una calculadora de prima de seguro de autos con datos ficticios. Ya tengo construida la fase 1 que es formulario con validación de $20.000.000 a $300.000.000 COP, antigüedad del vehículo, casilla de vehículo de reemplazo y cálculo de prima base en un archivo con la ruta `src/lib/calculos.ts`.

Lo que necesito ahora es reemplazar el resultado temporal de prima base por el comparador "2. Compara nuestras coberturas" guiándonos por la imagen de referencia. Extiende `src/lib/calculos.ts` para calcular el precio anual del Plan Esencial (prima base × 1,00) y del Plan Plus (prima base x 1,35), redondeando cada prima al peso con `Math.round`, además crea el componente del comparador con las dos tarjetas mostrando título, descripción corta, prima anual estimada en COP y las coberturas con chulito verde y x que en este caso lo utilizaríamos en Esencial:

- Solo asistencia en carretera
- Plus: asistencia en carretera, vehículo de reemplazo y asistencia jurídica

**Qué generó la IA (resumen):**

La IA extendió la lógica de cálculo y reemplazó el resumen temporal por el comparador «2. Compara nuestras coberturas», siguiendo la imagen de referencia. Los cambios fueron:

1. **Lógica en `src/lib/calculos.ts`:**
   - Nuevas constantes: `MULTIPLICADOR_ESENCIAL` (1.0), `MULTIPLICADOR_PLUS` (1.35), `COBERTURAS_CATALOGO`, `PLANES` y `MOTIVOS_RECOMENDACION`.
   - `calcularPrimasPlanes(primaBase)`: calcula la prima anual de cada plan y redondea al peso con `Math.round`.
   - `obtenerRecomendacionPlan(necesitaReemplazo, primas)`: calcula la diferencia anual (Plus − Esencial sobre valores ya redondeados) y define el plan recomendado y su mensaje.
   - Eliminó los archivos duplicados `planes.ts` y `planes.test.ts` para centralizar todo en `calculos.ts`.
2. **Componente `src/components/ComparadorPlanes.tsx`:**
   - Título «2. Compara nuestras coberturas», con estado vacío antes de calcular y dos tarjetas después.
   - **Plan Esencial** («Protección básica para tu vehículo»): prima anual en COP, chulo verde en Asistencia en carretera y ✕ gris en Vehículo de reemplazo y Asistencia jurídica.
   - **Plan Plus** («Mayor cobertura y respaldo en todo momento»): prima anual en COP y chulo verde en las tres coberturas.
   - Etiqueta «Recomendado», franja inferior con la diferencia anual (ejemplo: «Diferencia entre planes: $ 981.750 al año») y el motivo de la recomendación.
   - Textos `sr-only` («Incluye: » / «No incluye: ») para lectores de pantalla.
3. **Integración en `src/App.tsx`:** `ResumenPrimaBase` (archivo eliminado) fue reemplazado por `ComparadorPlanes`, que se actualiza al calcular o ajustar las opciones.
4. **Pruebas:** actualizó `calculos.test.ts` (constantes, caso de control $2.805.000 → $2.805.000 y $3.786.750 con diferencia de $981.750, redondeos y errores) y `ComparadorPlanes.test.tsx` (estado vacío, ambos escenarios de recomendación y accesibilidad).

**Verificación reportada:** 22/22 pruebas de Vitest aprobadas y `tsc -b` + `vite build` sin errores.

---

### Interacción 3: Lógica de recomendación y diferencia anual entre planes

**Prompt:**

Por ahora, necesito que agregues la lógica de recomendación y la diferencia anual entre planes en `src/lib/calculos.ts` y conéctala en la interfaz. Si el usuario marcó "Necesito vehículo de reemplazo en caso de siniestro", el sistema debe recomendar el Plan Plus, si no lo marcó, debe recomendar el Plan Esencial por menor precio. La etiqueta "Recomendado" y el borde/fondo resaltado deben aplicarse dinámicamente a la tarjeta recomendada, y debajo de las tarjetas agrega el recuadro "Diferencia entre planes: $ X al año" con un mensaje claro que explique el motivo de la recomendación.

**Qué generó la IA (resumen):**

La IA implementó la recomendación y la diferencia anual, y las conectó de forma dinámica en la interfaz:

1. **Lógica pura en `src/lib/calculos.ts`:**
   - `calcularDiferenciaAnual(primas)`: calcula `primas.plus - primas.esencial` con las primas ya redondeadas.
   - `obtenerRecomendacionPlan(necesitaReemplazo, primas)`: si la casilla está marcada, recomienda el Plan Plus («porque indicaste que necesitas vehículo de reemplazo»); si no, recomienda el Plan Esencial («por ser la opción de menor precio»). Devuelve `{ planRecomendado, diferenciaAnual, motivo }`.
2. **Interfaz (`ComparadorPlanes.tsx` y `App.tsx`):** al marcar o desmarcar la casilla, la etiqueta flotante «Recomendado» y el borde/fondo resaltado (`border-[#3E56C4] bg-[#F4F7FF]`) pasan a la tarjeta correspondiente, y la otra queda con estilo neutro. Debajo de las tarjetas se muestra el recuadro «Diferencia entre planes: $ X al año» con el motivo de la recomendación.
3. **Pruebas:** en `calculos.test.ts` validó ambas funciones (caso de control $981.750 y casos con redondeo), y en `ComparadorPlanes.test.tsx` comprobó que el badge, las clases resaltadas, la diferencia anual y el mensaje cambian entre Plus y Esencial.

**Verificación reportada:** 23/23 pruebas de Vitest aprobadas y `tsc -b && vite build` sin errores.

---

### Interacción 4: Revisión completa del comparador y del flujo de la calculadora

**Prompt:**

Necesito que hagas una revisión del comparador y del flujo completo de la calculadora ya que necesito que verifiques casos en los límites de $20.000.000 y $300.000.000, redondeo al peso en primas y diferencia, qué pasa si el usuario cambia datos o la casilla de reemplazo después de calcular, y estados vacío o con error, accesibilidad que es el contraste, navegación por teclado, aria-live y que los lectores de pantalla distingan claramente qué coberturas están incluidas o no. Y por último, comportamiento responsive en escritorio y móvil de 360 px. Un detalle que olvidé mencionar previamente, y es que si encuentras algún error, explícame cuál es y corrígelo.

**Qué generó la IA (resumen):**

La IA encontró y corrigió **6 errores**, explicando cada uno:

1. **Imágenes rotas** en `EncabezadoHero.tsx`: las rutas `/assets/...` no existían y la foto del auto es `vehiculo.png`. Se importaron los tres archivos como módulos ES desde `src/assets/`.
2. **Placeholder residual** «Logo AXA Colpatria (200×48)» y recorte en móvil de 360 px: se eliminó el placeholder y se ajustaron los tamaños de los logos.
3. **Doble flecha** en el selector de antigüedad (la nativa y el chevron personalizado): se agregó la regla `.select-sin-flecha` con `appearance: none`.
4. **Orden del DOM:** el badge «Recomendado» estaba antes del `<h3>` y los lectores de pantalla lo omitían; se movió después del `<h3>` manteniendo su posición visual.
5. **Contraste:** el ícono ✕ (2.56:1) y el placeholder (~2.4:1) no cumplían WCAG AA; se subieron a `slate-500`/`slate-600`, los chulitos a `emerald-700` y el badge a `#3E56C4`.
6. **Desalineación de precios** de 16.5 px en 1024 px de ancho: se fijó una altura mínima en el bloque superior de cada tarjeta y `whitespace-nowrap` en el precio.

Además reportó la verificación de cada punto pedido:

- **Límites y redondeo:** $20.000.000 (Esencial $600.000, Plus $810.000, diferencia $210.000), caso de control $85.000.000 (diferencia $981.750) y $300.000.000 (Esencial $12.600.000, Plus $17.010.000, diferencia $4.410.000), sin descuadres de $1.
- **Estados de error y cambios tras calcular:** vacío, texto, $19.999.999 y $300.000.001 muestran `role="alert"` y `aria-invalid`, enfocan el campo y mantienen el comparador vacío; al cambiar la casilla, la antigüedad o el valor, todo se actualiza al instante.
- **Accesibilidad:** jerarquía h1 → h2 → h3, navegación con Tab, foco visible, `aria-live="polite"`, `aria-labelledby` en las tarjetas y textos `sr-only` en cada cobertura.
- **Responsive:** 1280×900, 1024×768 y 360×800 sin desbordamiento horizontal.

**Verificación reportada:** 25/25 pruebas de Vitest y `tsc -b` + `vite build` sin errores, con las 3 imágenes empaquetadas en `dist/assets/`.

---

### Interacción 5: Pruebas unitarias de la lógica del comparador

**Prompt:**

Ayúdame a crear las pruebas unitarias en `src/lib/calculos.test.ts` para verificar que toda la lógica del comparador funcione correctamente, para eso quiero que se tenga en cuenta los siguientes casos:

- Un caso de prueba con un valor de $85.000.000 y una antigüedad de "3 a 5 años", donde los resultados esperados sean: base $2.805.000, Esencial $2.805.000, Plus $3.786.750 y una diferencia de $981.750.
- La recomendación del comparador cuando se tiene y cuando no se tiene vehículo de reemplazo.
- El redondeo de los valores cuando se generan decimales.
- El comportamiento cuando se alcanzan los valores mínimos y máximos permitidos.

Cuando termines, ejecuta `npm test` y `npm run build` para comprobar que todo funcione correctamente. Finalmente, muéstrame los resultados de ambas ejecuciones.

**Qué generó la IA (resumen):**

La IA completó `src/lib/calculos.test.ts` con una suite de flujo completo que cubre de extremo a extremo los cuatro casos pedidos:

- **Caso de control ($85.000.000 y «3 a 5 años»):** verifica prima base $2.805.000, Esencial $2.805.000, Plus $3.786.750 y diferencia anual $981.750.
- **Recomendación:** valida el Plan Plus cuando se solicita vehículo de reemplazo y el Plan Esencial cuando no, junto con sus motivos exactos.
- **Redondeo con decimales:** valida el redondeo hacia abajo, hacia arriba y en `.5` con `Math.round`, tanto en `calcularPrimaBase` como en `calcularPrimasPlanes` (× 1,35), y la consistencia de `calcularDiferenciaAnual` sobre primas ya redondeadas.
- **Límites mínimo y máximo:** valida $20.000.000 (base $600.000, Esencial $600.000, Plus $810.000, diferencia $210.000), $300.000.000 (base $12.600.000, Esencial $12.600.000, Plus $17.010.000, diferencia $4.410.000) y el rechazo inmediato de $19.999.999 y $300.000.001.

---

## 3. Qué revisé y corregí

Tras generar el comparador (interacciones 2 y 3), pedí una revisión completa con la instrucción de que, si había errores, me explicara cuáles eran y los corrigiera. Se corrigieron:

1. Las **imágenes rotas** del encabezado, por rutas incorrectas.
2. El **placeholder residual** del logo y el recorte en móvil de 360 px.
3. La **doble flecha** del selector de antigüedad.
4. El **orden del DOM** del badge «Recomendado» para lectores de pantalla.
5. El **contraste** de íconos y textos secundarios, para cumplir WCAG AA.
6. La **desalineación de precios** de 16.5 px en 1024 px.

Además, en la interacción 2 la lógica de planes se centralizó en `calculos.ts` y se eliminaron los archivos duplicados `planes.ts` y `planes.test.ts`.

---

## 4. Cómo comprobé el resultado

- **Pruebas automatizadas:** Vitest pasó de 22/22 a 23/23 y a 25/25 a lo largo del trabajo, cerró en **28/28** tras la interacción 5 y llegó a **33/33** en la entrega final al sumar las 5 pruebas de medición en `src/lib/analytics.test.ts`.
- **Build:** `tsc -b` y `vite build` sin errores.
- **Casos de control:**

  | Caso | Esencial | Plus | Diferencia |
  |------|---------:|-----:|-----------:|
  | $20.000.000, 0-2 años (mínimo) | $ 600.000 | $ 810.000 | $ 210.000 |
  | $85.000.000, 3-5 años (caso de control) | $ 2.805.000 | $ 3.786.750 | $ 981.750 |
  | $300.000.000, más de 10 años (máximo) | $ 12.600.000 | $ 17.010.000 | $ 4.410.000 |

- **Estados de error:** vacío, texto, $19.999.999 y $300.000.001 muestran alerta accesible y mantienen el comparador vacío.
- **Accesibilidad:** navegación con Tab, foco visible, `aria-live` y textos `sr-only` que distinguen coberturas incluidas y no incluidas.
- **Responsive:** 1280, 1024 y 360 px sin desbordamiento horizontal.

---

## 5. Uso de IA en las demás actividades

El foco principal del trabajo con IA fue la Actividad 3, documentada arriba. En el resto del proyecto (configuración inicial, calculadora base, `email.html`, integración de `window.dataLayer` y documentación) utilicé Antigravity de forma puntual como apoyo técnico y para la revisión final de funcionalidad, validaciones, accesibilidad y compilación, manteniendo siempre el control sobre las decisiones, pruebas y ajustes de cada entregable.
