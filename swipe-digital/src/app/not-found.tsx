import { Botao } from "@/components/Botao";

export default function NaoEncontrado() {
  return (
    <section className="relative z-10 flex min-h-[80svh] flex-col items-center justify-center px-4 pt-28 text-center">
      <p className="pilula">Erro 404</p>
      <h1 className="titulo mt-6 text-5xl sm:text-7xl">Essa página deu swipe.</h1>
      <p className="mt-4 text-cinza">Ela não existe ou mudou de lugar.</p>
      <div className="mt-8">
        <Botao href="/">Voltar ao início</Botao>
      </div>
    </section>
  );
}
