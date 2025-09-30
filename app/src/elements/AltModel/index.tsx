import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const NormalsWithAxes = ({ modelUrl }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // --- Main scene & camera ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(3, 3, 3);
    camera.lookAt(0, 0, 0);

    // --- Load GLTF Model ---
    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshNormalMaterial({ flatShading: false });
          }
        });
        scene.add(gltf.scene);
      },
      undefined,
      (err) => console.error(err)
    );

    // --- Mini Axes scene ---
    const axesScene = new THREE.Scene();
    const axesCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 10);
    axesCamera.position.set(0, 0, 2);
    axesCamera.lookAt(0, 0, 0);
    const axesHelper = new THREE.AxesHelper(1.2);
    axesScene.add(axesHelper);

    // --- Animation loop ---
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate model if needed
      // scene.rotation.y += 0.005; // optional

      // Render main scene
      renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
      renderer.setScissorTest(false);
      renderer.render(scene, camera);

      // Render mini axes in bottom-right
      const insetSize = 100;
      const x = window.innerWidth - insetSize - 10;
      const y = 10;
      renderer.setViewport(x, y, insetSize, insetSize);
      renderer.setScissor(x, y, insetSize, insetSize);
      renderer.setScissorTest(true);
      renderer.setClearColor(0x000000, 0); // transparent
      renderer.render(axesScene, axesCamera);
      renderer.setScissorTest(false);
    };
    animate();

    // --- Handle resize ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [modelUrl]);

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default NormalsWithAxes;
