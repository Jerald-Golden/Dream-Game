import React, { useMemo } from "react";
import { useGLTF } from "@react-three/drei";

import ModelUrl from "@assets/glts/final.glb";
import { SkeletonUtils } from "three-stdlib";
import { useGraph } from "@react-three/fiber";

const CharacterModel: React.FC<{ visibility: boolean }> = (props) => {
    const { scene: originalScene }: any = useGLTF(ModelUrl);
    const clonedScene = React.useMemo(() => originalScene.clone(), [originalScene]);

    return <>{clonedScene && <Model visibility={props.visibility} />}</>;
};

export default CharacterModel;

export function Model(props: any) {
    const { scene, materials }: any = useGLTF(ModelUrl);
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { nodes }: any = useGraph(clone);

    return (
        <group
            layers={1}
            visible={props.visibility}
            position={[0, -1.2, 0]}
            scale={[2.2, 2.2, 2.2]}
            rotation={[0, -Math.PI, 0]}
        >
            <group layers={1} name="Scene">
                <group layers={1} name="Armature" rotation={[Math.PI / 2, 0, 0]}>
                    <group layers={1} name="Astronaut">
                        <skinnedMesh
                            layers={1}
                            name="Astronautmesh"
                            geometry={nodes.Astronautmesh.geometry}
                            material={materials.SecondaryMaterial}
                            skeleton={nodes.Astronautmesh.skeleton}
                        />
                        <skinnedMesh
                            layers={1}
                            name="Astronautmesh_1"
                            geometry={nodes.Astronautmesh_1.geometry}
                            material={materials.BaseMaterial}
                            skeleton={nodes.Astronautmesh_1.skeleton}
                        />
                        <skinnedMesh
                            layers={1}
                            name="Astronautmesh_2"
                            geometry={nodes.Astronautmesh_2.geometry}
                            material={materials.BeltMaterial}
                            skeleton={nodes.Astronautmesh_2.skeleton}
                        />
                    </group>
                    <primitive object={nodes.mixamorigHips} />
                </group>
            </group>
        </group>
    );
}
