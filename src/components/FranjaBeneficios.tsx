export function FranjaBeneficios() {
  return (
    <footer className="mt-10 border-t border-slate-200/80 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-slate-200">
          <li className="flex items-center gap-4 sm:justify-center sm:px-6">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EEF3FC] text-[#0F2D9C]">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M5 17H3a1 1 0 0 1-1-1v-4l2.2-4.4A2 2 0 0 1 6 6.5h12a2 2 0 0 1 1.8 1.1L22 12v4a1 1 0 0 1-1 1h-2" />
                <circle cx="7.5" cy="17.5" r="2" />
                <circle cx="16.5" cy="17.5" r="2" />
                <path d="M9.5 17.5h5" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-bold text-[#0B1A59]">
                Asistencia en carretera
              </p>
              <p className="text-sm text-slate-600">24/7 en todo el país</p>
            </div>
          </li>

          <li className="flex items-center gap-4 sm:justify-center sm:px-6">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EEF3FC] text-[#0F2D9C]">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-bold text-[#0B1A59]">
                Respaldo de una
              </p>
              <p className="text-sm text-slate-600">
                compañía líder en seguros
              </p>
            </div>
          </li>

          <li className="flex items-center gap-4 sm:justify-center sm:px-6">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EEF3FC] text-[#0F2D9C]">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-bold text-[#0B1A59]">
                Acompañamiento
              </p>
              <p className="text-sm text-slate-600">personalizado</p>
            </div>
          </li>
        </ul>

        <p className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-500">
          Valores ficticios con fines de prueba. No representan productos ni
          tarifas reales de AXA Colpatria.
        </p>
      </div>
    </footer>
  );
}
