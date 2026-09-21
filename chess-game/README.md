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
    gameView.js    liga regras, cena, cliques e animações
  ui/
    setupUI.js   tela 2D da montagem secreta
  main.js      fluxo de telas (menu, montagem, revelação, partida)
```

Durante a partida, `window.xadrez` expõe `{ game, gameView }` no console para
inspeção/depuração.

## Próximas etapas (ainda não feitas)

Animações de combate, som e ambientação.
