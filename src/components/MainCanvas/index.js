import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber"
import { DoubleSide, RepeatWrapping, sRGBEncoding } from "three";
import {
  Loader,
  OrbitControls,
  PerspectiveCamera,
  useTexture
} from "@react-three/drei";

import { vertexShader, fragmentShader } from "../../utils/shaders"

// Our main React component renders a Canvas from
// react-three-fiber. The Canvas component does most
// of the hard work of setting up the scene, renderer
// and other core components of Three.js
const MainCanvas = () => {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Canvas shadows={true}>
        <Suspense fallback={null}>
            
          <Terrain />
          {/* <directionalLight
              intensity={0.5}
              castShadow
              shadow-mapSize-height={512}
              shadow-mapSize-width={512}
            /> */}
          {/* <ambientLight /> */}
        </Suspense>
        <directionalLight 
          color="red" 
          position={[300, 400, 50]}
          castShadow={true}
        />
        <PerspectiveCamera
          position={[0.5, 0.5, 0.5]}
          near={0.01}
          far={1000}
          makeDefault
        />
        <OrbitControls enableDamping={false} screenSpacePanning={false} />
      </Canvas>
      <Loader />
    </div>
  );
}

export default MainCanvas;

function Terrain() {
    // Load the heightmap image
    const heightMap = useTexture("/terraintest.png");
    // Apply some properties to ensure it renders correctly
    heightMap.encoding = sRGBEncoding;
    heightMap.wrapS = RepeatWrapping;
    heightMap.wrapT = RepeatWrapping;
    heightMap.anisotropy = 16;
  
    // Load the texture map
    const textureMap = useTexture("/texture.png");
    // Apply some properties to ensure it renders correctly
    textureMap.encoding = sRGBEncoding;
    textureMap.wrapS = RepeatWrapping;
    textureMap.wrapT = RepeatWrapping;
    textureMap.anisotropy = 16;
  
    return (
      <mesh 
        castShadow
        receiveShadow
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[1 / 1024, 1 / 1024, 1 / 1024]}
      >
        <planeBufferGeometry args={[1024, 1024, 256, 256]} />
        <shaderMaterial
          uniforms={{
            // Feed the heightmap
            bumpTexture: { value: heightMap },
            // Feed the scaling constant for the heightmap
            bumpScale: { value: 120 },
            // Feed the texture map
            terrainTexture: { value: textureMap }
          }}
          // Feed the shaders as strings
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          side={DoubleSide}
        />
      </mesh>
    );
  }