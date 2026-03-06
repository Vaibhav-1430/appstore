/**
 * three-scene.js
 * ============================================================
 * Manages the Three.js 3D background for all pages.
 * Creates:
 *   - An animated star / particle field
 *   - Floating wireframe geometric shapes (icosahedron, torus, octahedron)
 *   - Subtle mouse-parallax camera movement
 * ============================================================
 */

(function () {
    "use strict";

    /* ─── DOM target ─────────────────────────────────────────── */
    const canvas = document.getElementById("three-canvas");
    if (!canvas) return;

    /* ─── Scene / Camera / Renderer ─────────────────────────── */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /* ─── Particle Field ─────────────────────────────────────── */
    const PARTICLE_COUNT = 1800;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    const colorPalette = [
        new THREE.Color("#00d4ff"),
        new THREE.Color("#7b2fff"),
        new THREE.Color("#ff00ff"),
        new THREE.Color("#00ffaa"),
        new THREE.Color("#ffffff")
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 40;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 40;

        const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
        size: 0.06,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        sizeAttenuation: true
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    /* ─── Floating Geometric Shapes ─────────────────────────── */
    const shapes = [];

    function createShape(geometry, color, x, y, z, scale = 1) {
        const mat = new THREE.MeshBasicMaterial({
            color,
            wireframe: true,
            transparent: true,
            opacity: 0.25
        });
        const mesh = new THREE.Mesh(geometry, mat);
        mesh.position.set(x, y, z);
        mesh.scale.setScalar(scale);
        scene.add(mesh);

        // Random rotation axis
        const rx = (Math.random() - 0.5) * 0.008;
        const ry = (Math.random() - 0.5) * 0.008;
        const rz = (Math.random() - 0.5) * 0.005;
        shapes.push({ mesh, rx, ry, rz });
        return mesh;
    }

    createShape(new THREE.IcosahedronGeometry(1.2, 1), "#00d4ff", -4, 1.5, -5, 1);
    createShape(new THREE.TorusGeometry(1, 0.3, 8, 24), "#7b2fff", 4, -1.5, -6, 1);
    createShape(new THREE.OctahedronGeometry(1, 0), "#ff00ff", 0, 2.5, -8, 1.2);
    createShape(new THREE.TetrahedronGeometry(0.8, 0), "#00ffaa", -6, -2, -7, 1);
    createShape(new THREE.IcosahedronGeometry(0.6, 0), "#ffffff", 6, 2, -9, 0.8);
    createShape(new THREE.TorusKnotGeometry(0.6, 0.2, 64, 8), "#ff8c00", -2, -3, -6, 0.9);

    /* ─── Mouse Parallax ─────────────────────────────────────── */
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    document.addEventListener("mousemove", (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    /* ─── Resize ─────────────────────────────────────────────── */
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    /* ─── Animation Loop ─────────────────────────────────────── */
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        // Slow particle rotation
        particles.rotation.y = elapsed * 0.03;
        particles.rotation.x = elapsed * 0.01;

        // Rotate individual shapes
        shapes.forEach(({ mesh, rx, ry, rz }) => {
            mesh.rotation.x += rx;
            mesh.rotation.y += ry;
            mesh.rotation.z += rz;
        });

        // Smooth camera parallax following mouse
        targetX += (mouseX - targetX) * 0.04;
        targetY += (mouseY - targetY) * 0.04;
        camera.position.x = targetX * 0.8;
        camera.position.y = -targetY * 0.5;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();
})();
