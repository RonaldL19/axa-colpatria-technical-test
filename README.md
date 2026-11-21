# Calculadora de Prima de Seguro de Autos

Aplicación web frontend para estimar la prima anual de un seguro de autos, comparar planes (**Plan Esencial** y **Plan Plus**) con recomendación personalizada, registrar analítica en `window.dataLayer` e incluir una plantilla de correo comercial independiente (`email.html`).

> **Aviso importante:** Todos los valores, fórmulas, coberturas y datos de contacto son **ficticios con fines de prueba técnica** y no representan productos ni tarifas reales de AXA Colpatria.

---

## Requisitos

- **Node.js:** `22.x` (desarrollado y probado con Node.js `22.19.0`)
- **npm:** `10.x` o superior
- **Git:** opcional para clonar o generar el paquete con `git archive`

---

## Instalación, ejecución y pruebas

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo (por defecto en http://localhost:5173/)
npm run dev

# 3. Ejecutar pruebas automatizadas (Vitest)
npm test

# 4. Compilar verificación de TypeScript y build de producción
npm run build
```

Para previsualizar el correo comercial (`email.html`), ábrelo directamente en el navegador o visita `http://localhost:5173/email.html` con `npm run dev` activo y pruébalo en vista escritorio y móvil (`360 px`).

---

## Tecnologías y estructura del proyecto

- **Vite + React + TypeScript** (strict mode)
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Vitest** (pruebas unitarias puras y de renderizado estático de componente)

```text
├── email.html                             # Plantilla de correo comercial (tablas, CSS inline, VML Outlook)
├── uso_ia.md                              # Registro transparente de uso de IA (Actividad 3 y demás fases)
├── README.md                              # Documentación del proyecto
└── src/
    ├── App.tsx                            # Orquestación de formulario, comparador y envío a dataLayer
    ├── index.css                          # Tailwind CSS y ajuste de selector nativo (.select-sin-flecha)
    ├── assets/                            # Logos e imagen del vehículo empaquetados por Vite
    ├── components/
    │   ├── EncabezadoHero.tsx             # Cabecera con logos y hero del vehículo
    │   ├── FormularioVehiculo.tsx         # Formulario accesible con validación y formato de miles
    │   ├── ComparadorPlanes.tsx           # Tarjetas Esencial/Plus, recomendación y diferencia anual
    │   ├── ComparadorPlanes.test.tsx      # Pruebas de renderizado y accesibilidad del comparador
    │   └── FranjaBeneficios.tsx           # Beneficios y aviso de datos ficticios
    └── lib/
        ├── calculos.ts                    # Lógica pura de validación, prima base, planes y recomendación
        ├── calculos.test.ts               # Pruebas unitarias de cálculo, límites y redondeo
        ├── analytics.ts                   # Tipado y envío seguro a window.dataLayer
        └── analytics.test.ts              # Pruebas unitarias del evento cotizacion_calculada
```

---

## Decisiones técnicas y supuestos

- **Redondeo y aritmética:** Para evitar imprecisiones de coma flotante en JavaScript (por ejemplo, `85.000.000 × 0,03 × 1,10 = 2.805.000,0000000005`), se aplica `Math.round` al resultado de `calcularPrimaBase` y sobre cada prima de plan en `calcularPrimasPlanes` (`Math.round(primaBase × multiplicador)`).
- **Diferencia anual coherente:** `calcularDiferenciaAnual` calcula `primas.plus - primas.esencial` a partir de las primas ya redondeadas al peso, asegurando que en pantalla siempre se cumpla `Esencial + Diferencia = Plus`.
- **Formato de entrada y error no numérico:** Al escribir dígitos, el campo formatea miles (`es-CO`) en tiempo real; si el usuario ingresa o pega caracteres no numéricos (letras, signos negativos o decimales), se conserva el texto para disparar el mensaje de error claro asociado mediante `aria-invalid` y `aria-describedby`.
- **Formato de moneda:** Todos los montos se muestran con `Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })`.
- **Regla de recomendación:** Si está marcada la casilla *"Necesito vehículo de reemplazo en caso de siniestro"*, se recomienda **Plan Plus**; de lo contrario, se recomienda **Plan Esencial** por menor precio.
- **Disparo de analítica (`producto = 'seguro_autos'`):** El evento `cotizacion_calculada` se envía a `window.dataLayer` **únicamente** cuando el usuario confirma un cálculo válido con el botón *"Calcular y comparar planes"*, evitando disparos duplicados al teclear o con errores de validación, y excluyendo cualquier dato personal o el valor comercial del vehículo.
- **Correo comercial independiente:** `email.html` usa tablas (`role="presentation"`), estilos inline, botón VML (`v:roundrect`) para Outlook, preheader oculto, pie de página ficticio, las variables `{{nombre_cliente}}`, `{{producto}}` y `{{prima_estimada}}`, y los logos locales en cabecera (`src/assets/logo-axa.png` y `src/assets/logo-axa-colpatria.png`) con atributos `width`, `height` y `alt` explícitos listos para apuntar a URLs HTTPS públicas en un envío real.

---

## Limitaciones

- Todos los cálculos se ejecutan en el cliente con parámetros ficticios; no hay integración con backend, motores actuariales ni persistencia.
- `email.html` es una plantilla independiente sin conexión a Salesforce Marketing Cloud ni a un servidor SMTP; la verificación realizada fue estructural y en navegador (escritorio/móvil), sin captura directa en Outlook de escritorio.
- Los activos gráficos de la calculadora se cargan localmente desde `src/assets/`; en un entorno productivo deberían servirse optimizados (WebP/AVIF y CDN).

---

## Integración en CMS (Liferay) y validación de analítica (GTM / GA4)

### Integración en Liferay DXP
- **Enfoque recomendado (Client Extension / Custom Element):** Empaquetar la aplicación React como **Web Component** (por ejemplo `<axa-calculadora-autos>`) a partir del build de Vite (`dist/assets/*.js` y `*.css`) y registrarla en Liferay como una **Frontend Client Extension (`customElement`)**, logrando despliegues desacoplados del core del portal y aislamiento de estilos.
- **Alternativa ligera (Fragmento):** Montar el bundle compilado dentro de un **Fragmento de Liferay** con un contenedor `<div id="calculadora-autos-root"></div>`, sirviendo los assets versionados desde CDN o recursos estáticos del sitio con aislamiento CSS para no interferir con el tema del portal.

### Validación del evento en GTM Preview y GA4 DebugView
1. **Payload enviado a `window.dataLayer` tras un cálculo válido:**
   ```js
   {
     event: 'cotizacion_calculada',
     producto: 'seguro_autos',
     plan_seleccionado: 'plus' | 'esencial',
     prima_estimada: 3786750
   }
   ```
2. **GTM Preview (Tag Assistant):**
   - Crear tres **Variables de capa de datos**: `producto`, `plan_seleccionado` y `prima_estimada`.
   - Crear un **Activador de Evento personalizado** para `cotizacion_calculada` y vincularlo a una etiqueta **Google Analytics: evento de GA4**.
   - Iniciar **Vista previa** sobre la URL de la calculadora, ejecutar un cálculo válido y validar en Tag Assistant que el evento aparezca una sola vez en la pestaña *Data Layer* con los valores esperados (y que no se dispare ante errores de validación).
3. **GA4 DebugView:**
   - Con GTM Preview activo (o *Google Analytics Debugger*), abrir **Administrar → DebugView** en GA4 y comprobar que el evento `cotizacion_calculada` llegue con `producto`, `plan_seleccionado` y `prima_estimada` correctamente tipados.

---

## Propuesta de CI/CD y monitoreo

### CI/CD (ej. GitHub Actions)
- **Pipeline en cada Pull Request y push a `main`:**
  1. `actions/setup-node` fijado a Node `22.x` con caché de npm.
  2. `npm ci` para instalación determinista desde `package-lock.json`.
  3. `npm test` para validar lógica pura, comparador y contrato del `dataLayer`.
  4. `npm run build` para verificar tipado estricto (`tsc -b`) y empaquetado de Vite.
- **Despliegue:** Al aprobar en `main`, publicar el artefacto `dist/` versionado en CDN / almacenamiento estático o empaquetar el `.zip` de la Client Extension para ambientes `QA` y `Producción` con aprobación manual.

### Monitoreo en producción
- **Errores de frontend:** Integrar observabilidad de cliente (ej. Sentry o Dynatrace RUM) con source maps privados para capturar excepciones de JavaScript, fallos de carga de assets y métricas Web Vitals (LCP/INP/CLS).
- **Salud de medición:** Configurar alertas en GA4/Looker ante caídas anómalas del evento `cotizacion_calculada` o parámetros faltantes, junto con una prueba sintética periódica (Playwright/Cypress) que valide el caso de control y el contrato del `window.dataLayer` tras cada despliegue.

---

## Declaración de uso de IA

Se utilizó **Google Antigravity** de forma transparente y controlada:
- **Actividad 3 (obligatoria):** El comparador de planes, la lógica de recomendación, la auditoría de accesibilidad/responsive y las pruebas del comparador se construyeron con una secuencia de prompts documentada en detalle en [`uso_ia.md`](./uso_ia.md), incluyendo los prompts reales y las 6 correcciones aplicadas.
- **Demás actividades:** Se utilizó de forma puntual como apoyo técnico y en la revisión final de funcionalidad, validaciones, accesibilidad, `email.html`, medición (`window.dataLayer`) y documentación, verificando manualmente el resultado junto con las pruebas automatizadas y el build.

---

## Pendientes

- **Correo `email.html` en clientes reales:** Reemplazar las rutas locales (`src/assets/...`) de los logos en cabecera por URLs públicas HTTPS alojadas en CDN y ejecutar pruebas visuales en clientes reales de Outlook (motor Word) y Gmail mediante **Litmus** o **Email on Acid**.
- **Conexión productiva de analítica:** Vincular el contenedor real de Google Tag Manager en `index.html` (o en el portal contenedor) y configurar el trigger/etiqueta GA4 en el ambiente correspondiente.
- **Empaquetado final para Liferay:** Si se despliega en Liferay DXP, añadir el wrapper de Custom Element (`customElements.define`) y el descriptor `client-extension.yaml`.
- **Optimización de imagen hero:** Convertir `src/assets/vehiculo.png` (~622 KB) a formato WebP/AVIF y dimensiones exactas de despliegue para reducir el peso inicial de carga.
