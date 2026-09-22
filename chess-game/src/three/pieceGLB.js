import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { WHITE } from '../chess/moveGen.js';
import { PAWN_GLB_BASE64 } from './pawnData.js';
import { BISHOP_GLB_BASE64 } from './bishopData.js';
import { rigWalker } from './pieceAnimator.js';

// Modelos .glb embutidos em base64 (o host de artifact não serve .glb).
// Cada um é carregado uma vez e clonado por peça. `height` é a altura do
// modelo em unidades próprias; `target`, a altura desejada antes do
// PIECE_SCALE (casando com a peça procedural equivalente).

const RUIN_TINT = 0x4a4658;
const RUIN_STONE = 0x1b1922;
const RUIN_GLOW = 0xd946ef;

// Modelo texturizado: a Ruína recebe um tom escuro que multiplica a textura.
function tintRecolor(material) {
  if (material.color) material.color.setHex(RUIN_TINT);
}

// Modelo com materiais nomeados: o brilho sagrado vira a energia magenta da
// Ruína, o ouro fica mais fosco e as partes claras viram obsidiana.
function namedRecolor(material) {
  const name = material.name || '';
  const glowing = material.emissive && material.emissive.getHex() !== 0;
  if (glowing || /emissive/i.test(name)) {
    material.color.setHex(RUIN_GLOW);
    material.emissive?.setHex(RUIN_GLOW);
    return;
  }
  if (/gold/i.test(name)) {
    material.color.multiplyScalar(0.7);
    return;
  }
  if (/face|feet|dark/i.test(name)) return;
  material.color.setHex(RUIN_STONE);
  material.metalness = Math.min(material.metalness ?? 0.3, 0.25);
  material.roughness = Math.max(material.roughness ?? 0.5, 0.7);
}

// O cajado vira uma parte marcada ('staff') para o combate: o feixe sai dele
// no ataque e ele se parte na morte do bispo.
function tagStaff(model) {
  const staff = model.getObjectByName('Staff');
  if (!staff) return;
  const gem = model.getObjectByName('Staff_Gem');
  model.updateMatrixWorld(true);
  const group = new THREE.Group();
  group.name = 'Staff_Group';
  group.userData.part = 'staff';
  staff.parent.add(group);
  const center = new THREE.Box3().setFromObject(staff).getCenter(new THREE.Vector3());
  group.position.copy(staff.parent.worldToLocal(center));
  group.updateMatrixWorld(true);
  group.attach(staff);
  if (gem) group.attach(gem);
}

const MODELS = {
  // Peão boneco: malha única texturizada, exportado em Z-up.
  p: { data: PAWN_GLB_BASE64, height: 1.282, target: 0.94, zUp: true, recolor: tintRecolor },
  // Bispo chibi: partes nomeadas (pernas, braços, cajado...), Y-up.
  b: {
    data: BISHOP_GLB_BASE64,
    height: 1.59,
    target: 1.28,
    flat: true,
    recolor: namedRecolor,
    setup: tagStaff,
  },
};

const templates = new Map();
let loading = null;

function base64ToArrayBuffer(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

function parseModel(type, cfg) {
  return new Promise((resolve) => {
    try {
      new GLTFLoader().parse(
        base64ToArrayBuffer(cfg.data),
        '',
        (gltf) => {
          templates.set(type, gltf.scene);
          resolve();
        },
        (err) => {
          console.warn(`[glb] modelo "${type}" não carregou; usando o procedural.`, err);
          resolve();
        },
      );
    } catch (err) {
      console.warn(`[glb] modelo "${type}" não carregou; usando o procedural.`, err);
      resolve();
    }
  });
}

export function preloadPieceModels() {
  if (!loading) {
    loading = Promise.all(Object.entries(MODELS).map(([type, cfg]) => parseModel(type, cfg)));
  }
  return loading;
}

export function hasPieceModel(type) {
  return templates.has(type);
}

// Hierarquia devolvida: invólucro (recebe o PIECE_SCALE e a animação ociosa)
// > corpo (caminhada: giro, inclinação, balanço) > escala/orientação > glTF.
export function makePieceFromGLB(type, color) {
  const cfg = MODELS[type];
  const template = templates.get(type);
  if (!cfg || !template) return null;

  const isOrder = color === WHITE;
  const model = template.clone(true);

  model.traverse((obj) => {
    if (!obj.isMesh) return;
    obj.castShadow = true;
    obj.receiveShadow = true;
    // Materiais próprios por peça (combate e esmaecimento mexem na opacidade).
    const source = Array.isArray(obj.material) ? obj.material : [obj.material];
    const cloned = source.map((m) => {
      const mat = m.clone();
      if (cfg.flat) mat.flatShading = true;
      if (!isOrder) cfg.recolor(mat);
      return mat;
    });
    obj.material = cloned.length === 1 ? cloned[0] : cloned;
  });

  const body = new THREE.Group();
  body.name = 'Body';
  // Montado com o glTF ainda sem pai, para as juntas saírem no espaço do modelo.
  rigWalker(model, body);
  cfg.setup?.(model);

  const oriented = new THREE.Group();
  if (cfg.zUp) oriented.rotation.x = -Math.PI / 2;
  oriented.scale.setScalar(cfg.target / cfg.height);
  oriented.add(model);
  body.add(oriented);

  const wrapper = new THREE.Group();
  wrapper.add(body);
  return wrapper;
}
