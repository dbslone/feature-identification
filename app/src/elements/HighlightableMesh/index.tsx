import React, { useRef, useState } from 'react';
import { Outline } from '@react-three/postprocessing';

interface HighlightableMeshProps {
    geometry: THREE.BufferGeometry,
    index: React.Key,
    children?: React.ReactNode;
}

const HighlightableMesh: React.FC<HighlightableMeshProps> = ({ geometry, index, children }) => {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);
    console.log({hovered, index, meshRef})
    return (
        <mesh
            geometry={geometry}
            key={index}
            ref={meshRef}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {children}
            {/* Conditionally render Outline on hover */}
            {hovered && <Outline width={2} edgeStrength={100} selection={[meshRef.current]} visibleEdgeColor={0x00ff00} />}
        </mesh>
    );
}

export default HighlightableMesh;