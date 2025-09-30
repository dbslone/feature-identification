// three.js r180 compatible version
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

async function findPockets(url, curvatureThreshold = -0.01) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();

    loader.load(
      url,
      (gltf) => {
        const scene = gltf.scene;
        const pockets = [];

        scene.traverse((child) => {
          if (child instanceof THREE.Mesh && child.geometry) {
            const geometry = child.geometry.clone();
            geometry.computeVertexNormals();

            const pos = geometry.attributes.position.array;
            const normal = geometry.attributes.normal.array;
            const index = geometry.index ? geometry.index.array : null;

            if (!index) return; // skip non-indexed geometry for now

            // Step 1: Build adjacency
            const adjacency = buildAdjacency(pos, index);

            // Step 2: Compute curvature per vertex
            const concaveVertices = [];
            for (let i = 0; i < pos.length / 3; i++) {
              const curvature = computeCurvature(i, pos, normal, adjacency);
              if (curvature < curvatureThreshold) {
                concaveVertices.push(i);
              }
            }

            // Step 3: Cluster concave vertices into regions
            const regions = clusterVertices(concaveVertices, adjacency);

            pockets.push(...regions);
          }
        });

        resolve(pockets);
      },
      undefined,
      reject
    );
  });
}

// --- Helper functions ---

function buildAdjacency(positions, indices) {
  const adjacency = {};
  for (let i = 0; i < indices.length; i += 3) {
    const a = indices[i], b = indices[i + 1], c = indices[i + 2];
    [[a, b], [b, c], [c, a]].forEach(([v1, v2]) => {
      if (!adjacency[v1]) adjacency[v1] = new Set();
      if (!adjacency[v2]) adjacency[v2] = new Set();
      adjacency[v1].add(v2);
      adjacency[v2].add(v1);
    });
  }
  return adjacency;
}

function computeCurvature(vIndex, positions, normals, adjacency) {
  const nx = normals[3 * vIndex];
  const ny = normals[3 * vIndex + 1];
  const nz = normals[3 * vIndex + 2];
  const vNormal = new THREE.Vector3(nx, ny, nz).normalize();

  const neighborNormal = new THREE.Vector3();
  adjacency[vIndex]?.forEach((nIndex) => {
    const nnx = normals[3 * nIndex];
    const nny = normals[3 * nIndex + 1];
    const nnz = normals[3 * nIndex + 2];
    neighborNormal.add(new THREE.Vector3(nnx, nny, nnz));
  });

  if (neighborNormal.lengthSq() === 0) return 0;

  neighborNormal.normalize();
  const dot = vNormal.dot(neighborNormal);

  // Curvature proxy: dot < 1 means bent, dot < 0 means strongly concave
  return dot - 1.0;
}

function clusterVertices(concaveVertices, adjacency) {
  const visited = new Set();
  const regions = [];

  concaveVertices.forEach((v) => {
    if (visited.has(v)) return;
    const stack = [v];
    const region = [];

    while (stack.length > 0) {
      const current = stack.pop();
      if (visited.has(current)) continue;
      visited.add(current);
      region.push(current);

      adjacency[current]?.forEach((n) => {
        if (concaveVertices.includes(n) && !visited.has(n)) {
          stack.push(n);
        }
      });
    }
    if (region.length > 0) regions.push(region);
  });

  return regions;
}

// Example usage:
findPockets('model.gltf').then((pockets) => {
  console.log("Detected pockets:", pockets);
});
