import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { WHITE, BLACK } from '../chess/moveGen.js';
import { disposeObject } from './animation.js';

// Os adereços do cenário são estáticos: juntar tudo num mesh só por material
// derruba centenas de draw calls sem mudar nada visualmente.
function mergeInto(group, geometries, material, { shadows = true } = {}) {
  if (!geometries.length) return null;
  const merged = mergeGeometries(geometries, false);
  geometries.forEach((geometry) => geometry.dispose());
  const mesh = new THREE.Mesh(merged, material);
  mesh.receiveShadow = shadows;
  group.add(mesh);
  return mesh;
}

function placed(geometry, { position, rotation, scale }) {
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion().setFromEuler(rotation ?? new THREE.Euler());
  matrix.compose(
    position ?? new THREE.Vector3(),
    quaternion,
    scale ?? new THREE.Vector3(1, 1, 1),
  );
  return geometry.applyMatrix4(matrix);
}

const ORDER_COLOR = 0xff8c33;
const RUIN_COLOR = 0xd946ef;

const GROUND_Y = -1.7;
const PLATFORM_TOP = -0.5;

function stoneMaterial(color, roughness = 0.95) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.08, flatShading: true });
}

// Para o que está longe e quase preto, sombreamento barato basta.
function distantMaterial(color) {
  return new THREE.MeshLambertMaterial({ color, flatShading: true });
}

// Plataforma octogonal em dois degraus, sob o tabuleiro.
function buildPlatform(group) {
  const tiers = [
    { radius: 6.6, height: 0.5, y: PLATFORM_TOP - 0.25, color: 0x2a2830 },
    { radius: 7.6, height: 0.5, y: PLATFORM_TOP - 0.72, color: 0x211f27 },
    { radius: 8.8, height: 0.6, y: PLATFORM_TOP - 1.25, color: 0x1a181e },
  ];

  for (const tier of tiers) {
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(tier.radius, tier.radius + 0.25, tier.height, 8),
      stoneMaterial(tier.color),
    );
    mesh.position.y = tier.y;
    mesh.rotation.y = Math.PI / 8;
    mesh.receiveShadow = true;
    group.add(mesh);
  }

  // Blocos soltos na borda, para a silhueta não ficar perfeita demais.
  const blocks = [];
  for (let i = 0; i < 22; i++) {
    const angle = (i / 22) * Math.PI * 2 + Math.random() * 0.1;
    const radius = 6.9 + Math.random() * 0.5;
    const size = 0.35 + Math.random() * 0.4;
    blocks.push(
      placed(new THREE.BoxGeometry(size, size * 0.6, size * 0.8), {
        position: new THREE.Vector3(
          Math.cos(angle) * radius,
          PLATFORM_TOP - 0.18 - Math.random() * 0.1,
          Math.sin(angle) * radius,
        ),
        rotation: new THREE.Euler(Math.random() * 0.2, angle + Math.random(), Math.random() * 0.2),
      }),
    );
  }
  mergeInto(group, blocks, stoneMaterial(0x26242c));
}

// Campo de batalha: chão escuro, escombros e ruínas ao longe.
function buildBattlefield(group) {
  // O raio acompanha o alcance da névoa: além disso nada é visível.
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(42, 14),
    distantMaterial(0x151219),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = GROUND_Y;
  group.add(ground);

  const debrisMaterial = distantMaterial(0x1d1a21);
  const spearMaterial = distantMaterial(0x4a3f2e);

  const spears = [];
  const rocks = [];

  for (let i = 0; i < 46; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 10 + Math.random() * 20;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    if (Math.random() < 0.45) {
      // Lanças fincadas, tortas.
      spears.push(
        placed(new THREE.CylinderGeometry(0.04, 0.06, 1.6 + Math.random() * 1.4, 4), {
          position: new THREE.Vector3(x, GROUND_Y + 0.8, z),
          rotation: new THREE.Euler(
            (Math.random() - 0.5) * 0.7,
            Math.random() * Math.PI,
            (Math.random() - 0.5) * 0.7,
          ),
        }),
      );
    } else {
      const size = 0.5 + Math.random() * 1.6;
      rocks.push(
        placed(new THREE.IcosahedronGeometry(size, 0), {
          position: new THREE.Vector3(x, GROUND_Y + size * 0.35, z),
          rotation: new THREE.Euler(Math.random(), Math.random(), Math.random()),
          scale: new THREE.Vector3(1, 0.5 + Math.random() * 0.4, 1),
        }),
      );
    }
  }

  mergeInto(group, spears, spearMaterial);
  mergeInto(group, rocks, debrisMaterial);

  // Muralhas arruinadas na linha do horizonte.
  const walls = [];
  for (let i = 0; i < 14; i++) {
    const angle = (i / 14) * Math.PI * 2 + Math.random() * 0.2;
    const radius = 30 + Math.random() * 8;
    const height = 3 + Math.random() * 7;
    walls.push(
      placed(new THREE.BoxGeometry(3 + Math.random() * 5, height, 1.2), {
        position: new THREE.Vector3(
          Math.cos(angle) * radius,
          GROUND_Y + height / 2,
          Math.sin(angle) * radius,
        ),
        rotation: new THREE.Euler(0, -angle + (Math.random() - 0.5) * 0.4, 0),
      }),
    );
  }
  mergeInto(group, walls, distantMaterial(0x121016), { shadows: false });
}

// Névoa baixa: discos translúcidos girando devagar junto ao chão.
function buildGroundFog(group) {
  // Poucas camadas e raios contidos: discos transparentes grandes e
  // sobrepostos são caros em preenchimento, sobretudo em GPU integrada.
  const layers = [];
  const texture = null;
  for (let i = 0; i < 4; i++) {
    const material = new THREE.MeshBasicMaterial({
      color: 0x6f6a8a,
      transparent: true,
      opacity: 0.08 + Math.random() * 0.06,
      depthWrite: false,
      side: THREE.DoubleSide,
      map: texture,
    });
    const radius = 8 + Math.random() * 5;
    const disc = new THREE.Mesh(new THREE.CircleGeometry(radius, 9), material);
    disc.rotation.x = -Math.PI / 2;
    disc.position.set(
      (Math.random() - 0.5) * 6,
      GROUND_Y + 0.35 + i * 0.3,
      (Math.random() - 0.5) * 6,
    );
    disc.renderOrder = -1;
    group.add(disc);
    layers.push({ disc, material, speed: (Math.random() - 0.5) * 0.06, baseOpacity: material.opacity });
  }
  return layers;
}

// Tochas: poste, braseiro, chama facetada e luz que treme.
function buildTorches(group) {
  const torches = [];
  const poleMaterial = stoneMaterial(0x272129, 0.8);
  const bowlMaterial = new THREE.MeshStandardMaterial({
    color: 0x6b5a33,
    roughness: 0.5,
    metalness: 0.85,
    flatShading: true,
  });

  const spots = [
    [5.4, 5.4],
    [-5.4, 5.4],
    [5.4, -5.4],
    [-5.4, -5.4],
  ];

  for (const [x, z] of spots) {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.16, 2.4, 6), poleMaterial);
    pole.position.set(x, PLATFORM_TOP + 1.2, z);
    pole.castShadow = true;
    group.add(pole);

    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.16, 0.34, 8), bowlMaterial);
    bowl.position.set(x, PLATFORM_TOP + 2.5, z);
    group.add(bowl);

    const flameMaterial = new THREE.MeshBasicMaterial({
      color: 0xffb257,
      transparent: true,
      opacity: 0.92,
      toneMapped: false,
    });
    const flame = new THREE.Mesh(new THREE.IcosahedronGeometry(0.26, 0), flameMaterial);
    flame.position.set(x, PLATFORM_TOP + 2.82, z);
    flame.scale.y = 1.6;
    group.add(flame);

    const light = new THREE.PointLight(0xff9a3c, 14, 16, 2);
    light.position.set(x, PLATFORM_TOP + 2.9, z);
    group.add(light);

    torches.push({ flame, flameMaterial, light, phase: Math.random() * Math.PI * 2 });
  }

  return torches;
}

// Bandeiras dos dois exércitos, com pano ondulando.
function buildBanners(group) {
  const banners = [];
  const poleMaterial = new THREE.MeshStandardMaterial({
    color: 0x3b3128,
    roughness: 0.7,
    metalness: 0.3,
    flatShading: true,
  });

  // Nos flancos: os jogadores olham o tabuleiro pelo eixo Z, que fica livre.
  const spots = [
    { x: -7, z: -2.2, color: WHITE },
    { x: 7, z: -2.2, color: WHITE },
    { x: -7, z: 2.2, color: BLACK },
    { x: 7, z: 2.2, color: BLACK },
  ];

  for (const spot of spots) {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 3.4, 5), poleMaterial);
    pole.position.set(spot.x, PLATFORM_TOP + 1.7, spot.z);
    pole.castShadow = true;
    group.add(pole);

    const finial = new THREE.Mesh(new THREE.OctahedronGeometry(0.12, 0), poleMaterial);
    finial.position.set(spot.x, PLATFORM_TOP + 3.5, spot.z);
    group.add(finial);

    const isOrder = spot.color === WHITE;
    const cloth = new THREE.Mesh(
      new THREE.PlaneGeometry(0.95, 1.5, 6, 8),
      new THREE.MeshStandardMaterial({
        color: isOrder ? 0x4a3418 : 0x2c1030,
        emissive: isOrder ? 0x3a1e05 : 0x2a0630,
        emissiveIntensity: 0.6,
        roughness: 0.9,
        side: THREE.DoubleSide,
        flatShading: true,
      }),
    );
    const inward = spot.x > 0 ? -1 : 1;
    cloth.position.set(spot.x + inward * 0.5, PLATFORM_TOP + 2.5, spot.z);
    cloth.rotation.y = Math.PI / 2;
    cloth.castShadow = true;
    group.add(cloth);

    // Emblema simples no centro do pano.
    const emblem = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.22, 0),
      new THREE.MeshBasicMaterial({ color: isOrder ? ORDER_COLOR : RUIN_COLOR, toneMapped: false }),
    );
    emblem.position.set(cloth.position.x, PLATFORM_TOP + 2.5, spot.z);
    emblem.scale.set(0.3, 1.2, 0.85);
    group.add(emblem);

    banners.push({
      cloth,
      emblem,
      basePositions: cloth.geometry.attributes.position.array.slice(),
      grip: inward,
      phase: Math.random() * Math.PI * 2,
    });
  }

  return banners;
}

// Poeira suspensa sobre o tabuleiro.
function buildDust(group) {
  const count = 420;
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 18;
    positions[i * 3 + 1] = Math.random() * 7 - 1;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
    speeds[i] = 0.05 + Math.random() * 0.12;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xb3a892,
    size: 0.045,
    transparent: true,
    opacity: 0.4,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geometry, material);
  group.add(points);
  return { points, geometry, material, speeds, count };
}

// Chuva leve: segmentos verticais que caem e reciclam.
function buildRain(group) {
  const count = 700;
  const positions = new Float32Array(count * 6);
  const speeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 26;
    const y = Math.random() * 16;
    const z = (Math.random() - 0.5) * 26;
    const length = 0.25 + Math.random() * 0.3;
    positions[i * 6] = x;
    positions[i * 6 + 1] = y;
    positions[i * 6 + 2] = z;
    positions[i * 6 + 3] = x;
    positions[i * 6 + 4] = y - length;
    positions[i * 6 + 5] = z;
    speeds[i] = 9 + Math.random() * 7;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.LineBasicMaterial({
    color: 0x9fb0cc,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });

  const rain = new THREE.LineSegments(geometry, material);
  rain.visible = false;
  group.add(rain);
  return { rain, geometry, material, speeds, count };
}

export function createEnvironment({ scene, lights }) {
  const group = new THREE.Group();
  scene.add(group);

  buildPlatform(group);
  buildBattlefield(group);
  const fogLayers = buildGroundFog(group);
  const torches = buildTorches(group);
  const banners = buildBanners(group);
  const dust = buildDust(group);
  const rain = buildRain(group);

  // Guarda os valores iniciais para o clima poder evoluir a partir deles.
  const base = {
    ambient: lights.ambient.intensity,
    hemi: lights.hemi.intensity,
    key: lights.key.intensity,
    fill: lights.fill.intensity,
    fogDensity: scene.fog ? scene.fog.density : 0.035,
    background: scene.background ? scene.background.clone() : new THREE.Color(0x05050a),
  };
  const darkBackground = new THREE.Color(0x02020a);

  let progress = 0;
  let rainLevel = 0;
  let elapsed = 0;

  // progress: 0 no início da partida, 1 quando o massacre já aconteceu.
  function setProgress(value) {
    progress = Math.min(1, Math.max(0, value));
    // A chuva só entra na reta final.
    rainLevel = Math.min(1, Math.max(0, (progress - 0.55) / 0.45));

    lights.ambient.intensity = base.ambient * (1 - 0.45 * progress);
    lights.hemi.intensity = base.hemi * (1 - 0.6 * progress);
    lights.key.intensity = base.key * (1 - 0.55 * progress);
    lights.fill.intensity = base.fill * (1 - 0.5 * progress);

    if (scene.fog) scene.fog.density = base.fogDensity + 0.028 * progress;
    if (scene.background?.copy) {
      scene.background.copy(base.background).lerp(darkBackground, progress);
    }

    for (const torch of torches) {
      // As tochas ganham peso relativo conforme o resto escurece.
      torch.light.distance = 16 + progress * 5;
      torch.baseIntensity = 14 + progress * 10;
    }

    rain.material.opacity = rainLevel * 0.32;
    rain.rain.visible = rainLevel > 0.01;

    dust.material.opacity = 0.4 * (1 - rainLevel * 0.7);
  }

  function update(dt) {
    elapsed += dt;

    for (const layer of fogLayers) {
      layer.disc.rotation.z += layer.speed * dt;
      layer.material.opacity =
        layer.baseOpacity * (0.75 + 0.25 * Math.sin(elapsed * 0.3 + layer.speed * 10)) * (1 + progress * 0.8);
    }

    for (const torch of torches) {
      const flicker = 0.78 + Math.random() * 0.22 + Math.sin(elapsed * 9 + torch.phase) * 0.08;
      torch.light.intensity = (torch.baseIntensity ?? 14) * flicker;
      torch.flame.scale.set(0.9 + flicker * 0.18, 1.35 + flicker * 0.4, 0.9 + flicker * 0.18);
      torch.flame.rotation.y += dt * 1.6;
      torch.flameMaterial.opacity = 0.8 + flicker * 0.18;
    }

    for (const banner of banners) {
      const position = banner.cloth.geometry.attributes.position;
      const array = position.array;
      for (let i = 0; i < array.length; i += 3) {
        const x = banner.basePositions[i];
        const y = banner.basePositions[i + 1];
        // O pano ondula mais na ponta livre, longe do mastro.
        // Ondula mais na ponta solta, longe do mastro.
        const grip = (x * banner.grip + 0.48) / 0.95;
        array[i + 2] =
          Math.sin(elapsed * 2.4 + x * 3 + banner.phase) * 0.14 * grip +
          Math.sin(elapsed * 1.3 + y * 2) * 0.05 * grip;
      }
      position.needsUpdate = true;
      banner.emblem.position.x =
        banner.cloth.position.x + Math.sin(elapsed * 2.4 + banner.phase) * 0.07;
    }

    const dustArray = dust.geometry.attributes.position.array;
    for (let i = 0; i < dust.count; i++) {
      const index = i * 3;
      dustArray[index + 1] += dust.speeds[i] * dt;
      dustArray[index] += Math.sin(elapsed * 0.4 + i) * 0.004;
      if (dustArray[index + 1] > 6.5) {
        dustArray[index + 1] = -1;
        dustArray[index] = (Math.random() - 0.5) * 18;
        dustArray[index + 2] = (Math.random() - 0.5) * 18;
      }
    }
    dust.geometry.attributes.position.needsUpdate = true;

    if (rain.rain.visible) {
      const rainArray = rain.geometry.attributes.position.array;
      for (let i = 0; i < rain.count; i++) {
        const index = i * 6;
        const fall = rain.speeds[i] * dt;
        rainArray[index + 1] -= fall;
        rainArray[index + 4] -= fall;
        if (rainArray[index + 4] < GROUND_Y) {
          const x = (Math.random() - 0.5) * 26;
          const z = (Math.random() - 0.5) * 26;
          const length = 0.25 + Math.random() * 0.3;
          rainArray[index] = x;
          rainArray[index + 1] = 15 + Math.random() * 3;
          rainArray[index + 2] = z;
          rainArray[index + 3] = x;
          rainArray[index + 4] = rainArray[index + 1] - length;
          rainArray[index + 5] = z;
        }
      }
      rain.geometry.attributes.position.needsUpdate = true;
    }
  }

  function dispose() {
    disposeObject(group);
    lights.ambient.intensity = base.ambient;
    lights.hemi.intensity = base.hemi;
    lights.key.intensity = base.key;
    lights.fill.intensity = base.fill;
    if (scene.fog) scene.fog.density = base.fogDensity;
  }

  setProgress(0);

  return {
    setProgress,
    update,
    dispose,
    group,
    get progress() {
      return progress;
    },
    get rainLevel() {
      return rainLevel;
    },
  };
}
