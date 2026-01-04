import { RigidBody, MeshCollider } from "@react-three/rapier";
import { useGLTF } from "@react-three/drei";
import { useRef, useEffect } from "react";

import mapModel from "@assets/glts/map.glb";
import mapColliderModel from "@assets/glts/colliders.glb";

const Map: React.FC<{ onLoad: () => void }> = ({ onLoad }) => {
    const Gltf = useRef(null);
    const { scene: mapScene }: any = useGLTF(mapModel);
    const { scene: colliderScene }: any = useGLTF(mapColliderModel);

    useEffect(() => {
        if (mapScene && colliderScene) {
            mapScene.traverse((child: any) => {
                if (child.isObject3D) {
                    child.layers.set(0);
                }
            });

            colliderScene.traverse((child: any) => {
                if (child.isObject3D) {
                    child.layers.set(0);
                }
            });

            onLoad();
        }
    }, [mapScene, colliderScene, onLoad]);

    return (
        mapScene &&
        colliderScene && (
            <>
                <mesh scale={[20, 20, 20]} position={[0, 0, 0]} layers={0} castShadow receiveShadow>
                    <primitive object={mapScene} />
                </mesh>
                <RigidBody
                    includeInvisible
                    scale={[20, 20, 20]}
                    position={[0, 0, 0]}
                    type="fixed"
                    ref={Gltf}
                >
                    <MeshCollider type="trimesh">
                        <group visible={false}>
                            <primitive object={colliderScene} />
                        </group>
                    </MeshCollider>
                </RigidBody>
            </>
        )
    );
};

export default Map;
