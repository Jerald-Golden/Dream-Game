import * as THREE from "three";
import { useRef, useEffect, useState } from "react";
import { RigidBody, RapierRigidBody, CapsuleCollider } from "@react-three/rapier";
import { useFrame, useThree } from "@react-three/fiber";
import { usePlayerControls } from "@core/utils/helpers";
import CharacterModel from "@features/games/among-us/player/character";
import { useRoom } from "@features/games/among-us/multiplayer/roomContext";
import { useStamina } from "@core/store/store";

interface PlayerProps {
    position: [number, number, number];
    rotation: [number, number, number];
    canJump: boolean;
}

const Player: React.FC<PlayerProps> = (props) => {
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3();
    const sideVector = new THREE.Vector3();
    const rigidBodyRef = useRef<RapierRigidBody>(null);
    const targetQuaternion = useRef(new THREE.Quaternion());
    const lastSentTime = useRef<number>(Date.now());
    const lastSentPosition = useRef<THREE.Vector3>(new THREE.Vector3(...props.position));
    const lastSentRotation = useRef<THREE.Quaternion>(new THREE.Quaternion());

    const WALKSPEED = 5;
    const SPRINTSPEED = 7.5;

    const { sendMove, roomName } = useRoom();
    const { camera } = useThree();
    const { stamina, setStamina } = useStamina();
    const { forward, backward, left, right, jump, sprint, cameraToggle } = usePlayerControls();

    const [isThirdPerson, setIsThirdPerson] = useState(false);

    const initialRotation = new THREE.Euler(...props.rotation);

    useEffect(() => {
        camera.layers.enableAll();
        camera.rotation.set(initialRotation.x, initialRotation.y, initialRotation.z);
        const offset = isThirdPerson ? new THREE.Vector3(0, 0, 10) : new THREE.Vector3(0, 0, 0);
        const cameraPosition = new THREE.Vector3(...props.position).add(
            offset.applyQuaternion(camera.quaternion),
        );
        camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        setIsThirdPerson(cameraToggle);
    }, [cameraToggle]);

    useEffect(() => {
        let staminaInterval: NodeJS.Timeout;

        const isMoving = forward || backward || left || right;

        if (sprint && isMoving) {
            staminaInterval = setInterval(() => {
                setStamina(Math.max(stamina - 10, 0));
            }, 1000);
        } else if (stamina < 100) {
            staminaInterval = setInterval(() => {
                setStamina(Math.min(stamina + 15, 100));
            }, 500);
        }

        return () => clearInterval(staminaInterval);
    }, [sprint, forward, backward, left, right, stamina, setStamina]);

    useFrame(() => {
        const rigidBody = rigidBodyRef.current;
        if (!rigidBody) return;

        const position = rigidBody.translation();
        const currentRotation = rigidBody.rotation();
        const currentQuaternion = new THREE.Quaternion(
            currentRotation.x,
            currentRotation.y,
            currentRotation.z,
            currentRotation.w,
        );

        const offset = isThirdPerson ? new THREE.Vector3(0, 0, 10) : new THREE.Vector3(0, 0, 0);
        const cameraPosition = new THREE.Vector3()
            .copy(new THREE.Vector3(position.x, position.y + 0.5, position.z))
            .add(offset.applyQuaternion(camera.quaternion));
        camera.position.lerp(cameraPosition, 0.1);

        frontVector.set(0, 0, Number(backward) - Number(forward));
        sideVector.set(Number(left) - Number(right), 0, 0);
        direction
            .subVectors(frontVector, sideVector)
            .normalize()
            .multiplyScalar(sprint && stamina > 0 ? SPRINTSPEED : WALKSPEED)
            .applyEuler(camera.rotation);

        const velocity = rigidBody.linvel();

        rigidBody.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true);

        if (props.canJump && jump && Math.abs(velocity.y) < 0.05) {
            rigidBody.setLinvel({ x: velocity.x, y: 5, z: velocity.z }, true);
        }

        const cameraQuaternion = new THREE.Quaternion();
        camera.getWorldQuaternion(cameraQuaternion);
        const cameraEuler = new THREE.Euler().setFromQuaternion(cameraQuaternion, "YXZ");
        const yawQuaternion = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(0, cameraEuler.y, 0),
        );
        targetQuaternion.current.slerp(yawQuaternion, 0.1);
        rigidBody.setRotation(
            {
                x: targetQuaternion.current.x,
                y: targetQuaternion.current.y,
                z: targetQuaternion.current.z,
                w: targetQuaternion.current.w,
            },
            true,
        );

        const now = Date.now();
        const positionDiff = lastSentPosition.current.distanceTo(position);
        const rotationDiff = lastSentRotation.current.angleTo(currentQuaternion);

        let state = "idle";
        if (Math.abs(direction.x) > 0 || Math.abs(direction.z) > 0) {
            state = sprint && stamina > 0 ? "run" : "walk";
        }

        // Send updates if connected to a room
        if (
            roomName &&
            now - lastSentTime.current > 50 && // Cap update rate to Avoid spamming
            (positionDiff > 0.01 || rotationDiff > 0.01)
        ) {
            const euler: any = new THREE.Euler().setFromQuaternion(currentQuaternion, "YXZ");
            sendMove(
                { x: position.x, y: position.y, z: position.z },
                { x: euler.x, y: euler.y, z: euler.z },
                state
            );
            lastSentPosition.current.copy(position);
            lastSentRotation.current.copy(currentQuaternion);
            lastSentTime.current = now;
        }
    });

    return (
        <RigidBody
            includeInvisible
            lockRotations
            ref={rigidBodyRef}
            colliders={false}
            position={props.position}
            mass={1}
            type="dynamic"
            rotation={[initialRotation.x, initialRotation.y, initialRotation.z]}
        >
            <CapsuleCollider args={[0.45, 0.75]}>
                <CharacterModel visibility={cameraToggle} />
            </CapsuleCollider>
        </RigidBody>
    );
};

export default Player;
