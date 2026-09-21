import * as THREE from 'three';
import { WHITE } from '../chess/moveGen.js';

// Peças low poly: pedra escura facetada + ferragens de bronze.
// A diferença entre os exércitos é a cor do brilho arcano
// (âmbar para a Ordem, magenta para a Ruína).
function createMaterials(color) {
  const isOrder = color === WHITE;
  return {
    stone: new THREE.MeshStandardMaterial({
      color: isOrder ? 0x7c7a76 : 0x1f1d26,
      roughness: 0.82,
      metalness: 0.15,
      flatShading: true,
    }),
    trim: new THREE.MeshStandardMaterial({
      color: isOrder ? 0xd9b45c : 0x8a7442,
      roughness: 0.34,
      metalness: 0.95,
      flatShading: true,
    }),
    glow: new THREE.MeshStandardMaterial({
      color: isOrder ? 0xff8c33 : 0xd946ef,
      emissive: isOrder ? 0xff6a12 : 0xc026d3,
      emissiveIntensity: 2.4,
      roughness: 0.3,
      metalness: 0.1,
      flatShading: true,
    }),
  };
}

const BASE_TOP = 0.12;

// As peças são modeladas em escala "unitária" e depois ampliadas,
// para ficarem esguias em relação à casa de 1 unidade do tabuleiro.
const PIECE_SCALE = 1.25;

function buildPedestal(mats) {
  const group = new THREE.Group();

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, BASE_TOP, 8), mats.stone);
  base.position.y = BASE_TOP / 2;
  group.add(base);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.02, 5, 8), mats.glow);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = BASE_TOP * 0.55;
  group.add(ring);

  return group;
}

function addMerlons(group, mats, radius, y, count, size) {
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const merlon = new THREE.Mesh(new THREE.BoxGeometry(size, size * 1.5, size), mats.stone);
    merlon.position.set(Math.cos(angle) * radius, y + size * 0.75, Math.sin(angle) * radius);
    merlon.rotation.y = -angle;
    group.add(merlon);
  }
}

function buildCrown(mats, radius, y, spikes, spikeHeight, bigCenter) {
  const group = new THREE.Group();

  const band = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.07, 8), mats.trim);
  band.position.y = y;
  group.add(band);

  for (let i = 0; i < spikes; i++) {
    const angle = (i / spikes) * Math.PI * 2;
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.035, spikeHeight, 4), mats.trim);
    spike.position.set(
      Math.cos(angle) * radius * 0.82,
      y + spikeHeight / 2 + 0.03,
      Math.sin(angle) * radius * 0.82,
    );
    group.add(spike);
  }

  if (bigCenter) {
    const center = new THREE.Mesh(new THREE.ConeGeometry(0.05, spikeHeight * 1.7, 5), mats.trim);
    center.position.y = y + (spikeHeight * 1.7) / 2 + 0.03;
    group.add(center);

    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.05, 0), mats.glow);
    gem.position.y = y + spikeHeight * 1.7 + 0.08;
    group.add(gem);
  }

  return group;
}

// Peão: soldado baixo, com elmo simples e escudo redondo.
function buildPawn(mats) {
  const group = new THREE.Group();
  group.add(buildPedestal(mats));

  const legs = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.19, 0.16, 6), mats.stone);
  legs.position.y = BASE_TOP + 0.09;
  group.add(legs);

  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.15, 0.3, 6), mats.stone);
  torso.position.y = BASE_TOP + 0.33;
  group.add(torso);

  const belt = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.022, 5, 8), mats.trim);
  belt.rotation.x = Math.PI / 2;
  belt.position.y = BASE_TOP + 0.19;
  group.add(belt);

  const head = new THREE.Mesh(new THREE.IcosahedronGeometry(0.115, 0), mats.stone);
  head.position.y = BASE_TOP + 0.57;
  group.add(head);

  const crest = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.12, 4), mats.trim);
  crest.position.y = BASE_TOP + 0.71;
  group.add(crest);

  const shield = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.035, 8), mats.trim);
  shield.rotation.z = Math.PI / 2;
  shield.position.set(0.18, BASE_TOP + 0.33, 0.05);
  group.add(shield);

  return group;
}

// Torre: fortaleza de pedra em três patamares com ameias.
function buildRook(mats) {
  const group = new THREE.Group();
  group.add(buildPedestal(mats));

  const tiers = [
    { r: 0.22, h: 0.26, merlons: 8, size: 0.06 },
    { r: 0.175, h: 0.24, merlons: 7, size: 0.055 },
    { r: 0.135, h: 0.22, merlons: 6, size: 0.05 },
  ];

  let y = BASE_TOP;
  for (const tier of tiers) {
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(tier.r, tier.r + 0.035, tier.h, 8),
      mats.stone,
    );
    body.position.y = y + tier.h / 2;
    group.add(body);

    const band = new THREE.Mesh(new THREE.TorusGeometry(tier.r + 0.015, 0.024, 5, 8), mats.trim);
    band.rotation.x = Math.PI / 2;
    band.position.y = y + tier.h - 0.01;
    group.add(band);

    addMerlons(group, mats, tier.r * 0.8, y + tier.h - 0.02, tier.merlons, tier.size);
    y += tier.h;
  }

  return group;
}

// Cavalo: busto de corcel de guerra com arreios e olhos brilhantes.
function buildKnight(mats) {
  const group = new THREE.Group();
  group.add(buildPedestal(mats));

  const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.23, 0.26, 7), mats.stone);
  chest.position.y = BASE_TOP + 0.13;
  group.add(chest);

  const neck = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.52, 0.19), mats.stone);
  neck.position.set(0, BASE_TOP + 0.5, 0.02);
  neck.rotation.x = -0.32;
  group.add(neck);

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.19, 0.3), mats.stone);
  head.position.set(0, BASE_TOP + 0.78, 0.16);
  head.rotation.x = 0.18;
  group.add(head);

  const snout = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.12, 0.14), mats.stone);
  snout.position.set(0, BASE_TOP + 0.72, 0.32);
  snout.rotation.x = 0.18;
  group.add(snout);

  const noseband = new THREE.Mesh(new THREE.BoxGeometry(0.145, 0.05, 0.15), mats.trim);
  noseband.position.set(0, BASE_TOP + 0.72, 0.33);
  noseband.rotation.x = 0.18;
  group.add(noseband);

  const cheek = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.12, 0.06), mats.trim);
  cheek.position.set(0, BASE_TOP + 0.76, 0.05);
  group.add(cheek);

  for (const side of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.13, 4), mats.stone);
    ear.position.set(side * 0.06, BASE_TOP + 0.92, 0.08);
    ear.rotation.x = -0.15;
    group.add(ear);

    const eye = new THREE.Mesh(new THREE.OctahedronGeometry(0.028, 0), mats.glow);
    eye.position.set(side * 0.085, BASE_TOP + 0.8, 0.24);
    group.add(eye);
  }

  // Crina em placas.
  for (let i = 0; i < 4; i++) {
    const strand = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.2, 3), mats.trim);
    strand.position.set(0, BASE_TOP + 0.86 - i * 0.15, -0.07 - i * 0.04);
    strand.rotation.x = 0.5 + i * 0.1;
    group.add(strand);
  }

  return group;
}

// Bispo: figura encapuzada com cajado e orbe arcano.
function buildBishop(mats) {
  const group = new THREE.Group();
  group.add(buildPedestal(mats));

  const robe = new THREE.Mesh(new THREE.ConeGeometry(0.21, 0.74, 7), mats.stone);
  robe.position.y = BASE_TOP + 0.37;
  group.add(robe);

  const sash = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.025, 5, 8), mats.trim);
  sash.rotation.x = Math.PI / 2;
  sash.position.y = BASE_TOP + 0.52;
  group.add(sash);

  const hood = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.26, 6), mats.stone);
  hood.position.y = BASE_TOP + 0.87;
  group.add(hood);

  const face = new THREE.Mesh(new THREE.OctahedronGeometry(0.045, 0), mats.glow);
  face.position.set(0, BASE_TOP + 0.81, 0.08);
  group.add(face);

  const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.78, 5), mats.trim);
  staff.position.set(0.2, BASE_TOP + 0.5, 0.04);
  staff.rotation.z = 0.08;
  group.add(staff);

  const crook = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.018, 5, 8, Math.PI * 1.4), mats.trim);
  crook.position.set(0.225, BASE_TOP + 0.92, 0.04);
  crook.rotation.y = Math.PI / 2;
  group.add(crook);

  const orb = new THREE.Mesh(new THREE.OctahedronGeometry(0.055, 0), mats.glow);
  orb.position.set(0.225, BASE_TOP + 0.92, 0.04);
  group.add(orb);

  return group;
}

// Rainha: vestes longas, ombreiras e coroa de espinhos.
function buildQueen(mats) {
  const group = new THREE.Group();
  group.add(buildPedestal(mats));

  const gown = new THREE.Mesh(new THREE.ConeGeometry(0.23, 0.7, 8), mats.stone);
  gown.position.y = BASE_TOP + 0.34;
  group.add(gown);

  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.2, 0.28, 8), mats.stone);
  torso.position.y = BASE_TOP + 0.78;
  group.add(torso);

  const mantle = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.2, 8, 1, true), mats.trim);
  mantle.position.y = BASE_TOP + 0.86;
  mantle.material.side = THREE.DoubleSide;
  group.add(mantle);

  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.135, 0.028, 5, 8), mats.trim);
  collar.rotation.x = Math.PI / 2;
  collar.position.y = BASE_TOP + 0.92;
  group.add(collar);

  const head = new THREE.Mesh(new THREE.IcosahedronGeometry(0.105, 0), mats.stone);
  head.position.y = BASE_TOP + 1.03;
  group.add(head);

  group.add(buildCrown(mats, 0.125, BASE_TOP + 1.13, 7, 0.18, false));

  return group;
}

// Rei: o mais alto, com manto largo e coroa dominante.
function buildKing(mats) {
  const group = new THREE.Group();
  group.add(buildPedestal(mats));

  const cloak = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.6, 8), mats.stone);
  cloak.position.y = BASE_TOP + 0.29;
  group.add(cloak);

  const robe = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.25, 0.52, 8), mats.stone);
  robe.position.y = BASE_TOP + 0.8;
  group.add(robe);

  const pauldrons = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.045, 5, 8), mats.trim);
  pauldrons.rotation.x = Math.PI / 2;
  pauldrons.position.y = BASE_TOP + 1.0;
  group.add(pauldrons);

  const sigil = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.2, 0.04), mats.trim);
  sigil.position.set(0, BASE_TOP + 0.82, 0.18);
  group.add(sigil);

  const sigilGlow = new THREE.Mesh(new THREE.OctahedronGeometry(0.04, 0), mats.glow);
  sigilGlow.position.set(0, BASE_TOP + 0.82, 0.215);
  group.add(sigilGlow);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.14, 8), mats.stone);
  neck.position.y = BASE_TOP + 1.13;
  group.add(neck);

  const head = new THREE.Mesh(new THREE.IcosahedronGeometry(0.12, 0), mats.stone);
  head.position.y = BASE_TOP + 1.28;
  group.add(head);

  group.add(buildCrown(mats, 0.15, BASE_TOP + 1.42, 8, 0.21, true));

  return group;
}

const BUILDERS = {
  p: buildPawn,
  r: buildRook,
  n: buildKnight,
  b: buildBishop,
  q: buildQueen,
  k: buildKing,
};

export function createPieceMesh(type, color) {
  const mats = createMaterials(color);
  const model = BUILDERS[type](mats);

  model.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  });
  model.scale.setScalar(PIECE_SCALE);

  // O invólucro mantém escala 1: é ele que as animações manipulam.
  const piece = new THREE.Group();
  piece.add(model);
  // Peças pretas encaram o lado oposto do tabuleiro.
  piece.rotation.y = color === WHITE ? 0 : Math.PI;
  piece.userData.pieceType = type;
  piece.userData.pieceColor = color;

  return piece;
}
