import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// ─────────────────────────────────────────────────────────────
// Shared GLSL: 3D simplex noise (Ashima Arts / Stefan Gustavson)
// ─────────────────────────────────────────────────────────────
const NOISE_GLSL = /* glsl */ `
vec3 mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

export default function Background3D() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ─────────────────────────────────────────────────────────────
    // Renderer, Scene, Camera
    // ─────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 0, 22);

    // Studio environment map gives metals and glass real reflections
    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTexture = pmrem.fromScene(roomEnv, 0.04).texture;
    scene.environment = envTexture;
    roomEnv.dispose();

    const keyLight = new THREE.DirectionalLight(0xfff1d6, 2.2);
    keyLight.position.set(6, 10, 8);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0xf5c77e, 40, 40, 2);
    rimLight.position.set(-8, -4, 6);
    scene.add(rimLight);

    // ─────────────────────────────────────────────────────────────
    // 1. Animated aurora backdrop (fullscreen shader drawn first, so the
    //    glass objects refract it through the transmission pass)
    // ─────────────────────────────────────────────────────────────
    const bgUniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 },
      uAspect: { value: window.innerWidth / window.innerHeight }
    };
    const bgMaterial = new THREE.ShaderMaterial({
      uniforms: bgUniforms,
      depthWrite: false,
      depthTest: false,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uScroll;
        uniform float uAspect;
        varying vec2 vUv;
        ${NOISE_GLSL}

        float blob(vec2 p, vec2 c, float r) {
          float d = length(p - c);
          return smoothstep(r, 0.0, d);
        }

        void main() {
          vec2 p = vUv;
          p.x *= uAspect;
          float t = uTime * 0.06;

          // Organic warping so the colour fields flow like silk
          vec2 warp = vec2(
            snoise(vec3(p * 1.2, t)),
            snoise(vec3(p * 1.2 + 7.3, t))
          ) * 0.12;
          vec2 q = p + warp;

          vec3 ivory     = vec3(0.984, 0.973, 0.945);
          vec3 champagne = vec3(0.945, 0.835, 0.620);
          vec3 blush     = vec3(0.965, 0.858, 0.800);
          vec3 sand      = vec3(0.925, 0.890, 0.820);
          vec3 sky       = vec3(0.870, 0.900, 0.925);

          vec3 col = ivory;
          vec2 m = vec2(uMouse.x * 0.08 * uAspect, uMouse.y * 0.08);

          col = mix(col, champagne, 0.55 * blob(q, vec2(uAspect * (0.82 + 0.06 * sin(t * 3.0)), 0.78 - uScroll * 0.25) + m, 0.75));
          col = mix(col, blush,     0.45 * blob(q, vec2(uAspect * (0.18 + 0.05 * cos(t * 2.0)), 0.25 + uScroll * 0.2) - m, 0.70));
          col = mix(col, sky,       0.30 * blob(q, vec2(uAspect * 0.55, 0.05 + 0.08 * sin(t * 2.5)) + m * 0.5, 0.65));
          col = mix(col, sand,      0.35 * blob(q, vec2(uAspect * (0.35 + 0.1 * sin(t * 1.7)), 0.95), 0.55));

          // Soft vignette toward edges for depth
          float vig = smoothstep(1.25, 0.35, length(vUv - 0.5) * 1.6);
          col = mix(col * 0.965, col, vig);

          // Fine film grain keeps gradients from banding
          float grain = fract(sin(dot(gl_FragCoord.xy + uTime, vec2(12.9898, 78.233))) * 43758.5453);
          col += (grain - 0.5) * 0.018;

          gl_FragColor = vec4(col, 1.0);
        }
      `
    });
    const bgQuadGeo = new THREE.PlaneGeometry(2, 2);
    const bgQuad = new THREE.Mesh(bgQuadGeo, bgMaterial);
    bgQuad.frustumCulled = false;
    bgQuad.renderOrder = -1;
    scene.add(bgQuad);

    // ─────────────────────────────────────────────────────────────
    // 2. Hero sculpture: liquid-gold morphing orb
    // ─────────────────────────────────────────────────────────────
    const blobUniforms = { uTime: { value: 0 }, uAmp: { value: 0.32 } };
    const blobGeo = new THREE.IcosahedronGeometry(3.1, isMobile ? 28 : 60);
    const blobMat = new THREE.MeshPhysicalMaterial({
      color: 0xd8b26a,
      metalness: 1,
      roughness: 0.16,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      iridescence: 0.35,
      iridescenceIOR: 1.4,
      envMapIntensity: 1.25
    });
    blobMat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = blobUniforms.uTime;
      shader.uniforms.uAmp = blobUniforms.uAmp;
      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          `#include <common>
          uniform float uTime;
          uniform float uAmp;
          ${NOISE_GLSL}
          vec3 displace(vec3 p) {
            vec3 n = normalize(p);
            float d = snoise(n * 1.3 + vec3(uTime * 0.22)) * 0.75
                    + snoise(n * 3.1 - vec3(uTime * 0.17)) * 0.25;
            return n * (length(p) + d * uAmp * 2.2);
          }`
        )
        .replace(
          "#include <beginnormal_vertex>",
          `vec3 _n = normalize(normal);
          vec3 _t = normalize(cross(_n, abs(_n.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
          vec3 _b = normalize(cross(_n, _t));
          vec3 _d0 = displace(position);
          vec3 _d1 = displace(position + _t * 0.02);
          vec3 _d2 = displace(position + _b * 0.02);
          vec3 objectNormal = normalize(cross(_d1 - _d0, _d2 - _d0));
          #ifdef USE_TANGENT
            vec3 objectTangent = vec3(tangent.xyz);
          #endif`
        )
        .replace("#include <begin_vertex>", "vec3 transformed = _d0;");
    };
    const blob = new THREE.Mesh(blobGeo, blobMat);
    scene.add(blob);

    // Delicate orbit rings circling the orb
    const ringGroup = new THREE.Group();
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xc5a059, metalness: 1, roughness: 0.25 });
    const ringGeos = [4.6, 5.4, 6.3].map((r) => new THREE.TorusGeometry(r, 0.025, 8, 160));
    ringGeos.forEach((g, i) => {
      const ring = new THREE.Mesh(g, ringMat);
      ring.rotation.set(Math.PI / 2 + (i - 1) * 0.45, i * 0.6, 0);
      ringGroup.add(ring);
    });
    // Tiny satellite spheres riding the rings
    const satGeo = new THREE.SphereGeometry(0.14, 16, 16);
    const satellites = ringGroup.children.map((ring, i) => {
      const sat = new THREE.Mesh(satGeo, ringMat);
      ring.add(sat);
      return { mesh: sat, radius: ringGeos[i].parameters.radius, speed: 0.35 + i * 0.15, phase: i * 2.1 };
    });
    scene.add(ringGroup);

    // ─────────────────────────────────────────────────────────────
    // 3. Floating glass & gold objects arranged in depth
    // ─────────────────────────────────────────────────────────────
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0.04,
      transmission: 1,
      thickness: 1.4,
      ior: 1.45,
      iridescence: 0.6,
      iridescenceIOR: 1.3,
      envMapIntensity: 1.4,
      transparent: true
    });
    const goldMat = new THREE.MeshPhysicalMaterial({
      color: 0xc9a35a,
      metalness: 1,
      roughness: 0.22,
      clearcoat: 0.6
    });
    const charcoalMat = new THREE.MeshPhysicalMaterial({
      color: 0x2a2620,
      metalness: 0.6,
      roughness: 0.3,
      clearcoat: 1
    });

    const shapeGeos = {
      sphere: new THREE.SphereGeometry(1, 48, 48),
      torus: new THREE.TorusGeometry(0.9, 0.32, 32, 96),
      capsule: new THREE.CapsuleGeometry(0.45, 1.1, 12, 24),
      octa: new THREE.OctahedronGeometry(1, 0),
      knot: new THREE.TorusKnotGeometry(0.7, 0.22, 140, 20)
    };

    const floaterDefs = [
      { geo: "sphere", mat: glassMat, pos: [-11, 5, -4], s: 1.5 },
      { geo: "torus", mat: goldMat, pos: [-7.5, -4.5, 1], s: 1.0 },
      { geo: "capsule", mat: charcoalMat, pos: [-13, -8, -8], s: 1.1 },
      { geo: "octa", mat: goldMat, pos: [11, -7, -3], s: 0.9 },
      { geo: "sphere", mat: glassMat, pos: [13, 7, -9], s: 1.1 },
      { geo: "knot", mat: glassMat, pos: [-4, 9, -12], s: 1.3 },
      { geo: "sphere", mat: goldMat, pos: [5, -10, 2], s: 0.45 },
      { geo: "torus", mat: glassMat, pos: [9, -16, -5], s: 1.3 },
      { geo: "capsule", mat: goldMat, pos: [-10, -18, -2], s: 0.8 },
      { geo: "sphere", mat: charcoalMat, pos: [14, -22, -10], s: 0.9 },
      { geo: "octa", mat: glassMat, pos: [-6, -26, -6], s: 1.4 },
      { geo: "knot", mat: goldMat, pos: [10, -32, -7], s: 0.9 },
      { geo: "sphere", mat: glassMat, pos: [-12, -36, -3], s: 1.6 },
      { geo: "torus", mat: charcoalMat, pos: [4, -42, -9], s: 1.0 }
    ];
    const activeDefs = isMobile ? floaterDefs.filter((_, i) => i % 2 === 0) : floaterDefs;

    const floaters = activeDefs.map((def, i) => {
      const mesh = new THREE.Mesh(shapeGeos[def.geo], def.mat);
      const [x, y, z] = def.pos;
      mesh.position.set(isMobile ? x * 0.6 : x, y, z);
      mesh.scale.setScalar(def.s);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      scene.add(mesh);
      return {
        mesh,
        base: mesh.position.clone(),
        phase: i * 1.37,
        spin: new THREE.Vector3(0.1 + Math.random() * 0.25, 0.1 + Math.random() * 0.3, 0),
        // Closer objects move faster with scroll => true depth parallax
        parallax: THREE.MathUtils.mapLinear(z, -12, 2, 0.6, 1.25)
      };
    });

    // ─────────────────────────────────────────────────────────────
    // 4. Twinkling gold dust
    // ─────────────────────────────────────────────────────────────
    const dustCount = isMobile ? 700 : 1800;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    const dustSeed = new Float32Array(dustCount);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 50;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      dustPos[i * 3 + 2] = -20 + Math.random() * 30;
      dustSeed[i] = Math.random();
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute("aSeed", new THREE.BufferAttribute(dustSeed, 1));
    const dustUniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uPixelRatio: { value: renderer.getPixelRatio() }
    };
    const dustMat = new THREE.ShaderMaterial({
      uniforms: dustUniforms,
      transparent: true,
      depthWrite: false,
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform float uScroll;
        uniform float uPixelRatio;
        attribute float aSeed;
        varying float vAlpha;
        void main() {
          vec3 p = position;
          p.x += sin(uTime * 0.2 + aSeed * 30.0) * 0.6;
          // Endless vertical drift that also follows the scroll
          p.y = mod(p.y + uTime * (0.15 + aSeed * 0.25) + uScroll * 6.0 + 20.0, 40.0) - 20.0;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = (1.2 + aSeed * 2.6) * uPixelRatio * (24.0 / -mv.z);
          vAlpha = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * (1.0 + aSeed * 2.0) + aSeed * 50.0));
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.0, d);
          vec3 gold = vec3(0.78, 0.60, 0.30);
          gl_FragColor = vec4(gold, a * vAlpha * 0.75);
        }
      `
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // ─────────────────────────────────────────────────────────────
    // 5. Mouse & scroll interaction
    // ─────────────────────────────────────────────────────────────
    const mouse = new THREE.Vector2(0, 0);
    const smoothMouse = new THREE.Vector2(0, 0);
    let mouseEnergy = 0;
    let scrollTarget = window.scrollY;
    let scrollCurrent = window.scrollY;

    const handleMouseMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseEnergy = Math.min(mouseEnergy + Math.hypot(nx - mouse.x, ny - mouse.y) * 1.5, 1);
      mouse.set(nx, ny);
    };
    const handleScroll = () => {
      scrollTarget = window.scrollY;
    };
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      bgUniforms.uAspect.value = w / h;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    // ─────────────────────────────────────────────────────────────
    // 6. Animation loop (paused while the tab is hidden)
    // ─────────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let elapsed = 0;
    let frameId = null;
    const timeScale = reduceMotion ? 0.15 : 1;

    const renderFrame = () => {
      const delta = Math.min(clock.getDelta(), 0.05);
      elapsed += delta * timeScale;

      smoothMouse.lerp(mouse, 0.05);
      mouseEnergy *= 0.95;
      scrollCurrent += (scrollTarget - scrollCurrent) * 0.08;

      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const progress = THREE.MathUtils.clamp(scrollCurrent / maxScroll, 0, 1);
      const scrollUnits = scrollCurrent / window.innerHeight; // viewports scrolled

      // Backdrop
      bgUniforms.uTime.value = elapsed;
      bgUniforms.uMouse.value.copy(smoothMouse);
      bgUniforms.uScroll.value = progress;

      // Camera: gentle parallax from the cursor
      camera.position.x = smoothMouse.x * 1.6;
      camera.position.y = smoothMouse.y * 1.0;
      camera.lookAt(0, 0, 0);

      // Orb: sits beside the hero copy, then glides back and weaves between sections
      const heroX = isMobile ? 0 : 6.8;
      const weave = Math.sin(progress * Math.PI * 3) * (isMobile ? 2 : 8);
      const t1 = THREE.MathUtils.smoothstep(scrollUnits, 0, 1.2);
      blob.position.x = THREE.MathUtils.lerp(heroX, weave, t1);
      blob.position.y = (isMobile ? 4.5 : 0.6) + Math.sin(elapsed * 0.6) * 0.35 - t1 * 1.5;
      blob.position.z = THREE.MathUtils.lerp(isMobile ? -4 : 0, -10, t1);
      blob.scale.setScalar(isMobile ? 0.7 : 1);
      blob.rotation.y = elapsed * 0.12 + smoothMouse.x * 0.6 + progress * 4;
      blob.rotation.x = smoothMouse.y * -0.4 + progress * 2;
      blobUniforms.uTime.value = elapsed;
      blobUniforms.uAmp.value = 0.3 + mouseEnergy * 0.25 + Math.abs(scrollTarget - scrollCurrent) * 0.0006;

      ringGroup.position.copy(blob.position);
      ringGroup.scale.copy(blob.scale);
      ringGroup.rotation.y = elapsed * 0.18 + progress * 3;
      ringGroup.rotation.z = Math.sin(elapsed * 0.25) * 0.15;
      satellites.forEach((s) => {
        const a = elapsed * s.speed + s.phase;
        s.mesh.position.set(Math.cos(a) * s.radius, Math.sin(a) * s.radius, 0);
      });

      rimLight.position.set(blob.position.x - 8, blob.position.y - 3, blob.position.z + 7);

      // Floaters: bob, spin, and scroll past at depth-based speeds
      floaters.forEach((f) => {
        f.mesh.position.x = f.base.x + Math.sin(elapsed * 0.4 + f.phase) * 0.6 - smoothMouse.x * f.parallax * 0.8;
        f.mesh.position.y =
          f.base.y + Math.sin(elapsed * 0.7 + f.phase) * 0.5 + scrollUnits * 9 * f.parallax;
        f.mesh.rotation.x += f.spin.x * delta * timeScale;
        f.mesh.rotation.y += f.spin.y * delta * timeScale;
      });

      // Dust
      dustUniforms.uTime.value = elapsed;
      dustUniforms.uScroll.value = scrollUnits;
      dust.rotation.y = smoothMouse.x * 0.05;

      renderer.render(scene, camera);
    };

    const loop = () => {
      renderFrame();
      frameId = requestAnimationFrame(loop);
    };
    const handleVisibility = () => {
      if (document.hidden) {
        if (frameId !== null) cancelAnimationFrame(frameId);
        frameId = null;
      } else if (frameId === null) {
        clock.getDelta();
        loop();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    loop();

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      [bgQuadGeo, blobGeo, satGeo, dustGeo, ...ringGeos, ...Object.values(shapeGeos)].forEach((g) => g.dispose());
      [bgMaterial, blobMat, ringMat, glassMat, goldMat, charcoalMat, dustMat].forEach((m) => m.dispose());
      envTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden"
      }}
      aria-hidden="true"
    />
  );
}
