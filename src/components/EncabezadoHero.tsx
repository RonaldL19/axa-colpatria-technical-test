export function EncabezadoHero() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-b from-white via-[#F5F8FE] to-[#EEF4FC]">
      {/* Fondo diagonal suave en la parte derecha en escritorio, inspirado en el diseño de referencia */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[52%] bg-gradient-to-br from-[#DCE8FB]/70 via-[#E6EFFC]/60 to-[#C8DCF8]/40 lg:block"
        style={{ clipPath: 'polygon(14% 0, 100% 0, 100% 100%, 0% 100%)' }}
      />

      {/* Barra superior con espacios reservados para logos */}
      <div className="relative z-10 border-b border-slate-200/70 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          {/*
            PLACEHOLDER LOGO AXA
            Reemplazar este bloque por:
            <img src="/images/logo-axa.svg" alt="AXA" className="h-11 w-11 object-contain" />
            Ruta sugerida: public/images/logo-axa.svg (o src/assets/logo-axa.png)
            Tamaño recomendado: 48 × 48 px (relación 1:1)
          */}
          <div
            role="img"
            aria-label="Espacio reservado para logo AXA"
            className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded border-2 border-dashed border-[#00008F]/40 bg-[#00008F]/10 text-[10px] font-bold leading-tight text-[#00008F]"
          >
            <span>LOGO</span>
            <span>AXA</span>
          </div>

          <div aria-hidden="true" className="h-7 w-px bg-slate-300" />

          {/*
            PLACEHOLDER LOGO AXA COLPATRIA
            Reemplazar este bloque por:
            <img src="/images/logo-axa-colpatria.svg" alt="AXA Colpatria" className="h-10 w-auto object-contain" />
            Ruta sugerida: public/images/logo-axa-colpatria.svg (o src/assets/logo-axa-colpatria.png)
            Tamaño recomendado: 200 × 48 px (horizontal)
          */}
          <div
            role="img"
            aria-label="Espacio reservado para logo AXA Colpatria"
            className="flex h-11 min-w-[155px] items-center justify-center rounded border-2 border-dashed border-[#0B1A59]/30 bg-slate-50 px-3 text-xs font-semibold text-[#0B1A59] sm:min-w-[190px]"
          >
            Logo AXA Colpatria (200×48)
          </div>
        </div>
      </div>

      {/* Hero principal */}
      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 pt-8 pb-10 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:pt-10 lg:pb-14">
        <div className="lg:col-span-6">
          <span className="inline-block rounded-lg bg-[#E3ECFA] px-3.5 py-1.5 text-xs font-semibold tracking-wide text-[#17307A] sm:text-sm">
            Seguro de Autos
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0B1A59] sm:text-5xl sm:leading-[1.08]">
            Calcula tu prima estimada
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-[#1F2D4A] sm:text-lg">
            Conoce en minutos el valor de tu seguro y compara el plan que mejor
            se adapta a ti.
          </p>
        </div>

        <div className="lg:col-span-6">
          {/*
            PLACEHOLDER FOTO DEL VEHÍCULO (SUV)
            Reemplazar este bloque por:
            <img
              src="/images/vehiculo-hero.jpg"
              alt="Vehículo SUV en carretera"
              className="aspect-[16/9] w-full rounded-2xl object-cover shadow-md"
            />
            Ruta sugerida: public/images/vehiculo-hero.jpg (o src/assets/vehiculo-hero.jpg)
            Tamaño recomendado: 960 × 540 px o 1200 × 675 px (formato 16:9)
          */}
          <div
            role="img"
            aria-label="Espacio reservado para foto del vehículo SUV"
            className="flex aspect-[16/9] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#17307A]/30 bg-white/75 p-6 text-center shadow-sm backdrop-blur-xs"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-12 w-12 text-[#17307A]/60"
            >
              <path d="M5 17H3a1 1 0 0 1-1-1v-4l2.4-4.8A2 2 0 0 1 6.2 6h11.6a2 2 0 0 1 1.8 1.2L22 12v4a1 1 0 0 1-1 1h-2" />
              <circle cx="7.5" cy="17.5" r="2.5" />
              <circle cx="16.5" cy="17.5" r="2.5" />
              <path d="M10 17h4" />
            </svg>
            <p className="mt-3 text-sm font-semibold text-[#0B1A59]">
              Espacio reservado: foto del vehículo (SUV)
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Ruta sugerida: <code>public/images/vehiculo-hero.jpg</code> · 960 ×
              540 px (16:9)
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
