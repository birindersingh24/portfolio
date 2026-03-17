import { useEffect, useRef } from "react";
import * as THREE from "three";

const BlobScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const w = mount.clientWidth || 520;
    const h = mount.clientHeight || 520;

    // ── Scene setup ────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ── Morphing blob geometry ─────────────────────────────────
    const geo = new THREE.IcosahedronGeometry(1.8, 4);
    const originalPos = new Float32Array(geo.attributes.position.array);

    // Inner solid — dark navy with cyan specular
    const solidMat = new THREE.MeshPhongMaterial({
      color: 0x070f24,
      shininess: 90,
      specular: new THREE.Color(0x00d4ff),
      transparent: true,
      opacity: 0.92,
    });

    // Wireframe overlay — cyan
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });

    const solidMesh = new THREE.Mesh(geo, solidMat);
    const wireMesh = new THREE.Mesh(geo, wireMat);
    scene.add(solidMesh);
    scene.add(wireMesh);

    // ── Lighting ───────────────────────────────────────────────
    const keyLight = new THREE.PointLight(0x00d4ff, 4, 20);
    keyLight.position.set(3, 3, 5);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x0066ff, 2, 15);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    scene.add(new THREE.AmbientLight(0x001133, 0.8));

    // ── Floating particles ─────────────────────────────────────
    const particleCount = 280;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      pPos[i] = (Math.random() - 0.5) * 14;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x00d4ff,
      size: 0.022,
      transparent: true,
      opacity: 0.45,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ── Mouse tracking ─────────────────────────────────────────
    let targetX = 0;
    let targetY = 0;
    const onMouseMove = (e: MouseEvent) => {
      targetX = ((e.clientX / window.innerWidth) - 0.5) * 1.4;
      targetY = -((e.clientY / window.innerHeight) - 0.5) * 1.4;
    };
    window.addEventListener("mousemove", onMouseMove);

    // ── Animation loop ─────────────────────────────────────────
    let time = 0;
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.005;

      // Vertex morphing — overlapping sine waves for organic feel
      const pos = geo.attributes.position.array as Float32Array;
      for (let i = 0; i < pos.length; i += 3) {
        const x0 = originalPos[i];
        const y0 = originalPos[i + 1];
        const z0 = originalPos[i + 2];
        const len = Math.sqrt(x0 * x0 + y0 * y0 + z0 * z0);

        const wave =
          Math.sin(x0 * 2.8 + time * 1.4) *
            Math.cos(y0 * 2.8 + time * 0.9) *
            Math.sin(z0 * 2.8 + time * 1.1) * 0.2 +
          Math.sin(x0 * 1.4 - time * 0.8) *
            Math.cos(z0 * 1.6 + time * 1.3) * 0.12 +
          Math.cos(y0 * 3.2 + time * 0.6) * 0.06;

        pos[i] = x0 + (x0 / len) * wave;
        pos[i + 1] = y0 + (y0 / len) * wave;
        pos[i + 2] = z0 + (z0 / len) * wave;
      }
      geo.attributes.position.needsUpdate = true;
      geo.computeVertexNormals();

      // Smooth mouse-reactive rotation
      wireMesh.rotation.x += (targetY - wireMesh.rotation.x) * 0.04;
      wireMesh.rotation.y += (targetX - wireMesh.rotation.y) * 0.04;
      wireMesh.rotation.y += 0.0025; // subtle auto-spin
      solidMesh.rotation.copy(wireMesh.rotation);

      // Slow particle drift
      particles.rotation.y += 0.0004;
      particles.rotation.x += 0.0002;

      renderer.render(scene, camera);
    };

    animate();

    // ── Resize handler ─────────────────────────────────────────
    const onResize = () => {
      const nw = mount.clientWidth;
      const nh = mount.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
};

export default BlobScene;
