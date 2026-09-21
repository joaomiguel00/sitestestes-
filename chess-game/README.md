# Xadrez Sombrio

Xadrez 3D no navegador com visual dark fantasy low poly, para dois jogadores no
mesmo dispositivo (hot-seat). Feito com **Three.js + Vite**, sem framework de UI.

## Como rodar

```bash
cd chess-game
npm install
npm run dev      # abre em http://localhost:5173
```

Outros comandos:

```bash
npm run build    # gera a versão de produção em dist/
npm run preview  # serve o build de produção
```

## O que já está implementado

**Regras completas de xadrez**

- Movimento e captura de todas as peças, xeque, xeque-mate e afogamento.
- Roque (rei e torre que nunca se moveram, caminho livre e rei sem passar por
  casa atacada).
- En passant e promoção de peão (com escolha da peça).
- Empate por repetição tripla e pela regra dos 50 lances.

**Dois modos de início**

1. **Padrão** — posição clássica.
2. **Montagem customizada** — cada jogador posiciona suas 16 peças em segredo,
   usando até 3 fileiras do seu lado. Regras extras:
   - os dois bispos precisam ficar em casas de cores diferentes;
   - peão que começa fora da fileira padrão (a 2ª) só anda 1 casa no primeiro
     lance;
   - se a montagem deixaria o próprio rei em xeque na revelação, ela é
     recusada e só aquele jogador refaz o posicionamento;
   - depois das duas montagens, o tabuleiro completo é revelado com animação.

**Combate (etapa 2)**

- Cada tipo de peça tem uma animação de ataque própria ao capturar: o peão
  golpeia com o escudo, a torre investe como aríete, o cavalo salta e
  pisoteia, o bispo dispara um feixe do cajado, a rainha atravessa a casa
  num golpe giratório e o rei faz uma investida pesada.
- Cada tipo tem também sua morte: a torre desmorona em tijolos, a coroa da
  rainha cai e rola, o cavalo tomba levantando poeira, o cajado do bispo se
  parte no chão, o peão cai largando o escudo e o rei cai de joelhos.
- No xeque-mate o rei derrotado se ajoelha e permanece no tabuleiro — ele
  nunca é capturado de fato.
- Capturas deixam marcas permanentes na casa (mancha, poeira e cacos). As
  marcas são rentes ao tabuleiro, escurecem a cada nova captura e têm teto
  de 20 grupos; passando disso, as mais antigas são descartadas.
- O menu inicial tem o toggle **Sangue e destroços**, que desliga as marcas
  por completo (as animações de combate continuam). A escolha fica salva no
  navegador.

**Câmera e interação**

- Órbita livre com zoom (OrbitControls); a câmera gira suavemente para o lado
  de quem joga a cada turno.
- Clique numa peça para ver os lances legais (ponto verde = lance simples,
  anel vermelho = captura); clique no destino para mover.

## Estrutura

```
src/
  chess/       regras (independentes de render)
    moveGen.js   geração de lances e casas atacadas
    game.js      estado da partida, lances especiais, fim de jogo
    setup.js     zonas, validações e utilidades da montagem customizada
  three/       camada 3D
    boardScene.js  cena, luzes, tabuleiro, OrbitControls
    pieceModels.js modelos low poly de cada peça
    highlights.js  marcadores de seleção/lances/xeque
    cameraRig.js   giro de câmera por turno
    animation.js   utilidades de animação (tempo, easing, fade, reparent)
    combat.js      ataques, mortes e efeitos transitórios por tipo de peça
    decals.js      marcas persistentes no tabuleiro (limite e envelhecimento)
    gameView.js    liga regras, cena, cliques e animações
  ui/
    setupUI.js   tela 2D da montagem secreta
  settings.js  preferências (toggle de sangue/destroços)
  debug.js     montador de cenas de captura para conferir animações
  main.js      fluxo de telas (menu, montagem, revelação, partida)
```

## Conferindo as animações uma a uma

Com uma partida aberta, no console do navegador:

```js
xadrez.testarCaptura('atacante', 'vitima')
```

Os códigos são `p` (peão), `n` (cavalo), `b` (bispo), `r` (torre),
`q` (rainha) e `k` (rei). O comando monta uma posição em que a peça da Ordem
captura a da Ruína em d5 e executa o lance na hora. Exemplos:

```js
xadrez.testarCaptura('r', 'r')   // aríete da torre + desmoronamento em tijolos
xadrez.testarCaptura('n', 'q')   // pisoteio do cavalo + coroa rolando
xadrez.testarCaptura('b', 'p')   // feixe do bispo + peão largando o escudo
xadrez.testarCaptura('q', 'b')   // golpe giratório + cajado quebrado
xadrez.testarCaptura('k', 'n')   // investida do rei + cavalo tombando
xadrez.testarCaptura('q', 'k')   // demonstração visual da morte do rei
```

`window.xadrez` também expõe `{ game, gameView }` para inspeção.

## Próximas etapas (ainda não feitas)

Som e ambientação.
