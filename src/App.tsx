import { useState } from 'react';
import { ComparadorPlanes } from './components/ComparadorPlanes';
import { EncabezadoHero } from './components/EncabezadoHero';
import { FormularioVehiculo } from './components/FormularioVehiculo';
import { FranjaBeneficios } from './components/FranjaBeneficios';
import {
  calcularPrimaBase,
  validarValorComercial,
  type AntiguedadId,
} from './lib/calculos';

export default function App() {
  const [valorInput, setValorInput] = useState<string>('');
  const [antiguedad, setAntiguedad] = useState<AntiguedadId>('3-5');
  const [necesitaReemplazo, setNecesitaReemplazo] = useState<boolean>(false);
  const [errorValor, setErrorValor] = useState<string | null>(null);
  const [haCalculado, setHaCalculado] = useState<boolean>(false);

  const validacionActual = validarValorComercial(valorInput);
  const primaBaseCalculada =
    haCalculado && validacionActual.valido
      ? calcularPrimaBase(validacionActual.valor, antiguedad)
      : null;

  const handleValorChange = (nuevoValorFormateado: string) => {
    setValorInput(nuevoValorFormateado);
    if (errorValor !== null || haCalculado) {
      const validacion = validarValorComercial(nuevoValorFormateado);
      setErrorValor(validacion.valido ? null : validacion.mensaje);
    }
  };

  const handleSubmit = (): boolean => {
    const validacion = validarValorComercial(valorInput);

    if (!validacion.valido) {
      setErrorValor(validacion.mensaje);
      setHaCalculado(false);
      return false;
    }

    setErrorValor(null);
    setHaCalculado(true);
    return true;
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#EEF4FC] text-slate-900">
      <EncabezadoHero />

      <main className="relative z-10 mx-auto -mt-4 w-full max-w-6xl flex-1 px-4 sm:px-6 lg:-mt-6 lg:px-8">
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <FormularioVehiculo
              valorInput={valorInput}
              antiguedad={antiguedad}
              necesitaReemplazo={necesitaReemplazo}
              errorValor={errorValor}
              onValorChange={handleValorChange}
              onAntiguedadChange={setAntiguedad}
              onNecesitaReemplazoChange={setNecesitaReemplazo}
              onSubmit={handleSubmit}
            />
          </div>

          <div className="lg:col-span-7">
            <ComparadorPlanes
              primaBase={primaBaseCalculada}
              necesitaReemplazo={necesitaReemplazo}
            />
          </div>
        </div>
      </main>

      <FranjaBeneficios />
    </div>
  );
}
