# Uso de IA

**Proyecto:** Prueba técnica AXA Colpatria: calculadora y comparador de seguro de autos (React + TypeScript + Tailwind CSS + Vitest), con datos ficticios.

> Versión completa: incluye cada prompt y cada respuesta de la IA de forma literal.

---

## 1. Herramienta utilizada

**Antigravity.** La usé como asistente de IA durante el desarrollo: para analizar el proyecto, generar y modificar código, revisar el flujo completo, escribir pruebas unitarias y ejecutar pruebas y build.

---

## 2. Prompts reales y qué generó la IA

Las 5 interacciones se presentan en orden cronológico. En cada una aparece el prompt que escribí y la respuesta de la IA sin resumir.

### Interacción 1: Comprensión general del proyecto

**Prompt:**

Explícame lo que entiendes de este proyecto de AXA Colpatria prueba técnica.

**Qué generó la IA:**

Este proyecto es una prueba técnica para AXA Colpatria orientada a construir una calculadora y comparador de seguro de autos en React + TypeScript, acompañada de una plantilla de correo comercial HTML compatible con clientes de email.

#### 1. Stack técnico

Definido en `package.json` y `vite.config.ts`:

- **Frontend:** React 19, TypeScript 7, Vite 8 y Tailwind CSS 4 (`@tailwindcss/vite`).
- **Testing:** Vitest 5 (en entorno `node`, usando `renderToStaticMarkup` para probar componentes).
- **Entorno:** Node >= 22.0.0.

#### 2. Qué hace la aplicación web (Actividades 1 y 3)

El punto de entrada es `src/App.tsx`, basado en la referencia visual `Diseno Referencia Calculadora AXA.jpg`.

##### Lógica de negocio pura

**Cálculo de prima base y validaciones** (`src/lib/calculos.ts`):

- Valida el valor comercial del vehículo en pesos colombianos (COP) entre $20.000.000 y $300.000.000, rechazando vacíos, texto no numérico o valores fuera de rango.
- Formatea miles en tiempo real (es-CO) y monedas sin decimales.
- Calcula la prima anual base con la fórmula:

  ```
  primaBase = round(valorComercial × 0.03 × factorAntiguedad)
  ```

- Factores de antigüedad: 0-2 años (1.0), 3-5 años (1.1), 6-10 años (1.25) y más de 10 años (1.4).

**Planes y recomendación** (`src/lib/planes.ts`):

- **Plan Esencial (× 1.00):** incluye Asistencia en carretera.
- **Plan Plus (× 1.35):** incluye Asistencia en carretera, Vehículo de reemplazo y Asistencia jurídica.
- Calcula la diferencia anual (Plus - Esencial usando primas ya redondeadas) y recomienda Plan Plus si el usuario marca "Necesito vehículo de reemplazo", o Plan Esencial en caso contrario por menor precio.

##### Interfaz y componentes

- `EncabezadoHero.tsx`: barra superior de marca y hero principal con título y foto del vehículo.
- `FormularioVehiculo.tsx`: paso 1 con valor comercial, selector de antigüedad, checkbox de vehículo de reemplazo y accesibilidad (`aria-invalid`, `aria-describedby`, `role="alert"` y foco automático en error).
- `ResumenPrimaBase.tsx`: pantalla de estado inicial (cuando aún no se ha calculado) que proviene de la Fase 1.
- `ComparadorPlanes.tsx`: paso 2 que reemplaza el estado vacío al calcular; muestra ambos planes, badge "Recomendado", coberturas con contexto para lectores de pantalla (`sr-only`), diferencia anual y motivo.
- `FranjaBeneficios.tsx`: pie de página con 3 beneficios y aviso de que los valores son ficticios.

#### 3. Plantilla de correo comercial (Actividad 2)

En `email.html` hay un correo HTML independiente diseñado para compatibilidad con Gmail y Outlook:

- Maquetación 100% basada en tablas (`role="presentation"`), estilos inline y ancho máximo de 600px (sin flex/grid).
- Condicionales `<!--[if mso]>` y botón CTA "Hablar con un asesor" con VML (`v:roundrect`) para Outlook + enlace estilizado para otros clientes.
- Preheader oculto, responsive móvil bajo 600px, espacio reservado para logo (180×44), variables de plantilla (`{{nombre_cliente}}`, `{{producto}}`, `{{prima_estimada}}`) y pie de página ficticio.

#### 4. Pruebas automatizadas

El proyecto cuenta con tres suites en Vitest:

- `src/lib/calculos.test.ts`: validaciones, límites, factores, redondeo, formato y caso de control ($85.000.000 + 3-5 años = $2.805.000).
- `src/lib/planes.test.ts`: cálculo de primas de planes, redondeo, diferencia anual y reglas de recomendación.
- `src/components/ComparadorPlanes.test.tsx`: verificación del HTML renderizado del comparador en ambos escenarios y textos accesibles.

#### 5. Estado actual y detalles importantes que encontré

Según el historial de Git y `.ia-log.md`:

- **Ya commiteado en `main`:** Fase 0 (setup), Actividad 1 (calculadora de prima base) y Actividad 2 (`email.html`).
- **En progreso (sin commit aún):** la lógica y UI del comparador de planes (`planes.ts`, `ComparadorPlanes.tsx`, sus tests y su integración en `App.tsx`) junto con las imágenes añadidas en `src/assets/`.
- **Pendiente según el log interno:** las actividades restantes de la prueba (menciona Actividades 1 a 5) y la redacción final de `uso_ia.md`.

**Dos detalles a corregir en `EncabezadoHero.tsx`:**

1. Las etiquetas `<img>` usan rutas `/assets/logo-axa.png`, `/assets/logo-axa-colpatria.png` y `/assets/vehiculo.jpg`, pero los archivos reales están dentro de `src/assets/` (no existe `public/assets/`) y la imagen del vehículo se llama `vehiculo.png` (no `.jpg`). Tal como está, esas 3 imágenes darán 404 salvo que se importen como módulos ES desde `src/assets/` o se muevan a `public/assets/` ajustando la extensión.
2. Entre las líneas 23 y 29 quedó todavía el `<div>` placeholder "Logo AXA Colpatria (200×48)" duplicado junto a la etiqueta `<img>` del logo.

Si quieres, podemos revisar/corregir esos detalles de las imágenes, correr los tests o continuar con la siguiente fase de la prueba técnica.

---

### Interacción 2: Comparador de planes: cálculo y componente

**Prompt:**

Perfecto, para darte un contexto en resumen, estoy desarrollando una prueba técnica en React, TypeScript, Tailwind CSS y Vitest, la cual es una calculadora de prima de seguro de autos con datos ficticios. Ya tengo construida la fase 1 que es formulario con validación de $20.000.000 a $300.000.000 COP, antigüedad del vehículo, casilla de vehículo de reemplazo y cálculo de prima base en un archivo con la ruta `src/lib/calculos.ts`.

Lo que necesito ahora es reemplazar el resultado temporal de prima base por el comparador "2. Compara nuestras coberturas" guiándonos por la imagen de referencia. Extiende `src/lib/calculos.ts` para calcular el precio anual del Plan Esencial (prima base × 1,00) y del Plan Plus (prima base x 1,35), redondeando cada prima al peso con `Math.round`, además crea el componente del comparador con las dos tarjetas mostrando título, descripción corta, prima anual estimada en COP y las coberturas con chulito verde y x que en este caso lo utilizaríamos en Esencial:

- Solo asistencia en carretera
- Plus: asistencia en carretera, vehículo de reemplazo y asistencia jurídica

**Qué generó la IA:**

Listo. Se extendió la lógica de cálculo en `src/lib/calculos.ts` y se reemplazó el resumen temporal de prima base por el comparador «2. Compara nuestras coberturas» siguiendo la imagen de referencia.

#### Cambios realizados

**1. Cálculo de planes y recomendación en `src/lib/calculos.ts`:**

- Se agregaron las constantes `MULTIPLICADOR_ESENCIAL` (`1.0`), `MULTIPLICADOR_PLUS` (`1.35`), `COBERTURAS_CATALOGO`, `PLANES` y `MOTIVOS_RECOMENDACION`.
- `calcularPrimasPlanes(primaBase)`: calcula el valor anual del Plan Esencial (`primaBase × 1,00`) y del Plan Plus (`primaBase × 1,35`), redondeando cada prima al peso con `Math.round`.
- `obtenerRecomendacionPlan(necesitaReemplazo, primas)`: calcula la diferencia anual (`Plus - Esencial` sobre los valores redondeados) y determina el plan recomendado y el mensaje explicativo.
- Se eliminaron los archivos duplicados previos (`src/lib/planes.ts` y `src/lib/planes.test.ts`) para centralizar la lógica en `calculos.ts`.

**2. Componente comparador en `src/components/ComparadorPlanes.tsx`:**

- Título «2. Compara nuestras coberturas» con estado inicial vacío antes de calcular y vista de dos tarjetas al cotizar.
- **Plan Esencial** («Protección básica para tu vehículo»): icono de escudo con chulo verde, prima anual estimada en COP y lista con chulo verde en Asistencia en carretera y `✕` gris en Vehículo de reemplazo y Asistencia jurídica.
- **Plan Plus** («Mayor cobertura y respaldo en todo momento»): icono de escudo con estrella, prima anual estimada en COP y chulo verde en las tres coberturas.
- Destacado visual + etiqueta flotante Recomendado en el plan sugerido y franja inferior con icono informativo, diferencia anual («Diferencia entre planes: $ 981.750 al año») y motivo de recomendación.
- Incluye texto `sr-only` («Incluye: » / «No incluye: ») para lectores de pantalla.

**3. Integración en `src/App.tsx`:**

- Se reemplazó completamente `ResumenPrimaBase` (archivo eliminado) por `ComparadorPlanes`, actualizando dinámicamente las tarjetas y la recomendación al calcular o ajustar las opciones.

**4. Pruebas actualizadas:**

- `src/lib/calculos.test.ts`: pruebas de constantes de planes, caso de control ($2.805.000 → $2.805.000 y $3.786.750, diferencia $981.750), redondeos con `Math.round`, errores y recomendaciones.
- `src/components/ComparadorPlanes.test.tsx`: pruebas del estado vacío, Plan Plus recomendado, Plan Esencial recomendado y accesibilidad de coberturas.

#### Verificación

- **Vitest:** `22/22` pruebas aprobadas (`calculos.test.ts` y `ComparadorPlanes.test.tsx`).
- **Build:** `tsc -b` y `vite build` compilados sin errores.

Si deseas, también puedo corregir las rutas de imágenes en `EncabezadoHero.tsx` o verificar visualmente el comparador en el navegador.

---

### Interacción 3: Lógica de recomendación y diferencia anual entre planes

**Prompt:**

Por ahora, necesito que agregues la lógica de recomendación y la diferencia anual entre planes en `src/lib/calculos.ts` y conéctala en la interfaz. Si el usuario marcó "Necesito vehículo de reemplazo en caso de siniestro", el sistema debe recomendar el Plan Plus, si no lo marcó, debe recomendar el Plan Esencial por menor precio. La etiqueta "Recomendado" y el borde/fondo resaltado deben aplicarse dinámicamente a la tarjeta recomendada, y debajo de las tarjetas agrega el recuadro "Diferencia entre planes: $ X al año" con un mensaje claro que explique el motivo de la recomendación.

**Qué generó la IA:**

Listo. La lógica de recomendación y la diferencia anual entre planes quedaron implementadas en `src/lib/calculos.ts` y conectadas dinámicamente en la interfaz.

#### Qué quedó implementado

**1. Lógica pura en `src/lib/calculos.ts`:**

- `calcularDiferenciaAnual(primas)`: calcula `primas.plus - primas.esencial` utilizando las primas ya redondeadas al peso.
- `obtenerRecomendacionPlan(necesitaReemplazo, primas)`:
  - Si el usuario marcó «Necesito vehículo de reemplazo en caso de siniestro» (`true`) → recomienda Plan Plus («Te recomendamos el Plan Plus porque indicaste que necesitas vehículo de reemplazo.»).
  - Si no lo marcó (`false`) → recomienda Plan Esencial («Te recomendamos el Plan Esencial por ser la opción de menor precio.»).
  - Devuelve `{ planRecomendado, diferenciaAnual, motivo }`.

**2. Conexión dinámica en `src/components/ComparadorPlanes.tsx` y `src/App.tsx`:**

- Al marcar o desmarcar la casilla de vehículo de reemplazo, el comparador actualiza en vivo qué tarjeta recibe la etiqueta flotante Recomendado y el borde/fondo resaltado (`border-[#3E56C4] bg-[#F4F7FF]`), dejando la otra tarjeta con estilo neutro (`border-slate-200 bg-white`).
- Debajo de las dos tarjetas se muestra el recuadro informativo con `Diferencia entre planes: $ X al año` y el mensaje que explica el motivo de la recomendación.

**3. Pruebas y verificación:**

- `src/lib/calculos.test.ts`: valida `calcularDiferenciaAnual` y `obtenerRecomendacionPlan` (caso de control $981.750 y casos con redondeo).
- `src/components/ComparadorPlanes.test.tsx`: comprueba que el badge Recomendado, las clases de borde/fondo resaltado, la diferencia anual y el mensaje cambian dinámicamente entre Plan Plus y Plan Esencial.
- **Resultados:** `23/23` pruebas de Vitest aprobadas y `tsc -b && vite build` sin errores.

---

### Interacción 4: Revisión completa del comparador y del flujo de la calculadora

**Prompt:**

Necesito que hagas una revisión del comparador y del flujo completo de la calculadora ya que necesito que verifiques casos en los límites de $20.000.000 y $300.000.000, redondeo al peso en primas y diferencia, qué pasa si el usuario cambia datos o la casilla de reemplazo después de calcular, y estados vacío o con error, accesibilidad que es el contraste, navegación por teclado, aria-live y que los lectores de pantalla distingan claramente qué coberturas están incluidas o no. Y por último, comportamiento responsive en escritorio y móvil de 360 px. Un detalle que olvidé mencionar previamente, y es que si encuentras algún error, explícame cuál es y corrígelo.

**Qué generó la IA:**

#### Errores encontrados y corregidos

**1. Imágenes rotas en el encabezado y hero (`EncabezadoHero.tsx`):**

- **Error:** Las etiquetas `<img>` apuntaban a `/assets/logo-axa.png`, `/assets/logo-axa-colpatria.png` y `/assets/vehiculo.jpg`, pero los archivos reales viven en `src/assets/` (no existe `public/assets/`) y la foto del auto es `vehiculo.png`. En navegador se mostraban íconos rotos con texto alternativo.
- **Corrección:** Se importaron los tres archivos como módulos ES desde `src/assets/` para que Vite los sirva y empaquete correctamente tanto en desarrollo como en `dist/`.

**2. Placeholder residual y recorte en móvil 360 px (`EncabezadoHero.tsx`):**

- **Error:** Permanecía el contenedor punteado "Logo AXA Colpatria (200×48)" al lado de los logos, duplicando el espacio de marca y provocando recorte vertical en 360 px.
- **Corrección:** Se eliminó el placeholder residual y se ajustaron tamaños responsivos de los logos (`h-9`/`h-8` en móvil, `h-11`/`h-10` en escritorio).

**3. Doble flecha en el selector de antigüedad (`src/index.css`, `FormularioVehiculo.tsx`):**

- **Error:** En Chromium seguía apareciendo el triángulo nativo ▼ junto al chevron SVG personalizado ⌄.
- **Corrección:** Se agregó la regla `.select-sin-flecha` con `appearance: none !important`, prefijos vendor y `.select-sin-flecha::picker-icon { display: none; }` (más respaldo inline en el `<select>`), dejando visible únicamente el chevron personalizado.

**4. Orden del DOM del badge «Recomendado» (`ComparadorPlanes.tsx`):**

- **Error:** `<span ...>Recomendado</span>` aparecía antes del `<h3>` en el DOM; un lector de pantalla que navega por encabezados saltaba directo a `<h3>Plan Plus</h3>` omitiendo el badge previo.
- **Corrección:** Se ubicó el badge inmediatamente después del `<h3>` en el DOM (manteniendo su posición visual en el borde superior derecho con `absolute -top-3 right-4`) y se dejó el `<span className="sr-only">Incluye: / No incluye: </span>` como hijo directo de cada `<li>`.

**5. Contraste de íconos y textos secundarios (`ComparadorPlanes.tsx`, `FormularioVehiculo.tsx`):**

- **Error:** El ícono ✕ de coberturas no incluidas (`text-slate-400`, `#94A3B8`) tenía un contraste de 2.56:1 sobre blanco (por debajo del mínimo WCAG 2.1 AA de 3:1 para gráficos informativos), y el placeholder del campo (`slate-400`) tenía bajo contraste (~2.4:1).
- **Corrección:** Se subió ✕ a `text-slate-500` (4.76:1 sobre blanco / 4.45:1 sobre `#F4F7FF`), los chulitos verdes a `text-emerald-700` (>5:1), el badge a `#3E56C4` (>6.5:1 con blanco) y el placeholder/ayudas a `slate-500`/`slate-600`.

**6. Desalineación vertical de precios en 1024 px (`ComparadorPlanes.tsx`):**

- **Error:** En 1024×768, la descripción de Plan Plus ocupaba una línea adicional frente a Plan Esencial, desplazando el precio 16.5 px hacia abajo.
- **Corrección:** Se aplicó `sm:min-h-[5.5rem] xl:min-h-[4.25rem]` al bloque superior de cada tarjeta y `whitespace-nowrap text-2xl xl:text-3xl` al precio; ambos precios quedaron alineados al mismo píxel vertical en 1024 px y 1280 px, sin saltos de línea ni siquiera en $ 17.010.000.

#### Resultados de la verificación completa

**Límites y redondeo al peso (`calculos.ts`, `calculos.test.ts`):**

- Mínimo $20.000.000 (0-2 años): Esencial $ 600.000, Plus $ 810.000, diferencia $ 210.000.
- Caso control $85.000.000 (3-5 años): Esencial $ 2.805.000, Plus $ 3.786.750, diferencia $ 981.750.
- Máximo $300.000.000 (Más de 10 años): Esencial $ 12.600.000, Plus $ 17.010.000, diferencia $ 4.410.000.
- Redondeo con `Math.round` verificado en primas y diferencia (Plus - Esencial sobre valores ya redondeados, sin descuadres de $1).

**Cambios tras calcular y estados vacío / error:**

- Vacío, no numérico (`abc`), menor a $20.000.000 (19.999.999) y mayor a $300.000.000 (300.000.001) muestran `role="alert"`, `aria-invalid="true"`, enfocan el input al enviar y mantienen el comparador en estado vacío sin precios desactualizados.
- Después de calcular, cambiar la casilla de vehículo de reemplazo mueve dinámicamente el badge Recomendado, el borde/fondo resaltado y el mensaje explicativo; cambiar antigüedad o corregir el valor actualiza los montos al instante; invalidar el valor oculta los precios hasta volver a un valor válido.

**Accesibilidad:**

- Jerarquía h1 → h2 → h3, navegación secuencial por Tab con indicadores de foco visibles, `aria-live="polite"` en el comparador, `aria-labelledby` en cada tarjeta y etiquetas `.sr-only` (Incluye: / No incluye:) en cada cobertura.

**Responsive (1280×900, 1024×768 y 360×800):**

- Cero desbordamiento horizontal en todos los anchos, tarjetas apiladas limpiamente en 360 px, logos sin recortes y precios máximos ($ 12.600.000 / $ 17.010.000) en una sola línea.

**Pruebas y build:**

- 25/25 pruebas aprobadas en Vitest (`calculos.test.ts` y `ComparadorPlanes.test.tsx`).
- `tsc -b` y `vite build` sin errores, empaquetando las 3 imágenes reales en `dist/assets/`.

---

### Interacción 5: Pruebas unitarias de la lógica del comparador

**Prompt:**

Ayúdame a crear las pruebas unitarias en `src/lib/calculos.test.ts` para verificar que toda la lógica del comparador funcione correctamente, para eso quiero que se tenga en cuenta los siguientes casos:

- Un caso de prueba con un valor de $85.000.000 y una antigüedad de "3 a 5 años", donde los resultados esperados sean: base $2.805.000, Esencial $2.805.000, Plus $3.786.750 y una diferencia de $981.750.
- La recomendación del comparador cuando se tiene y cuando no se tiene vehículo de reemplazo.
- El redondeo de los valores cuando se generan decimales.
- El comportamiento cuando se alcanzan los valores mínimos y máximos permitidos.

Cuando termines, ejecuta `npm test` y `npm run build` para comprobar que todo funcione correctamente. Finalmente, muéstrame los resultados de ambas ejecuciones.

**Qué generó la IA:**

Se completaron las pruebas unitarias en `src/lib/calculos.test.ts`, agregando la suite de flujo completo del comparador que cubre de extremo a extremo todos los casos solicitados:

- **Caso de control ($85.000.000 y "3 a 5 años"):** verifica prima base $2.805.000, Plan Esencial $2.805.000, Plan Plus $3.786.750 y diferencia anual $981.750.
- **Recomendación del comparador:** valida recomendación de Plan Plus cuando se solicita vehículo de reemplazo y Plan Esencial cuando no se solicita, junto con sus motivos exactos.
- **Redondeo con decimales (`Math.round`):** valida redondeo hacia abajo, hacia arriba y en `.5` tanto en `calcularPrimaBase` como en `calcularPrimasPlanes` (× 1,35) y consistencia de `calcularDiferenciaAnual` sobre primas ya redondeadas.
- **Límites mínimo y máximo:** valida $20.000.000 (base $600.000, Esencial $600.000, Plus $810.000, diferencia $210.000), $300.000.000 (base $12.600.000, Esencial $12.600.000, Plus $17.010.000, diferencia $4.410.000) y rechazo inmediato fuera de rango ($19.999.999 y $300.000.001).

---

## 3. Qué revisé y corregí

Después de que la IA generó el comparador (interacciones 2 y 3), pedí una revisión completa (interacción 4) con la instrucción explícita de que, si encontraba errores, me explicara cuáles eran y los corrigiera. El resultado:

| # | Error encontrado | Corrección aplicada |
|---|------------------|---------------------|
| 1 | Imágenes rotas: las rutas `/assets/...` no existían y la foto del auto era `vehiculo.png`, no `.jpg` | Se importaron los 3 archivos como módulos ES desde `src/assets/` |
| 2 | Placeholder "Logo AXA Colpatria (200×48)" residual y recorte en móvil de 360 px | Se eliminó el placeholder y se ajustaron los tamaños responsivos de los logos |
| 3 | Doble flecha en el selector de antigüedad (nativa + chevron personalizado) | Regla `.select-sin-flecha` con `appearance: none` y respaldo inline |
| 4 | Badge «Recomendado» antes del `<h3>` en el DOM; los lectores de pantalla lo omitían | Se movió el badge después del `<h3>`, manteniendo su posición visual |
| 5 | Contraste insuficiente: ✕ en 2.56:1 y placeholder en ~2.4:1 (mínimo WCAG AA) | Colores a `slate-500`/`slate-600`, `emerald-700` y badge `#3E56C4` |
| 6 | Precios desalineados 16.5 px en 1024 px de ancho | Altura mínima del bloque superior de cada tarjeta y `whitespace-nowrap` en el precio |

Otras decisiones de revisión:

- En la interacción 1, la IA detectó por sí misma los problemas de imágenes y del placeholder duplicado en `EncabezadoHero.tsx`; quedaron corregidos en la interacción 4.
- En la interacción 2, la lógica de planes se centralizó en `src/lib/calculos.ts` y se eliminaron los archivos duplicados `planes.ts` y `planes.test.ts`.

---

## 4. Cómo comprobé el resultado

**Pruebas automatizadas (Vitest):**

- 22/22 pruebas aprobadas tras crear el comparador (interacción 2).
- 23/23 tras agregar la recomendación y la diferencia anual (interacción 3).
- 25/25 tras la revisión completa (interacción 4).
- 28/28 tras ampliar `src/lib/calculos.test.ts` con la suite de flujo completo del comparador (interacción 5).
- 33/33 en la entrega final al sumar las 5 pruebas de medición en `src/lib/analytics.test.ts` (Actividad 4).

**Build:** `tsc -b` y `vite build` sin errores, con las 3 imágenes empaquetadas en `dist/assets/`.

**Casos numéricos de control:**

| Caso | Prima base | Esencial | Plus | Diferencia |
|------|-----------:|---------:|-----:|-----------:|
| $20.000.000 (0-2 años), mínimo | $ 600.000 | $ 600.000 | $ 810.000 | $ 210.000 |
| $85.000.000 (3-5 años), caso de control | $ 2.805.000 | $ 2.805.000 | $ 3.786.750 | $ 981.750 |
| $300.000.000 (más de 10 años), máximo | $ 12.600.000 | $ 12.600.000 | $ 17.010.000 | $ 4.410.000 |

**Otras verificaciones:**

- **Redondeo:** `Math.round` en primas y en la diferencia (sobre valores ya redondeados), sin descuadres de $1.
- **Estados de error:** vacío, texto no numérico (`abc`), $19.999.999 y $300.000.001 muestran `role="alert"` y `aria-invalid`, enfocan el campo y dejan el comparador vacío.
- **Cambios tras calcular:** al cambiar la casilla de vehículo de reemplazo, la antigüedad o el valor, el badge, el resaltado, los montos y el mensaje se actualizan al instante.
- **Accesibilidad:** jerarquía h1 → h2 → h3, navegación con Tab, foco visible, `aria-live="polite"`, `aria-labelledby` en las tarjetas y textos `sr-only` (Incluye: / No incluye:) en cada cobertura.
- **Responsive:** 1280×900, 1024×768 y 360×800, sin desbordamiento horizontal y con precios máximos en una sola línea.

---

## 5. Uso de IA en las demás actividades

El foco principal del trabajo con IA fue la Actividad 3, documentada arriba. En el resto del proyecto (configuración inicial, calculadora base, `email.html`, integración de `window.dataLayer` y documentación) utilicé Antigravity de forma puntual como apoyo técnico y para la revisión final de funcionalidad, validaciones, accesibilidad y compilación, manteniendo siempre el control sobre las decisiones, pruebas y ajustes de cada entregable.

