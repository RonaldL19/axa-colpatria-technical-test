import logoAxaColpatria from '../assets/logo-axa-colpatria.png';
import logoAxa from '../assets/logo-axa.png';
import vehiculoImg from '../assets/vehiculo.png';

export function EncabezadoHero() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-b from-white via-[#F5F8FE] to-[#EEF4FC]">
      {/* Fondo diagonal suave en la parte derecha en escritorio, inspirado en el diseño de referencia */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[52%] bg-gradient-to-br from-[#DCE8FB]/70 via-[#E6EFFC]/60 to-[#C8DCF8]/40 lg:block"
        style={{ clipPath: 'polygon(14% 0, 100% 0, 100% 100%, 0% 100%)' }}
      />

      {/* Barra superior con logos de marca */}
      <div className="relative z-10 border-b border-slate-200/70 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
          <img
            src={logoAxa}
            alt="AXA"
            className="h-9 w-9 shrink-0 object-contain sm:h-11 sm:w-11"
          />

          <div aria-hidden="true" className="h-7 w-px shrink-0 bg-slate-300" />

          <img
            src={logoAxaColpatria}
            alt="AXA Colpatria"
            className="h-8 w-auto max-w-[200px] object-contain sm:h-10"
          />
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
          <img
            src={vehiculoImg}
            alt="Vehículo SUV en carretera"
            className="aspect-[16/9] w-full rounded-2xl object-cover shadow-md"
          />
        </div>
      </div>
    </header>
  );
}
