import { Canvas } from "@react-three/fiber";
import { PointerLockControls, Text } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import ErrorBoundary from "@components/ui/ErrorBoundary";

import * as THREE from "three";
import Player from "@features/games/among-us/player/player";
import { Suspense, useEffect, useState } from "react";
import Environments from "@features/games/among-us/world/environment";
import Map from "@features/games/among-us/game/map/map";
import MultiPlayers from "@features/games/among-us/multiplayer/multiplayers";
import Minimap from "@features/games/among-us/game/map/minimap";

const Game = () => {
    const [debug, setDebug] = useState(false);
    const [mapLoaded, setMapLoaded] = useState(false);

    const playerSpawnPoints: [[number, number, number], [number, number, number]][] = [
        [
            [93.7, 4, -81],
            [0, -Math.PI, 0],
        ],
    ];

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "`") {
                setDebug((prevDebug) => !prevDebug);
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleMapLoad = () => {
        setMapLoaded(true);
    };

    return (
        <>
            <Suspense fallback={null}>
                <Canvas
                    gl={{ powerPreference: "high-performance" }}
                    style={{ width: "100vw", height: "100vh" }}
                    shadows
                    camera={{ fov: 50 }}
                    scene={{ background: new THREE.Color("black") }}
                >
                    <Environments />

                    <ErrorBoundary fallback={<group><Text position={[0, 2, 0]} color="red" fontSize={1}>Physics Error</Text></group>}>
                        <Physics gravity={[0, -9.8, 0]} debug={debug}>
                            <Suspense>
                                <Map onLoad={handleMapLoad} />
                            </Suspense>
                            {mapLoaded && (
                                <>
                                    <Player
                                        position={playerSpawnPoints[0][0]}
                                        rotation={playerSpawnPoints[0][1]}
                                        canJump={false}
                                    />
                                    <MultiPlayers />
                                </>
                            )}
                        </Physics>
                    </ErrorBoundary>

                    <PointerLockControls
                        maxPolarAngle={Math.PI - 1}
                        minPolarAngle={Math.PI / 2.1}
                    />
                    <Minimap />
                </Canvas>
            </Suspense>
        </>
    );
};

export default Game;
