import * as THREE from 'three';
import { createBoardScene, squareToWorld } from './boardScene.js';
import { createHighlightLayer } from './highlights.js';
import { createPieceMesh } from './pieceModels.js';
import { createCameraRig } from './cameraRig.js';
import { findKing } from '../chess/moveGen.js';
import { STATUS } from '../chess/game.js';

const key = (row, col) => `${row},${col}`;

function animate(duration, onFrame) {
  return new Promise((resolve) => {
    const start = performance.now();
    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      onFrame(t);
      if (t < 1) requestAnimationFrame(step);
      else resolve();
    }
    requestAnimationFrame(step);
  });
}

const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export class GameView {
  constructor(container, game, callbacks = {}) {
    this.container = container;
    this.game = game;
    this.callbacks = callbacks;

    const scene = createBoardScene(container);
    this.scene = scene.scene;
    this.camera = scene.camera;
    this.renderer = scene.renderer;
    this.controls = scene.controls;
    this.boardGroup = scene.boardGroup;
    this.tiles = scene.tiles;
    this._disposeScene = scene.dispose;
    this._onResize = scene.onResize;

    this.highlights = createHighlightLayer(this.scene);
    this.cameraRig = createCameraRig(this.camera, this.controls);

    this.pieceGroup = new THREE.Group();
    this.scene.add(this.pieceGroup);
    this.pieces = new Map();

    this.selected = null;
    this.legalMoves = [];
    this.busy = false;
    this.disposed = false;

    this._raycaster = new THREE.Raycaster();
    this._pointer = new THREE.Vector2();
    this._onClick = this._onClick.bind(this);
    this.renderer.domElement.addEventListener('pointerdown', this._onClick);

    this._buildPieces();
    this._renderHighlights();

    this._loop = this._loop.bind(this);
    requestAnimationFrame(this._loop);
  }

  _loop() {
    if (this.disposed) return;
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this._loop);
  }

  _buildPieces() {
    this.pieceGroup.clear();
    this.pieces.clear();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = this.game.board[r][c];
        if (!piece) continue;
        this._spawnPiece(piece.type, piece.color, r, c);
      }
    }
  }

  _spawnPiece(type, color, row, col) {
    const mesh = createPieceMesh(type, color);
    const pos = squareToWorld(row, col);
    mesh.position.set(pos.x, 0, pos.z);
    this.pieceGroup.add(mesh);
    this.pieces.set(key(row, col), mesh);
    return mesh;
  }

  // Animação de revelação do tabuleiro (usada no modo customizado).
  async playRevealAnimation() {
    const entries = [...this.pieces.entries()];
    for (const [, mesh] of entries) {
      mesh.scale.set(0.001, 0.001, 0.001);
      mesh.visible = false;
    }

    const sorted = entries.sort((a, b) => {
      const [ra] = a[0].split(',').map(Number);
      const [rb] = b[0].split(',').map(Number);
      return Math.abs(3.5 - ra) - Math.abs(3.5 - rb);
    });

    await Promise.all(
      sorted.map(
        ([, mesh], index) =>
          new Promise((resolve) => {
            setTimeout(() => {
              mesh.visible = true;
              animate(420, (t) => {
                const e = easeInOut(t);
                mesh.scale.setScalar(e);
                mesh.position.y = (1 - e) * 1.2;
              }).then(() => {
                mesh.scale.setScalar(1);
                mesh.position.y = 0;
                resolve();
              });
            }, index * 22);
          }),
      ),
    );
  }

  _onClick(event) {
    if (this.busy || this.disposed || this.game.isGameOver()) return;
    if (event.button !== undefined && event.button !== 0) return;

    const rect = this.renderer.domElement.getBoundingClientRect();
    this._pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this._pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this._raycaster.setFromCamera(this._pointer, this.camera);

    const hits = this._raycaster.intersectObjects(
      [...this.tiles, ...this.pieceGroup.children],
      true,
    );
    if (!hits.length) return;

    let object = hits[0].object;
    let square = null;

    if (object.userData?.isTile) {
      square = { row: object.userData.row, col: object.userData.col };
    } else {
      while (object.parent && object.parent !== this.pieceGroup) object = object.parent;
      for (const [k, mesh] of this.pieces) {
        if (mesh === object) {
          const [row, col] = k.split(',').map(Number);
          square = { row, col };
          break;
        }
      }
    }

    if (square) this._handleSquareClick(square.row, square.col);
  }

  _handleSquareClick(row, col) {
    if (this.selected) {
      const move = this.legalMoves.find((m) => m.to.row === row && m.to.col === col);
      if (move) {
        this._playMove(move);
        return;
      }
    }

    const piece = this.game.board[row][col];
    if (piece && piece.color === this.game.turn) {
      this.selected = { row, col };
      this.legalMoves = this.game.getLegalMoves(row, col);
    } else {
      this.selected = null;
      this.legalMoves = [];
    }
    this._renderHighlights();
  }

  _renderHighlights() {
    this.highlights.clear();

    if (this.selected) {
      this.highlights.showSelection(this.selected.row, this.selected.col);
      for (const move of this.legalMoves) {
        const isCapture = !!move.capture || !!this.game.board[move.to.row][move.to.col];
        this.highlights.showMove(move.to.row, move.to.col, isCapture);
      }
    }

    if (this.game.status === STATUS.CHECK || this.game.status === STATUS.CHECKMATE) {
      const king = findKing(this.game.board, this.game.turn);
      if (king) this.highlights.showCheck(king.row, king.col);
    }
  }

  async _playMove(move) {
    this.busy = true;
    this.selected = null;
    this.legalMoves = [];
    this.highlights.clear();

    let promotionType;
    if (move.promotion) {
      promotionType = await this.callbacks.onPromotionNeeded?.(move);
      if (!promotionType) promotionType = 'q';
    }

    const movingColor = this.game.turn;
    const mesh = this.pieces.get(key(move.from.row, move.from.col));

    const capturedKey = move.enPassant
      ? key(move.from.row, move.to.col)
      : key(move.to.row, move.to.col);
    const capturedMesh = this.pieces.get(capturedKey);
    if (capturedMesh && capturedMesh !== mesh) {
      this.pieces.delete(capturedKey);
      this._animateCapture(capturedMesh);
    }

    const animations = [this._animateSlide(mesh, squareToWorld(move.to.row, move.to.col))];

    if (move.castle) {
      const rookKey = key(move.castle.rookFrom.row, move.castle.rookFrom.col);
      const rookMesh = this.pieces.get(rookKey);
      this.pieces.delete(rookKey);
      this.pieces.set(key(move.castle.rookTo.row, move.castle.rookTo.col), rookMesh);
      animations.push(
        this._animateSlide(rookMesh, squareToWorld(move.castle.rookTo.row, move.castle.rookTo.col)),
      );
    }

    this.pieces.delete(key(move.from.row, move.from.col));
    this.pieces.set(key(move.to.row, move.to.col), mesh);

    await Promise.all(animations);

    this.game.makeMove(move, promotionType);

    if (move.promotion) {
      this.pieceGroup.remove(mesh);
      this.pieces.delete(key(move.to.row, move.to.col));
      const promoted = this._spawnPiece(promotionType, movingColor, move.to.row, move.to.col);
      promoted.scale.setScalar(0.001);
      await animate(320, (t) => promoted.scale.setScalar(easeInOut(t)));
      promoted.scale.setScalar(1);
    }

    this._renderHighlights();
    this.callbacks.onStatusChange?.(this.game);

    if (!this.game.isGameOver()) {
      await this.cameraRig.rotateToSide(this.game.turn);
    }

    this.busy = false;
  }

  _animateSlide(mesh, target, duration = 340) {
    const start = mesh.position.clone();
    return animate(duration, (t) => {
      const e = easeInOut(t);
      mesh.position.x = start.x + (target.x - start.x) * e;
      mesh.position.z = start.z + (target.z - start.z) * e;
      mesh.position.y = Math.sin(Math.PI * t) * 0.3;
    }).then(() => {
      mesh.position.set(target.x, 0, target.z);
    });
  }

  _animateCapture(mesh, duration = 300) {
    animate(duration, (t) => {
      mesh.scale.setScalar(Math.max(0.001, 1 - t));
      mesh.position.y = t * 0.5;
      mesh.rotation.y += 0.15;
    }).then(() => this.pieceGroup.remove(mesh));
  }

  focusOnSide(color) {
    this.cameraRig.snapToSide(color);
  }

  dispose() {
    this.disposed = true;
    this.renderer.domElement.removeEventListener('pointerdown', this._onClick);
    this._disposeScene();
  }
}
