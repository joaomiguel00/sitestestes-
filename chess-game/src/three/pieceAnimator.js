import * as THREE from 'three';
import { animate, easeInOut } from './animation.js';

// Caminhada procedural para peças .glb com partes nomeadas. Qualquer modelo
// que siga esta nomenclatura ganha passos, braços, balanço e inclinação; os
// que não seguem continuam só deslizando (quem chama cuida do fallback).
export const PART_NAMES = {
  legs: { L: ['Leg_L'], R: ['Leg_R'] },
  feet: { L: ['Foot_L'], R: ['Foot_R'] },
  arms: { L: ['Arm_L', 'Arm_L_Bent'], R: ['Arm_R', 'Arm_R_Bent'] },
  hands: { L: ['Hand_L'], R: ['Hand_R'] },
  shoulders: { L: ['Shoulder_L'], R: ['Shoulder_R'] },
  // Itens segurados acompanham a mão do mesmo lado.
  held: { L: ['Holy_Orb', 'Orb', 'Shield'], R: ['Staff', 'Staff_Gem', 'Sword', 'Weapon'] },
};

const WALK = {
  stride: 0.75, // distância no tabuleiro por passo (1 casa = 1)
  legSwing: 0.55, // rad
  armSwing: 0.32, // rad
  lean: 0.12, // rad, inclinação para a frente
  bob: 0.035, // sobe-e-desce do corpo, no espaço do modelo
  baseMs: 260,
  msPerUnit: 190,
  minMs: 380,
  maxMs: 1700,
  settleMs: 170,
};

// corpo -> rig. WeakMap em vez de userData: userData é copiado via JSON.
const rigs = new WeakMap();

function findByNames(root, names) {
  for (const name of names) {
    const obj = root.getObjectByName(name);
    if (obj) return obj;
  }
  // O GLTFLoader guarda o nome original em userData.name caso precise renomear.
  let found = null;
  root.traverse((obj) => {
    if (!found && names.includes(obj.userData?.name)) found = obj;
  });
  return found;
}

function topCenter(obj) {
  const box = new THREE.Box3().setFromObject(obj);
  return new THREE.Vector3((box.min.x + box.max.x) / 2, box.max.y, (box.min.z + box.max.z) / 2);
}

function centerOf(obj) {
  return new THREE.Box3().setFromObject(obj).getCenter(new THREE.Vector3());
}

// As partes vêm com a origem no pé do modelo; para girar um membro na junta
// (quadril, ombro) ele é pendurado num pivô posicionado ali. attach() mantém
// a posição visual de cada parte.
function makePivot(part, joint, followers) {
  const parent = part.parent;
  const pivot = new THREE.Group();
  pivot.name = `${part.name}_Pivot`;
  parent.add(pivot);
  pivot.position.copy(parent.worldToLocal(joint.clone()));
  pivot.updateMatrixWorld(true);
  pivot.attach(part);
  for (const follower of followers) {
    if (follower && follower !== part && !pivot.getObjectById(follower.id)) pivot.attach(follower);
  }
  return pivot;
}

// model: raiz do glTF (ainda sem pai). body: nó que recebe giro, inclinação e
// balanço do corpo inteiro. Devolve null se o modelo não tiver pernas nomeadas.
export function rigWalker(model, body) {
  const legL = findByNames(model, PART_NAMES.legs.L);
  const legR = findByNames(model, PART_NAMES.legs.R);
  if (!legL || !legR) return null;

  model.updateMatrixWorld(true);

  const buildSide = (side) => {
    const leg = side === 'L' ? legL : legR;
    const legPivot = makePivot(leg, topCenter(leg), [findByNames(model, PART_NAMES.feet[side])]);

    const arm = findByNames(model, PART_NAMES.arms[side]);
    if (!arm) return { leg: legPivot, arm: null };

    const shoulder = findByNames(model, PART_NAMES.shoulders[side]);
    const followers = [
      findByNames(model, PART_NAMES.hands[side]),
      ...PART_NAMES.held[side].map((name) => model.getObjectByName(name)),
    ];
    const armPivot = makePivot(arm, shoulder ? centerOf(shoulder) : topCenter(arm), followers);
    return { leg: legPivot, arm: armPivot };
  };

  const left = buildSide('L');
  const right = buildSide('R');
  // Giro (Y) primeiro, inclinação (X) depois: a peça se inclina para onde anda.
  body.rotation.order = 'YXZ';

  const rig = { body, legL: left.leg, legR: right.leg, armL: left.arm, armR: right.arm };
  rigs.set(body, rig);
  return rig;
}

function findRig(piece) {
  let found = null;
  piece.traverse((obj) => {
    if (!found && rigs.has(obj)) found = rigs.get(obj);
  });
  return found;
}

export function hasWalkRig(piece) {
  return !!findRig(piece);
}

const smoothstep = (e0, e1, x) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

function wrapAngle(a) {
  return Math.atan2(Math.sin(a), Math.cos(a));
}

// Pose da caminhada. t: tempo normalizado; p: progresso (com easing) ao longo
// do trajeto — a fase dos passos segue p, então o passo acompanha a velocidade.
function applyPose(rig, { t, p, steps, yaw }) {
  const envelope = smoothstep(0, 0.16, t) * (1 - smoothstep(0.78, 1, t));
  const turn = smoothstep(0, 0.16, t) * (1 - smoothstep(0.84, 1, t));
  const phase = steps * Math.PI * p;
  const swing = Math.sin(phase) * envelope;

  // Pernas alternadas; braços opostos às pernas, como num andar natural.
  rig.legL.rotation.x = -swing * WALK.legSwing;
  rig.legR.rotation.x = swing * WALK.legSwing;
  if (rig.armL) rig.armL.rotation.x = swing * WALK.armSwing;
  if (rig.armR) rig.armR.rotation.x = -swing * WALK.armSwing;

  // Corpo: vira para a direção do trajeto, inclina para a frente e balança,
  // mais alto com as pernas retas e mais baixo no impacto do pé.
  rig.body.rotation.y = yaw * turn;
  rig.body.rotation.x = WALK.lean * envelope;
  rig.body.position.y = Math.abs(Math.cos(phase)) * WALK.bob * envelope;
}

export function resetPose(rig) {
  for (const limb of [rig.legL, rig.legR, rig.armL, rig.armR]) if (limb) limb.rotation.x = 0;
  rig.body.rotation.set(0, 0, 0);
  rig.body.position.y = 0;
}

// Leva membros e corpo de volta à pose de descanso por interpolação.
function settle(rig) {
  const limbs = [rig.legL, rig.legR, rig.armL, rig.armR].filter(Boolean);
  const from = limbs.map((limb) => limb.rotation.x);
  const body = { yaw: rig.body.rotation.y, lean: rig.body.rotation.x, bob: rig.body.position.y };
  const residual = Math.max(...from.map(Math.abs), Math.abs(body.yaw), Math.abs(body.lean), Math.abs(body.bob));
  if (residual < 1e-3) {
    resetPose(rig);
    return Promise.resolve();
  }
  return animate(WALK.settleMs, (t) => {
    const k = 1 - easeInOut(t);
    limbs.forEach((limb, i) => {
      limb.rotation.x = from[i] * k;
    });
    rig.body.rotation.y = body.yaw * k;
    rig.body.rotation.x = body.lean * k;
    rig.body.position.y = body.bob * k;
  }).then(() => resetPose(rig));
}

// Leva a peça até `target` caminhando. Mais casas = mais passos e mais tempo.
// Devolve null quando a peça não tem as partes nomeadas: quem chama desliza.
export function walkTo(piece, target) {
  const rig = findRig(piece);
  if (!rig) return null;

  const start = piece.position.clone();
  const dx = target.x - start.x;
  const dz = target.z - start.z;
  const distance = Math.hypot(dx, dz);
  const steps = Math.max(2, Math.round(distance / WALK.stride));
  const duration = THREE.MathUtils.clamp(
    WALK.baseMs + distance * WALK.msPerUnit,
    WALK.minMs,
    WALK.maxMs,
  );
  // A frente do modelo é +Z; a peça preta já está girada 180° no invólucro.
  const yaw = distance > 1e-4 ? wrapAngle(Math.atan2(dx, dz) - piece.rotation.y) : 0;

  return animate(duration, (t) => {
    const p = easeInOut(t);
    piece.position.set(start.x + dx * p, start.y * (1 - p), start.z + dz * p);
    applyPose(rig, { t, p, steps, yaw });
  }).then(() => {
    piece.position.set(target.x, 0, target.z);
    return settle(rig);
  });
}
