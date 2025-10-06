// Libraries
import * as React from 'react';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { GLTFLoader } from 'three-stdlib';

// Elements
import HighlightableMesh from '../HighlightableMesh';

// Styles
import './index.css';

interface ModelEntity {
    bufferGeometry: THREE.BufferGeometry;
    color: string;
}

interface ModelViewerProps {
    graph: Record<string, any>;
    selectedMesh: any[];
    setSelectedMesh: any;
}

 const ModelViewer: React.FC<ModelViewerProps> = ({ graph, selectedMesh, setSelectedMesh }): JSX.Element => {
    const [modelEnts, setModelEnts] = React.useState<ModelEntity[]>([]);
    const mainCamera = React.useRef();

    React.useEffect(() => {
        new GLTFLoader().load('./colored_glb.glb', gltf => {
            const newModuleEntities: ModelEntity[] = [];
            gltf.scene.traverse(element => {
                if (element.type !== 'Mesh') return;

                const rgb = graph[element.name.split('_').pop()]?.rgb;
                const meshElement = element as THREE.Mesh;
                newModuleEntities.push({
                    bufferGeometry: meshElement.geometry as THREE.BufferGeometry,
                    color: `rgb(${rgb.split('-').join(', ')})`,
                });
            });
            setModelEnts(newModuleEntities);
        });
    }, []);

    return (
        <div className="canvas-container">
            <Canvas camera={{ position: [224, 112, 112] as [number, number, number] }} >
                <ambientLight />
                <group>
                    {
                        modelEnts.map((ent, index) => {
                            return (
                                <HighlightableMesh
                                    geometry={ent.bufferGeometry}
                                    index={index}
                                    setSelectedMesh={setSelectedMesh}
                                >
                                    <meshStandardMaterial color={ent.color} />
                                </HighlightableMesh>
                            )
                        })
                    }
                </group>

                <OrbitControls makeDefault />
                <perspectiveCamera ref={mainCamera} position={[5, 5, 5]} />
            </Canvas>
        </div>
    )
};

export default ModelViewer;