/**
 * i3Codex Hero 3D Interactive Solid
 * Built with Three.js (r128)
 * Implements the precision hexagonal solid from Main.dc.html with real-time WebGL,
 * mouse parallax, wireframe toggling, and interior glowing gradient core.
 */

(function () {
  'use strict';

  function initHero3D() {
    const container = document.getElementById('hero-3d-stage');
    if (!container || typeof THREE === 'undefined') return;

    // Dimensions
    let width = container.clientWidth || 400;
    let height = container.clientHeight || 400;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    // Append canvas
    container.innerHTML = '';
    renderer.domElement.className = 'stage-3d-canvas';
    container.appendChild(renderer.domElement);

    // Controls UI overlay
    const controlsBar = document.createElement('div');
    controlsBar.className = 'stage-3d-controls';
    controlsBar.innerHTML = `
      <button type="button" class="stage-ctrl-btn active" id="btn-toggle-rotate" title="Toggle Auto Rotation">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
        Spin
      </button>
      <button type="button" class="stage-ctrl-btn" id="btn-toggle-wire" title="Toggle Blueprint Wireframe">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V3"/></svg>
        Wireframe
      </button>
      <button type="button" class="stage-ctrl-btn" id="btn-reset-cam" title="Reset View">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        Reset
      </button>
    `;
    container.appendChild(controlsBar);

    // Group for object rotation & floating
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Solid Group (Hexagonal Prism)
    const solidGroup = new THREE.Group();
    rootGroup.add(solidGroup);

    // 1. Hexagonal Prism Outer Shell
    // Radius top, bottom: 1.4, height: 3.2, radial segments: 6
    const hexGeometry = new THREE.CylinderGeometry(1.35, 1.35, 3.2, 6, 1, false);
    
    // Satin ceramic architectural material
    const solidMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xF7F4EE,
      metalness: 0.08,
      roughness: 0.35,
      clearcoat: 0.25,
      clearcoatRoughness: 0.15,
      transmission: 0.15, // subtle translucency
      opacity: 0.96,
      transparent: true
    });

    const hexMesh = new THREE.Mesh(hexGeometry, solidMaterial);
    solidGroup.add(hexMesh);

    // 2. Blueprint Edges
    const edgesGeometry = new THREE.EdgesGeometry(hexGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({
      color: 0x0B6E86,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.65
    });
    const edgesMesh = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    solidGroup.add(edgesMesh);

    // 3. Interior Energy Core (Glowing Cyan-to-Blue Filament)
    const coreGeometry = new THREE.CylinderGeometry(0.045, 0.045, 2.7, 16);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x08C4DE
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    solidGroup.add(coreMesh);

    // Point lights for the core glow
    const coreLightCyan = new THREE.PointLight(0x08C4DE, 1.8, 4);
    coreLightCyan.position.set(0, 0.8, 0);
    solidGroup.add(coreLightCyan);

    const coreLightBlue = new THREE.PointLight(0x287AED, 1.6, 4);
    coreLightBlue.position.set(0, -0.8, 0);
    solidGroup.add(coreLightBlue);

    // 4. Subtle Ambient Particle Halo (Data packets)
    const particleCount = 48;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.6 + Math.random() * 0.9;
      particlePositions[i] = Math.cos(angle) * radius;
      particlePositions[i + 1] = (Math.random() - 0.5) * 3.4;
      particlePositions[i + 2] = Math.sin(angle) * radius;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x1B5FB8,
      size: 0.05,
      transparent: true,
      opacity: 0.75
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    rootGroup.add(particles);

    // 5. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xFFFAF2, 1.4);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xCCE5FF, 0.7);
    fillLight.position.set(-5, -3, -4);
    scene.add(fillLight);

    // Initial orientation matching Main.dc.html: rotateX(-16deg) rotateY(-26deg)
    const baseRotX = -16 * (Math.PI / 180);
    const baseRotY = -26 * (Math.PI / 180);
    solidGroup.rotation.set(baseRotX, baseRotY, 0);

    // State
    let isAutoRotating = true;
    let isWireframe = false;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    // Mouse Tracking / Parallax
    window.addEventListener('mousemove', function (e) {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      targetMouseX = (e.clientX - centerX) / (rect.width / 2);
      targetMouseY = (e.clientY - centerY) / (rect.height / 2);

      if (isDragging) {
        const deltaX = (e.clientX - prevMouseX) * 0.01;
        const deltaY = (e.clientY - prevMouseY) * 0.01;
        solidGroup.rotation.y += deltaX;
        solidGroup.rotation.x += deltaY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    });

    renderer.domElement.addEventListener('mousedown', function (e) {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    });

    window.addEventListener('mouseup', function () {
      isDragging = false;
    });

    // Touch support for mobile
    renderer.domElement.addEventListener('touchstart', function (e) {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchmove', function (e) {
      if (isDragging && e.touches.length === 1) {
        const deltaX = (e.touches[0].clientX - prevMouseX) * 0.015;
        const deltaY = (e.touches[0].clientY - prevMouseY) * 0.015;
        solidGroup.rotation.y += deltaX;
        solidGroup.rotation.x += deltaY;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', function () {
      isDragging = false;
    });

    // Button controls
    const btnSpin = document.getElementById('btn-toggle-rotate');
    const btnWire = document.getElementById('btn-toggle-wire');
    const btnReset = document.getElementById('btn-reset-cam');

    if (btnSpin) {
      btnSpin.addEventListener('click', function () {
        isAutoRotating = !isAutoRotating;
        btnSpin.classList.toggle('active', isAutoRotating);
      });
    }

    if (btnWire) {
      btnWire.addEventListener('click', function () {
        isWireframe = !isWireframe;
        solidMaterial.wireframe = isWireframe;
        btnWire.classList.toggle('active', isWireframe);
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', function () {
        solidGroup.rotation.set(baseRotX, baseRotY, 0);
        camera.position.set(0, 0, 8.5);
      });
    }

    // Animation Loop
    let clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Ambient 13-second period vertical float (abFloat token)
      const floatOffsetY = Math.sin((elapsedTime / 13) * Math.PI * 2) * 0.22;
      rootGroup.position.y = floatOffsetY;

      // Mouse Parallax interpolation
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      rootGroup.rotation.y = currentMouseX * 0.35;
      rootGroup.rotation.x = -currentMouseY * 0.25;

      // Continuous slow rotation if enabled and not dragging
      if (isAutoRotating && !isDragging) {
        solidGroup.rotation.y += 0.005;
      }

      // Pulse core intensity
      const pulse = 1.4 + Math.sin(elapsedTime * 2.5) * 0.35;
      coreLightCyan.intensity = pulse;
      coreLightBlue.intensity = pulse * 0.9;

      // Rotate particle cloud gently
      particles.rotation.y += 0.002;

      renderer.render(scene, camera);
    }

    animate();

    // Resize handling
    function onResize() {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

    window.addEventListener('resize', onResize);
  }

  // Initialize on load or when Three is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHero3D);
  } else {
    initHero3D();
  }
})();
