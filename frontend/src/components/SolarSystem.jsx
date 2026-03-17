import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Stars, useTexture, Torus, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

export default function SolarSystem({ earthSpeed = 1, moonSpeed = 1, earthSpinSpeed = 1, showOrbits = true, timeRef }) {
    const sunRef = useRef();
    const earthOrbitRef = useRef();
    const earthRef = useRef();
    const moonOrbitRef = useRef();
    const moonRef = useRef();
    const starsRef = useRef();

    // NEW: Camera and Tracking Refs
    const controlsRef = useRef();
    const activeMesh = useRef(null); // Stores which planet is currently clicked
    const targetPosition = new THREE.Vector3(); // Used to calculate world position

    const totalEarthSpin = useRef(0);
    const totalEarthOrbit = useRef(0);
    const totalMoonOrbit = useRef(0);

    const [earthMap, earthNormalMap, moonMap] = useTexture([
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg'
    ]);

    useFrame((state, delta) => {
        if (sunRef.current) sunRef.current.rotation.y += delta * 0.1;
        if (starsRef.current) starsRef.current.rotation.y -= delta * 0.02;
        if (moonRef.current) moonRef.current.rotation.y += delta * 0.5;

        // Orbital and Spin Physics
        const earthOrbitStep = delta * 0.5 * earthSpeed;
        if (earthOrbitRef.current) {
            earthOrbitRef.current.rotation.y += earthOrbitStep;
            totalEarthOrbit.current += earthOrbitStep;
        }

        const earthSpinStep = delta * 2 * earthSpinSpeed;
        if (earthRef.current) {
            earthRef.current.rotation.y += earthSpinStep;
            totalEarthSpin.current += earthSpinStep;
        }

        const moonOrbitStep = delta * 1.5 * moonSpeed;
        if (moonOrbitRef.current) {
            moonOrbitRef.current.rotation.y += moonOrbitStep;
            totalMoonOrbit.current += Math.abs(moonOrbitStep);
        }

        // NEW: Dynamic Camera Tracking
        if (controlsRef.current) {
            if (activeMesh.current) {
                // Get the exact XYZ of the moving planet in the 3D world
                activeMesh.current.getWorldPosition(targetPosition);
                // Smoothly pan the camera's focal point to follow it
                controlsRef.current.target.lerp(targetPosition, 0.08);
            } else {
                // If nothing is selected, smoothly return focus to the Sun (0,0,0)
                controlsRef.current.target.lerp(new THREE.Vector3(0, 0, 0), 0.05);
            }
            controlsRef.current.update();
        }

        // Time Calculation
        if (timeRef && timeRef.current) {
            const orbits = totalEarthOrbit.current / (Math.PI * 2);
            const years = Math.floor(orbits);
            const months = Math.floor((orbits % 1) * 12);
            const days = Math.floor(totalEarthSpin.current / (Math.PI * 2));
            const lunarCycles = Math.floor(totalMoonOrbit.current / (Math.PI * 2));

            const formattedMonths = String(months).padStart(2, '0');
            const formattedDays = String(days).padStart(3, '0');
            const formattedLunar = String(lunarCycles).padStart(3, '0');

            timeRef.current.innerText = `Year ${years} | Mth ${formattedMonths} | Days: ${formattedDays} | Lunar Cycles: ${formattedLunar}`;
        }
    });

    // NEW: Double Click Handlers
    const handleDoubleClick = (e, meshRef) => {
        e.stopPropagation(); // Prevents the click from passing through the planet to the background
        activeMesh.current = meshRef;
    };

    return (
        // onPointerMissed fires when clicking empty space
        <group onPointerMissed={() => (activeMesh.current = null)}>

            {/* NEW: OrbitControls moved inside the scene */}
            <OrbitControls ref={controlsRef} enablePan={true} enableZoom={true} enableRotate={true} />

            <EffectComposer>
                <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
            </EffectComposer>

            <group ref={starsRef}>
                <Stars radius={300} depth={60} count={10000} factor={7} saturation={0} fade speed={1} />
            </group>

            <ambientLight intensity={0.05} />
            <pointLight position={[0, 0, 0]} intensity={500} distance={200} decay={2} color="#fffcf2" />

            {/* The Sun */}
            <Sphere
                ref={sunRef}
                args={[4, 64, 64]}
                position={[0, 0, 0]}
                onDoubleClick={(e) => handleDoubleClick(e, sunRef.current)}
            >
                <meshBasicMaterial color={[2, 1.2, 0]} toneMapped={false} />
            </Sphere>

            {showOrbits && (
                <Torus args={[15, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
                    <meshBasicMaterial color="#334455" transparent opacity={0.4} />
                </Torus>
            )}

            <group ref={earthOrbitRef}>
                <group position={[15, 0, 0]}>

                    {/* The Earth */}
                    <Sphere
                        ref={earthRef}
                        args={[1.5, 64, 64]}
                        rotation={[0, 0, 23.5 * (Math.PI / 180)]}
                        onDoubleClick={(e) => handleDoubleClick(e, earthRef.current)}
                    >
                        <meshStandardMaterial
                            map={earthMap}
                            normalMap={earthNormalMap}
                            roughness={0.6}
                            metalness={0.1}
                        />
                    </Sphere>

                    {showOrbits && (
                        <Torus args={[3.5, 0.01, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
                            <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
                        </Torus>
                    )}

                    <group ref={moonOrbitRef}>
                        {/* The Moon */}
                        <Sphere
                            ref={moonRef}
                            args={[0.4, 32, 32]}
                            position={[3.5, 0, 0]}
                            onDoubleClick={(e) => handleDoubleClick(e, moonRef.current)}
                        >
                            <meshStandardMaterial map={moonMap} roughness={1} metalness={0} />
                        </Sphere>
                    </group>

                </group>
            </group>
        </group>
    );
}