import { RigidBody } from "@react-three/rapier";

const Floor = () => {
    return (
        <RigidBody type="fixed">
            <mesh receiveShadow rotation={[Math.PI / -2, 0, 0]}>
                <planeGeometry args={[1000, 1000]} />
                <meshStandardMaterial color="white" />
            </mesh>
        </RigidBody>
    );
};

export default Floor;
