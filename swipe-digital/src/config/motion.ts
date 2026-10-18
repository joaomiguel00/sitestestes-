// Painel de controle das animações. Mude para false para desligar uma animação,
// ou ajuste os números para deixar mais rápido ou mais devagar.
// Quem usa "reduzir movimento" no aparelho já recebe só aparições simples com fade.

export const motionConfig = {
  // Abertura "swipe" (só na primeira visita)
  abertura: true,
  aberturaDuracaoMs: 1400,

  // Rolagem suave (Lenis)
  rolagemSuave: true,
  rolagemSuaveIntensidade: 1.1, // maior = mais "deslizante"

  // Topo
  celularParallax: true, // celular inclina seguindo o mouse
  tracosNeon: true, // traços em seta que descem desenhando
  contadores: true, // números dos cards contam do zero

  // Carrossel do card "01/06"
  carrosselIntervaloMs: 4000,
  listaServicosIntervaloMs: 2200,

  // Letreiro
  letreiro: true,
  letreiroVelocidade: 40, // pixels por segundo
  letreiroReageARolagem: true,

  // Rolagem
  manifestoAcendendo: true,
  servicosEmpilhando: true,
  linhaDasEtapas: true,
  entradaDosCards: true,

  // Interações (só no computador)
  cursorVer: true,
  botoesMagneticos: true,
  cardsInclinacao: true,
  cardsSpotlight: true,
  transicaoCapa: true, // capa do cartão "cresce" até a página do projeto
} as const;

export const ease = [0.22, 1, 0.36, 1] as const;
