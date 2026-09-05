/**
 * i3Codex Four-Layer Architecture 3D Visualizer
 * Built with Three.js (r128)
 * Renders the 4 architectural layers (Edge, Services, Pipelines, Data)
 * with interactive hover inspection, laser scanning line, and exploded stack animations.
 */

(function () {
  'use strict';

  function initStack3D() {
    const container = document.getElementById('stack-3d-canvas-box');
    if (!container || typeof THREE === 'undefined') return;

    let width = container.clientWidth || 420;
    let height = container.clientHeight || 400;

    // Scene & Orthographic / Low-FOV Perspective Camera for isometric feel
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000);
    camera.position.set(6, 6, 7.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Group containing the entire stack
    const stackGroup = new THREE.Group();
    scene.add(stackGroup);

    // Layer definitions (top to bottom: Experience, Intelligence, Services & Web3, Security & Cloud)
    const layerConfigs = [
      { id: 'experience', name: 'Experience', color: 0x08C4DE, emissive: 0x066573, yBase: 1.2, desc: 'Mobile iOS/Android & Web Frontend' },
      { id: 'intelligence', name: 'Intelligence', color: 0xFFFFFF, emissive: 0x111111, yBase: 0.4, desc: 'AI/ML Agents & LLM Pipelines' },
      { id: 'services', name: 'Services & Web3', color: 0xE8E3D8, emissive: 0x1A1815, yBase: -0.4, desc: 'Microservices & Smart Contracts' },
      { id: 'security', name: 'Security & Cloud', color: 0x1B5FB8, emissive: 0x0C3366, yBase: -1.2, desc: 'DevSecOps & Zero-Trust Infrastructure' }
    ];

    const slabMeshes = [];
    const slabGroup = new THREE.Group();
    stackGroup.add(slabGroup);

    // Create 4 slabs
    layerConfigs.forEach((cfg, idx) => {
      const slabGeom = new THREE.BoxGeometry(3.2, 0.14, 3.2);

      // Material
      const slabMat = new THREE.MeshPhysicalMaterial({
        color: cfg.color,
        emissive: cfg.emissive,
        emissiveIntensity: 0.15,
        roughness: 0.25,
        metalness: 0.1,
        transparent: true,
        opacity: idx === 0 || idx === 3 ? 0.75 : 0.92,
        clearcoat: 0.3
      });

      const mesh = new THREE.Mesh(slabGeom, slabMat);
      mesh.position.y = cfg.yBase;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { config: cfg, index: idx, basePosY: cfg.yBase };

      // Add blueprint edges
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(slabGeom),
        new THREE.LineBasicMaterial({
          color: idx === 0 ? 0x08C4DE : idx === 3 ? 0x1B5FB8 : 0x9AA0A8,
          transparent: true,
          opacity: 0.8
        })
      );
      mesh.add(edges);

      slabGroup.add(mesh);
      slabMeshes.push(mesh);
    });

    // Laser Scan Line
    const scanGeom = new THREE.PlaneGeometry(3.6, 0.04);
    const scanMat = new THREE.MeshBasicMaterial({
      color: 0x08C4DE,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    const scanLine = new THREE.Mesh(scanGeom, scanMat);
    scanLine.rotation.x = Math.PI / 2;
    stackGroup.add(scanLine);

    // Subtle Ground Shadow
    const shadowGeom = new THREE.PlaneGeometry(4.2, 4.2);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x16181C,
      transparent: true,
      opacity: 0.08
    });
    const shadowMesh = new THREE.Mesh(shadowGeom, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -2.2;
    scene.add(shadowMesh);

    // Lights
    const ambLight = new THREE.AmbientLight(0xFFFFFF, 0.9);
    scene.add(ambLight);

    const dirLight = new THREE.DirectionalLight(0xFFFAF0, 1.2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const cyanPointLight = new THREE.PointLight(0x08C4DE, 1.5, 6);
    cyanPointLight.position.set(0, 2.5, 0);
    scene.add(cyanPointLight);

    // Isometric tilt matching design
    stackGroup.rotation.y = -Math.PI / 4;
    stackGroup.rotation.x = 0.35;

    // Interaction state
    let activeLayerIndex = -1;
    let scanDirection = 1;
    let scanY = 1.6;

    // Hover from DOM list items
    const domLayerItems = document.querySelectorAll('.layer-item');
    domLayerItems.forEach((item, index) => {
      item.addEventListener('mouseenter', () => highlightLayer(index));
      item.addEventListener('click', () => highlightLayer(index));
      item.addEventListener('mouseleave', () => resetHighlight());
    });

    function highlightLayer(index) {
      activeLayerIndex = index;
      domLayerItems.forEach((el, i) => {
        el.classList.toggle('active', i === index);
      });
    }

    function resetHighlight() {
      activeLayerIndex = -1;
      domLayerItems.forEach(el => el.classList.remove('active'));
    }

    // Raycaster for 3D canvas interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    renderer.domElement.addEventListener('mousemove', (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(slabMeshes);
      if (intersects.length > 0) {
        const hitMesh = intersects[0].object;
        highlightLayer(hitMesh.userData.index);
      } else if (activeLayerIndex !== -1) {
        // Only reset if mouse left
      }
    });

    // Animation Loop
    let clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Ambient 15s gentle float
      stackGroup.position.y = Math.sin((time / 15) * Math.PI * 2) * 0.15;

      // Laser scan up and down
      scanY += scanDirection * delta * 0.8;
      if (scanY > 1.8) {
        scanY = 1.8;
        scanDirection = -1;
      } else if (scanY < -1.8) {
        scanY = -1.8;
        scanDirection = 1;
      }
      scanLine.position.y = scanY;

      // Slabs explosion / highlight interpolation
      slabMeshes.forEach((mesh, idx) => {
        let targetY = mesh.userData.basePosY;
        let targetScale = 1.0;

        if (activeLayerIndex === idx) {
          // Explode out and lift active layer
          targetY += (idx === 0 ? 0.35 : idx === 1 ? 0.2 : idx === 2 ? -0.2 : -0.35);
          targetScale = 1.04;
          mesh.material.emissiveIntensity = 0.55;
        } else if (activeLayerIndex !== -1) {
          mesh.material.emissiveIntensity = 0.08;
          targetScale = 0.98;
        } else {
          mesh.material.emissiveIntensity = 0.15;
        }

        mesh.position.y += (targetY - mesh.position.y) * 0.1;
        mesh.scale.set(targetScale, 1.0, targetScale);
      });

      // Subtle slow rotation
      stackGroup.rotation.y = -Math.PI / 4 + Math.sin(time * 0.4) * 0.08;

      renderer.render(scene, camera);
    }

    animate();

    // Resize
    window.addEventListener('resize', () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStack3D);
  } else {
    initStack3D();
  }
})();
