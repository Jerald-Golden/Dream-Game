import LoadingBar from "./loadingBar";
import { useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";

import amoungUsMapModel from "@assets/glts/map.glb";
import amoungUsMapColliderModel from "@assets/glts/colliders.glb";
import amoungUsCharacterModel from "@assets/glts/final.glb";

const Preloader: React.FC = () => {
    const [progress, setProgress] = useState(0);
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        const assets = [amoungUsMapModel, amoungUsCharacterModel, amoungUsMapColliderModel];
        let loaded = 0;
        const totalSteps = assets.length + 20;

        Promise.all(
            assets.map((url) => {
                useGLTF.preload(url);
                loaded += 1;
                setProgress(Math.round((loaded / totalSteps) * 100));
                return Promise.resolve({});
            }),
        ).then(() => {
            let delayProgress = loaded;
            const interval = setInterval(() => {
                delayProgress += 1;
                setProgress(Math.round((delayProgress / totalSteps) * 100));
                if (delayProgress >= totalSteps) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setFinished(true);
                    }, 3500);
                }
            }, 200);
        });
    }, []);

    if (finished) {
        return null;
    }

    return (
        <div
            className="loading-screen"
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            <LoadingBar progress={progress} />
        </div>
    );
};

export default Preloader;
