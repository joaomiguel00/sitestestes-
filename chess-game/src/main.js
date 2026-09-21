import './style.css';
import { WHITE, BLACK } from './chess/moveGen.js';
import { ChessGame, createStandardBoard, STATUS } from './chess/game.js';
import { mergeBoards, kingIsInCheck } from './chess/setup.js';
import { GameView } from './three/gameView.js';
import { renderSetupUI } from './ui/setupUI.js';
import { settings, setSetting } from './settings.js';
import { audio } from './audio/index.js';
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
    audio.stopMusic();
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
        <h1 class="title">War of Chess</h1>
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
        <button class="btn btn-ghost btn-wide" id="btn-options">Opções</button>
      </div>
    </div>
  `;

  uiRoot.querySelector('#btn-standard').onclick = () => launchMatch(createStandardBoard(), false);
  uiRoot.querySelector('#btn-custom').onclick = startCustomFlow;
  uiRoot.querySelector('#btn-options').onclick = () => showOptions(showStartMenu);
}

/* -------------------------------------------------------------- opções */

const TOGGLES = [
  {
    key: 'gore',
    title: 'Sangue e destroços',
    hint: 'Marcas de captura que ficam no tabuleiro até o fim da partida',
  },
  {
    key: 'cinematic',
    title: 'Câmera cinematográfica',
    hint: 'Nas capturas, a câmera se aproxima em câmera lenta e depois volta',
  },
];

// Todas as preferências num lugar só. `onBack` decide para onde voltar,
// então a mesma tela serve ao menu inicial e ao HUD durante a partida.
function showOptions(onBack) {
  resetUI();
  uiRoot.innerHTML = `
    <div class="screen options-screen">
      <div class="start-card">
        <p class="eyebrow">Ajustes</p>
        <h2>Opções</h2>

        ${TOGGLES.map(
          (toggle) => `
          <label class="option-toggle" for="opt-${toggle.key}">
            <input type="checkbox" id="opt-${toggle.key}" data-key="${toggle.key}"
              ${settings[toggle.key] ? 'checked' : ''} />
            <span class="option-switch"></span>
            <span class="option-text">
              <strong>${toggle.title}</strong>
              <em>${toggle.hint}</em>
            </span>
          </label>`,
        ).join('')}

        <div class="option-volume">
          <button class="volume-button" id="btn-mute" type="button" aria-pressed="${settings.muted}">
            ${settings.muted ? '🔇' : '🔊'}
          </button>
          <label class="option-text" for="opt-volume">
            <strong>Volume</strong>
            <em id="volume-label">${settings.muted ? 'Mudo' : `${Math.round(settings.volume * 100)}%`}</em>
          </label>
          <input
            type="range"
            id="opt-volume"
            min="0"
            max="100"
            value="${Math.round(settings.volume * 100)}"
          />
        </div>

        <button class="btn btn-primary btn-wide" id="btn-back">Voltar</button>
      </div>
    </div>
  `;

  uiRoot.querySelectorAll('.option-toggle input').forEach((input) => {
    input.onchange = (event) => {
      setSetting(event.target.dataset.key, event.target.checked);
      audio.playUi('click');
    };
  });

  const volumeSlider = uiRoot.querySelector('#opt-volume');
  const volumeLabel = uiRoot.querySelector('#volume-label');
  const muteButton = uiRoot.querySelector('#btn-mute');

  function refreshVolumeUI() {
    muteButton.textContent = settings.muted ? '🔇' : '🔊';
    muteButton.setAttribute('aria-pressed', String(settings.muted));
    volumeLabel.textContent = settings.muted ? 'Mudo' : `${Math.round(settings.volume * 100)}%`;
  }

  volumeSlider.oninput = (event) => {
    audio.unlock();
    audio.setVolume(Number(event.target.value) / 100);
    if (settings.muted && settings.volume > 0) audio.setMuted(false);
    refreshVolumeUI();
    audio.playUi('click');
  };

  muteButton.onclick = () => {
    audio.unlock();
    audio.setMuted(!settings.muted);
    refreshVolumeUI();
    if (!settings.muted) audio.playUi('click');
  };

  uiRoot.querySelector('#btn-back').onclick = onBack;
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

  audio.startMusic();

  const game = new ChessGame(board);
  gameView = new GameView(canvasContainer, game, {
    onStatusChange: handleStatusChange,
    onPromotionNeeded: askPromotion,
    onHoverPiece: showVeteranTooltip,
    onReplayStart: () => showReplayOverlay(true),
    onReplayCaption: setReplayCaption,
    onReplayEnd: () => showReplayOverlay(false),
  });
  gameView.focusOnSide(game.turn);

  renderHUD(game);

  if (withReveal) await gameView.playRevealAnimation();

  // Expõe o estado para depuração no console do navegador.
  window.xadrez = { game, gameView, audio, testarCaptura: createCaptureTester(() => window.xadrez) };
}

function renderHUD(game) {
  const hud = document.createElement('div');
  hud.className = 'hud panel';
  hud.innerHTML = `
    <div class="hud-turn" id="hud-turn"></div>
    <div class="hud-check" id="hud-check">Xeque!</div>
    <button class="volume-button" id="hud-mute" type="button" title="Ligar/desligar som"></button>
    <button class="volume-button" id="hud-options" type="button" title="Opções">⚙</button>
    <button class="btn btn-ghost btn-small" id="hud-menu">Menu</button>
  `;
  uiRoot.appendChild(hud);

  const controls = document.createElement('div');
  controls.className = 'hint panel';
  controls.textContent =
    'Arraste para orbitar · scroll para zoom · clique numa peça para ver os lances';
  uiRoot.appendChild(controls);

  const muteButton = hud.querySelector('#hud-mute');
  muteButton.textContent = settings.muted ? '🔇' : '🔊';
  muteButton.onclick = () => {
    audio.setMuted(!settings.muted);
    muteButton.textContent = settings.muted ? '🔇' : '🔊';
  };

  hud.querySelector('#hud-options').onclick = () =>
    showOptions(() => {
      // Volta para a partida em andamento, sem reiniciar nada.
      resetUI({ interactive: false });
      renderHUD(game);
    });

  hud.querySelector('#hud-menu').onclick = showStartMenu;
  updateHUD(game);
}

/* ------------------------------------------- veteranos e replay final */

const PIECE_NAME = {
  p: 'Peão',
  n: 'Cavalo',
  b: 'Bispo',
  r: 'Torre',
  q: 'Rainha',
  k: 'Rei',
};

let tooltipEl = null;

// Passar o mouse numa peça que já capturou mostra a contagem de abates.
function showVeteranTooltip(info) {
  if (!info) {
    tooltipEl?.remove();
    tooltipEl = null;
    return;
  }

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'veteran-tip';
    uiRoot.appendChild(tooltipEl);
  }

  const { piece, x, y } = info;
  const kills = piece.kills ?? 0;
  tooltipEl.innerHTML = `
    <strong>${PIECE_NAME[piece.type]} veterano</strong>
    <span>${kills} ${kills === 1 ? 'abate' : 'abates'}</span>
  `;
  tooltipEl.style.left = `${x + 16}px`;
  tooltipEl.style.top = `${y + 16}px`;
}

let replayEl = null;

function showReplayOverlay(visible) {
  if (!visible) {
    replayEl?.remove();
    replayEl = null;
    return;
  }
  replayEl = document.createElement('div');
  replayEl.className = 'replay-overlay';
  replayEl.innerHTML = `
    <div class="replay-bar replay-top">Momentos da batalha</div>
    <div class="replay-caption" id="replay-caption"></div>
    <div class="replay-bar replay-bottom">clique para pular</div>
  `;
  uiRoot.appendChild(replayEl);
}

function setReplayCaption(text) {
  const caption = document.getElementById('replay-caption');
  if (!caption) return;
  caption.textContent = text ?? '';
  caption.classList.remove('is-visible');
  if (text) {
    // Reinicia a animação de entrada da legenda.
    void caption.offsetWidth;
    caption.classList.add('is-visible');
  }
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

document.addEventListener('pointerdown', () => audio.unlock(), { once: true });

showStartMenu();
