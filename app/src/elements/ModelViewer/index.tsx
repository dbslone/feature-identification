import './index.css';

import * as React from 'react';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { GLTFLoader } from 'three-stdlib';

import HUD from '../HUD';

interface ModelEntity {
    bufferGeometry: THREE.BufferGeometry;
    color: string;
}

 const ModelViewer = (): JSX.Element => {
    const [modelEnts, setModelEnts] = React.useState<ModelEntity[]>([]);
    const mainCamera = React.useRef();
    const hudCamera = React.useRef();

    React.useEffect(() => {
        new GLTFLoader().load('./colored_glb.glb', gltf => {
            console.log({ gltf });
            const newModuleEntities: ModelEntity[] = [];
            gltf.scene.traverse(element => {
                console.log({ element });
                if (element.type !== 'Mesh') return;

                const meshElement = element as THREE.Mesh;
                newModuleEntities.push({
                    bufferGeometry: meshElement.geometry as THREE.BufferGeometry,
                    color: 'rgb(120, 120, 120)',
                });
            });
            setModelEnts(newModuleEntities);
        });

    }, [])

    return (
        <div className="canvas-container">
            <Canvas camera={{ position: [0, 0, 300] as [number, number, number] }} >
                <ambientLight />
                {/* <axesHelper args={[5]} /> */}
                <pointLight position={[10, 10, 10]} />
                <group>
                    {
                        modelEnts.map((ent, index) => (
                            <mesh
                                geometry={ent.bufferGeometry}
                                key={index}
                            >
                                <meshStandardMaterial color={index%2===0? 'red' : 'green'} />
                            </mesh>
                        ))
                    }
                </group>

                <OrbitControls makeDefault />
                <perspectiveCamera ref={mainCamera} position={[5, 5, 5]} />
                <perspectiveCamera ref={hudCamera} position={[0, 0, 1]} />
                <HUD />
            </Canvas>
        </div>
    )
};

export default ModelViewer;