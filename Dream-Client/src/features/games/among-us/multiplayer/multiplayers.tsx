import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRoom } from "@features/games/among-us/multiplayer/roomContext";
import { useAuth } from "../../../../contexts/AuthContext";

import ModelUrl from "@assets/glts/final.glb";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useAnimations, useGLTF } from "@react-three/drei";

import { SkeletonUtils } from "three-stdlib";
import { useGraph } from "@react-three/fiber";

const MultiPlayers: React.FC = () => {
    const { players } = useRoom();
    const { user } = useAuth();

    // Filter out self
    const otherPlayers = players.filter(p => p.userId !== user?.id);

    return (
        <>
            {otherPlayers.map((player) => (
                <RigidBody
                    key={player.userId}
                    includeInvisible
                    lockRotations
                    colliders={false}
                    position={[player.position.x, player.position.y, player.position.z]}
                    mass={1}
                    type="dynamic"
                    rotation={[player.rotation.x, player.rotation.y, player.rotation.z]}
                >
                    <CapsuleCollider args={[0.45, 0.75]}>
                        <Model key={player.userId} state={player.state} />
                    </CapsuleCollider>
                </RigidBody>
            ))}
        </>
    );
};

export default MultiPlayers;

export function Model(props: any) {
    const group = useRef<any>();
    const { scene, animations, materials }: any = useGLTF(ModelUrl);
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { nodes }: any = useGraph(clone);
    const { actions } = useAnimations(animations, group);

    useEffect(() => {
        if (actions) {
            const actionKeys = Object.keys(actions);
            if (actionKeys.length > 0) {
                actions["idle"]?.reset().play();

                const fadeDuration = 0.2;

                if (props.state === "idle") {
                    actions["idle"]?.reset().fadeIn(fadeDuration).play();
                    actions["walk"]?.fadeOut(fadeDuration);
                    actions["run"]?.fadeOut(fadeDuration);
                } else if (props.state === "walk") {
                    actions["walk"]?.reset().fadeIn(fadeDuration).play();
                    actions["idle"]?.fadeOut(fadeDuration);
                    actions["run"]?.fadeOut(fadeDuration);
                } else if (props.state === "run") {
                    actions["run"]?.reset().fadeIn(fadeDuration).play();
                    actions["idle"]?.fadeOut(fadeDuration);
                    actions["walk"]?.fadeOut(fadeDuration);
                }
            }
        }
    }, [actions, props.state]);

    return (
        <group
            layers={1}
            position={[0, -1.2, 0]}
            scale={[2.2, 2.2, 2.2]}
            rotation={[0, -Math.PI, 0]}
            ref={group}
            {...props}
            dispose={null}
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
