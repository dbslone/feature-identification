import './index.css';

import * as React from 'react';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { GLTFLoader } from 'three-stdlib';

import HUD from '../HUD';

import detectPockets from '../../lib/detectPockets'

interface ModelEntity {
    bufferGeometry: THREE.BufferGeometry;
    color: string;
}

interface ModelViewerProps {
    graph: Record<string, any>;
}

 const ModelViewer: React.FC<ModelViewerProps> = ({ graph }): JSX.Element => {
    const [modelEnts, setModelEnts] = React.useState<ModelEntity[]>([]);
    const mainCamera = React.useRef();
    const hudCamera = React.useRef();

    React.useEffect(() => {
        new GLTFLoader().load('./colored_glb.glb', gltf => {
            const newModuleEntities: ModelEntity[] = [];
            gltf.scene.traverse(element => {
                // console.log({ element });
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
    }, [])

    return (
        <div className="canvas-container">
            <Canvas camera={{ position: [0, 0, 300] as [number, number, number] }} >
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <group>
                    {
                        modelEnts.map((ent, index) => {
                            return (
                                <mesh
                                    geometry={ent.bufferGeometry}
                                    key={index}
                                >
                                    <meshStandardMaterial color={ent.color} />
                                </mesh>
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