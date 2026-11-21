import logoAxaColpatria from '../assets/logo-axa-colpatria.png';
import logoAxa from '../assets/logo-axa.png';
import vehiculoImg from '../assets/vehiculo.png';

export function EncabezadoHero() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-b from-white via-[#F5F8FE] to-[#EEF4FC]">
      {/* Panel diagonal del vehículo en escritorio: cruza desde el tope del header hasta detrás de la tarjeta 2 con degradado inferior */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[59%] overflow-hidden lg:block xl:w-[57%]"
        style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }}
      >
        {/* Fondo base cielo/montaña para suavizar bordes */}
        <div className="absolute inset-0 bg-[#DCE7F6]" />

        {/* Imagen del vehículo encuadrada dentro del corte diagonal sin recortar el frente */}
        <img
          src={vehiculoImg}
          alt=""
          className="absolute inset-y-0 right-0 h-full w-[94%] max-w-none object-cover object-[center_45%]"
        />

        {/* Fusión muy sutil en el borde izquierdo de la foto */}
        <div
          className="absolute inset-y-0 left-0 w-[14%]"
          style={{
            background:
              'linear-gradient(90deg, #DCE7F6 0%, #DCE7F6 35%, rgba(220,231,246,0) 100%)',
          }}
        />

        {/* Tinte superior suave en la franja del header para que se vea el corte diagonal cruzando el encabezado */}
        <div
          className="absolute inset-x-0 top-0 h-20"
          style={{
            background:
              'linear-gradient(180deg, rgba(210,228,252,0.58) 0%, rgba(210,228,252,0.18) 65%, rgba(210,228,252,0) 100%)',
          }}
        />

        {/* Degradado inferior que funde la foto detrás de "2. Compara nuestras coberturas" hacia el fondo #EEF4FC */}
        <div
          className="absolute inset-x-0 bottom-0 h-[46%]"
          style={{
            background:
              'linear-gradient(180deg, rgba(238,244,252,0) 0%, rgba(238,244,252,0.42) 45%, rgba(238,244,252,0.92) 82%, #EEF4FC 100%)',
          }}
        />
      </div>

      {/* Barra superior con logos de marca (transparente a la derecha en escritorio para que el corte diagonal cruce el header) */}
      <div className="relative z-10 border-b border-slate-200/60 bg-white/90 lg:border-b-slate-200/40 lg:bg-transparent lg:bg-gradient-to-r lg:from-white/95 lg:via-white/75 lg:via-45% lg:to-transparent">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
          <img
            src={logoAxa}
            alt="AXA"
            className="h-9 w-9 shrink-0 object-contain sm:h-11 sm:w-11"
          />

          <img
            src={logoAxaColpatria}
            alt=""
            aria-hidden="true"
            className="h-8 w-auto max-w-[200px] object-contain sm:h-10"
          />

          <div
            aria-hidden="true"
            className="h-5 w-px shrink-0 bg-[#9BA5C9] sm:h-6"
          />

          <span className="text-[13px] font-bold italic tracking-[0.03em] text-[#00008F] sm:text-[14px]">
            AXA COLPATRIA
          </span>
        </div>
      </div>

      {/* Hero principal */}
      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 pt-8 pb-10 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:pt-12 lg:pb-48">
        <div className="lg:col-span-5">
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

        {/* En móvil y tablet se conserva la tarjeta limpia de la imagen del vehículo */}
        <div className="lg:hidden">
          <img
            src={vehiculoImg}
            alt="Vehículo SUV en carretera"
            className="aspect-[16/9] w-full rounded-2xl object-cover object-[center_42%] shadow-md"
          />
        </div>
      </div>
    </header>
  );
}
