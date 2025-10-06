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
        setHovered(true);
        setSelectedMesh([meshRef.current])
    }

    return (
        <mesh
            geometry={geometry}
            key={index}
            ref={meshRef}
            onPointerOver={onHoverOver}
            onPointerOut={() => setHovered(false)}
        >
            {children}
        </mesh>
    );
}

export default HighlightableMesh;