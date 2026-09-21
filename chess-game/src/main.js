import './style.css';
import { WHITE, BLACK } from './chess/moveGen.js';
import { ChessGame, createStandardBoard, STATUS } from './chess/game.js';
import { mergeBoards, kingIsInCheck } from './chess/setup.js';
import { GameView } from './three/gameView.js';
import { renderSetupUI } from './ui/setupUI.js';
import { settings, setSetting } from './settings.js';
import { createCaptureTester } from './debug.js';

const uiRoot = document.getElementById('ui-root');
const canvasContainer = document.getElementById('canvas-container');

const TEAM_NAME = {
  [WHITE]: 'Ordem (Brancas)',
  [BLACK]: 'Ruína (Pretas)',
};

let gameView = null;
let customBoards = { [WHITE]: null, [BLACK]: null };

function resetUI({ interactive = true } = {}) {
  uiRoot.innerHTML = '';
  uiRoot.style.pointerEvents = interactive ? 'auto' : 'none';
}

function destroyMatch() {
  if (gameView) {
    gameView.dispose();
    gameView = null;
  }
  canvasContainer.style.display = 'none';
}

/* ---------------------------------------------------------------- menus */

function showStartMenu() {
  destroyMatch();
  resetUI();
  uiRoot.innerHTML = `
    <div class="screen start-screen">
      <div class="start-card">
        <p class="eyebrow">Tabuleiro de sombras</p>
        <h1 class="title">Xadrez Sombrio</h1>
        <p class="subtitle">Dois jogadores, um dispositivo. Escolha como a batalha começa.</p>
        <div class="menu-buttons">
          <button class="btn btn-primary" id="btn-standard">
            <strong>Modo Padrão</strong>
            <span>Posição clássica do xadrez</span>
          </button>
          <button class="btn btn-secondary" id="btn-custom">
            <strong>Montagem Customizada</strong>
            <span>Cada exército se posiciona em segredo, em até 3 fileiras</span>
          </button>
        </div>
        <label class="option-toggle" for="opt-gore">
          <input type="checkbox" id="opt-gore" ${settings.gore ? 'checked' : ''} />
          <span class="option-switch"></span>
          <span class="option-text">
            <strong>Sangue e destroços</strong>
            <em>Marcas de captura que ficam no tabuleiro até o fim da partida</em>
          </span>
        </label>
      </div>
    </div>
  `;

  uiRoot.querySelector('#btn-standard').onclick = () => launchMatch(createStandardBoard(), false);
  uiRoot.querySelector('#btn-custom').onclick = startCustomFlow;
  uiRoot.querySelector('#opt-gore').onchange = (event) => {
    setSetting('gore', event.target.checked);
  };
}

/* ------------------------------------------------- montagem customizada */

function startCustomFlow() {
  customBoards = { [WHITE]: null, [BLACK]: null };
  showHandoff(WHITE, 'Monte seu exército em segredo. Ninguém mais deve ver a tela.', () =>
    showSetupScreen(WHITE, () => showHandoff(BLACK, 'É a sua vez de montar em segredo.', () =>
      showSetupScreen(BLACK, tryReveal),
    )),
  );
}

function showHandoff(color, message, onReady) {
  destroyMatch();
  resetUI();
  uiRoot.innerHTML = `
    <div class="screen intro-screen team-${color}">
      <div class="start-card">
        <p class="eyebrow">Passe o dispositivo</p>
        <h2>${TEAM_NAME[color]}</h2>
        <p class="subtitle">${message}</p>
        <button class="btn btn-primary" id="btn-ready">Estou pronto</button>
      </div>
    </div>
  `;
  uiRoot.querySelector('#btn-ready').onclick = onReady;
}

function showSetupScreen(color, onDone) {
  destroyMatch();
  resetUI();
  renderSetupUI(uiRoot, color, (board) => {
    customBoards[color] = board;
    onDone();
  });
}

function tryReveal() {
  const board = mergeBoards(customBoards[WHITE], customBoards[BLACK]);

  for (const color of [WHITE, BLACK]) {
    if (kingIsInCheck(board, color)) {
      showSetupRejected(color);
      return;
    }
  }

  showReveal(board);
}

function showSetupRejected(color) {
  resetUI();
  uiRoot.innerHTML = `
    <div class="screen intro-screen team-${color}">
      <div class="start-card">
        <p class="eyebrow">Montagem inválida</p>
        <h2>${TEAM_NAME[color]}</h2>
        <p class="subtitle">
          Seu rei ficaria em xeque assim que o tabuleiro fosse revelado.
          Reposicione suas peças — a montagem do adversário continua em segredo.
        </p>
        <button class="btn btn-primary" id="btn-retry">Refazer montagem</button>
      </div>
    </div>
  `;
  uiRoot.querySelector('#btn-retry').onclick = () => showSetupScreen(color, tryReveal);
}

function showReveal(board) {
  resetUI({ interactive: false });
  uiRoot.innerHTML = `
    <div class="screen reveal-screen">
      <h2 class="reveal-title">O tabuleiro é revelado</h2>
    </div>
  `;
  setTimeout(() => launchMatch(board, true), 900);
}

/* --------------------------------------------------------------- partida */

async function launchMatch(board, withReveal) {
  destroyMatch();
  resetUI({ interactive: false });
  canvasContainer.style.display = 'block';

  const game = new ChessGame(board);
  gameView = new GameView(canvasContainer, game, {
    onStatusChange: handleStatusChange,
    onPromotionNeeded: askPromotion,
  });
  gameView.focusOnSide(game.turn);

  renderHUD(game);

  if (withReveal) await gameView.playRevealAnimation();

  // Expõe o estado para depuração no console do navegador.
  window.xadrez = { game, gameView, testarCaptura: createCaptureTester(() => window.xadrez) };
}

function renderHUD(game) {
  const hud = document.createElement('div');
  hud.className = 'hud panel';
  hud.innerHTML = `
    <div class="hud-turn" id="hud-turn"></div>
    <div class="hud-check" id="hud-check">Xeque!</div>
    <button class="btn btn-ghost btn-small" id="hud-menu">Menu</button>
  `;
  uiRoot.appendChild(hud);

  const controls = document.createElement('div');
  controls.className = 'hint panel';
  controls.textContent =
    'Arraste para orbitar · scroll para zoom · clique numa peça para ver os lances';
  uiRoot.appendChild(controls);

  hud.querySelector('#hud-menu').onclick = showStartMenu;
  updateHUD(game);
}

function updateHUD(game) {
  const turnEl = document.getElementById('hud-turn');
  const checkEl = document.getElementById('hud-check');
  if (turnEl) {
    turnEl.textContent = `Vez de ${TEAM_NAME[game.turn]}`;
    turnEl.className = `hud-turn team-${game.turn}`;
  }
  if (checkEl) {
    checkEl.style.display = game.status === STATUS.CHECK ? 'block' : 'none';
  }
}

function handleStatusChange(game) {
  updateHUD(game);

  if (!game.isGameOver()) return;

  const messages = {
    [STATUS.CHECKMATE]: `Xeque-mate! ${TEAM_NAME[game.winner]} vence.`,
    [STATUS.STALEMATE]: 'Afogamento — empate.',
    [STATUS.DRAW_REPETITION]: 'Empate por repetição tripla da posição.',
    [STATUS.DRAW_50]: 'Empate pela regra dos 50 lances.',
  };

  showEndModal(messages[game.status]);
}

function showEndModal(message) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay panel';
  overlay.innerHTML = `
    <div class="modal">
      <h2>Fim de partida</h2>
      <p>${message}</p>
      <button class="btn btn-primary" id="btn-newgame">Novo jogo</button>
    </div>
  `;
  uiRoot.appendChild(overlay);
  overlay.querySelector('#btn-newgame').onclick = showStartMenu;
}

function askPromotion() {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay panel';
    overlay.innerHTML = `
      <div class="modal">
        <h2>Promoção</h2>
        <p>Escolha a peça que o peão se tornará:</p>
        <div class="promotion-options">
          <button class="btn promo-btn" data-type="q"><span>♛</span>Rainha</button>
          <button class="btn promo-btn" data-type="r"><span>♜</span>Torre</button>
          <button class="btn promo-btn" data-type="b"><span>♝</span>Bispo</button>
          <button class="btn promo-btn" data-type="n"><span>♞</span>Cavalo</button>
        </div>
      </div>
    `;
    uiRoot.appendChild(overlay);
    overlay.querySelectorAll('.promo-btn').forEach((button) => {
      button.onclick = () => {
        overlay.remove();
        resolve(button.dataset.type);
      };
    });
  });
}

showStartMenu();
