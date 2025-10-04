import React, { useRef, useState } from 'react';

interface HighlightableMeshProps {
    geometry: THREE.BufferGeometry;
    index: React.Key;
    children?: React.ReactNode;
    setSelectedMesh: any;
}

const HighlightableMesh: React.FC<HighlightableMeshProps> = ({ geometry, index, children, setSelectedMesh }) => {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);

    const onHoverOver = () => {
        console.log('hovered')
        setHovered(true);
        setSelectedMesh([meshRef.current])
    }
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
        </mesh>
    );
}

export default HighlightableMesh;