import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { WHITE } from '../chess/moveGen.js';

// Carrega o modelo .glb do peão uma vez e o clona por peça. O modelo vem em
// unidades próprias (~1,725 de altura); reduzimos para casar com a altura do
// peão procedural (~0,94) antes do PIECE_SCALE aplicado em createPieceMesh.
const GLB_HEIGHT = 1.725;
const TARGET_HEIGHT = 0.94;
const INNER_SCALE = TARGET_HEIGHT / GLB_HEIGHT;

let template = null;
let loading = null;

export function preloadPawnModel(file = 'models/pawn.glb') {
  if (loading) return loading;
  const base = import.meta.env.BASE_URL ?? '/';
  loading = new Promise((resolve) => {
    new GLTFLoader().load(
      `${base}${file}`,
      (gltf) => {
        template = gltf.scene;
        resolve(template);
      },
      undefined,
      (err) => {
        console.warn('[glb] peão não carregou; usando modelo procedural.', err);
        resolve(null);
      },
    );
  });
  return loading;
}

export function hasPawnModel() {
  return !!template;
}

// Escurece os materiais claros para o exército da Ruína, preservando o ouro.
function recolorForRuin(material) {
  const name = material.name || '';
  if (/gold/i.test(name)) {
    material.color.multiplyScalar(0.7); // ouro mais fosco
    return;
  }
  material.color.setHex(0x1b1922); // obsidiana
  material.metalness = Math.min(material.metalness ?? 0.3, 0.25);
  material.roughness = Math.max(material.roughness ?? 0.5, 0.7);
}

export function makePawnFromGLB(color) {
  if (!template) return null;
  const isOrder = color === WHITE;
  const model = template.clone(true);

  model.traverse((obj) => {
    if (!obj.isMesh) return;
    obj.castShadow = true;
    obj.receiveShadow = true;
    // Materiais próprios por peça (combate/esmaecimento mexem na opacidade).
    const source = Array.isArray(obj.material) ? obj.material : [obj.material];
    const cloned = source.map((m) => {
      const mat = m.clone();
      if (!isOrder) recolorForRuin(mat);
      return mat;
    });
    obj.material = cloned.length === 1 ? cloned[0] : cloned;
  });

  model.scale.setScalar(INNER_SCALE);

  // Invólucro interno de escala 1: o createPieceMesh aplica o PIECE_SCALE aqui.
  const wrapper = new THREE.Group();
  wrapper.add(model);
  return wrapper;
}
