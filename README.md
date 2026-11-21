# Calculadora de Prima de Seguro de Autos

> Documento en construcción (Fase 4: integración en Liferay y validación de medición; se completará con toda la documentación de entrega en la Fase 5).

## Integración en Liferay y validación de analítica (GTM / GA4)

### Integración en Liferay DXP
- **Enfoque recomendado (Client Extension / Custom Element):** Empaquetar la aplicación React como **Web Component** (Custom Element, por ejemplo `<axa-calculadora-autos>`) mediante un build de producción en Vite (`dist/assets/*.js` y `*.css`) y registrarla en Liferay como una **Frontend Client Extension (`customElement`)** para evitar acoplamiento con el core del portal y facilitar despliegues independientes.
- **Alternativa ligera (Fragmento):** Si se requiere inserción rápida en una página de contenido, se puede montar el bundle compilado dentro de un **Fragmento de Liferay** con un contenedor `<div id="calculadora-autos-root"></div>`, cargando los assets versionados desde un CDN o recursos estáticos del sitio, aislando los estilos (prefijo o Shadow DOM) para no colisionar con el tema del portal.

### Validación del evento en GTM Preview y GA4 DebugView
1. **Capa de datos (`window.dataLayer`):** Tras cada cálculo válido (sin errores de validación), la calculadora envía exactamente:
   ```js
   {
     event: 'cotizacion_calculada',
     producto: 'seguro_autos',
     plan_seleccionado: 'plus' | 'esencial',
     prima_estimada: 3786750
   }
   ```
   No se envían datos personales (PII) ni el valor comercial del vehículo.
2. **Configuración y prueba en Google Tag Manager (GTM Preview / Tag Assistant):**
   - Crear tres **Variables de capa de datos** (Data Layer Variables): `producto`, `plan_seleccionado` y `prima_estimada`.
   - Crear un **Activador (Trigger) de Evento personalizado** con nombre exacto `cotizacion_calculada`.
   - Asociar una etiqueta **Google Analytics: evento de GA4** con nombre `cotizacion_calculada` y parámetros mapeados a las tres variables.
   - Abrir **Vista previa (Preview)** en GTM sobre la URL de la calculadora, realizar un cálculo válido y verificar en el panel de Tag Assistant que aparece el evento `cotizacion_calculada` con los valores esperados en la pestaña *Data Layer* y que la etiqueta GA4 se dispara una sola vez (y **no** se dispara cuando hay errores de validación).
3. **Validación en GA4 DebugView:**
   - Con GTM Preview activo (o la extensión *Google Analytics Debugger*), abrir **Administrar → DebugView** en GA4.
   - Confirmar la llegada del evento `cotizacion_calculada` en la línea de tiempo y revisar en sus parámetros que `producto`, `plan_seleccionado` y `prima_estimada` lleguen con el tipo y valor esperados.
