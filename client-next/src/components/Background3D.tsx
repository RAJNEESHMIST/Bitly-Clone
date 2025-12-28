"use client";

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

function Geometries({ count = 25 }) {
    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y = state.mouse.x * 0.15;
            group.current.rotation.x = state.mouse.y * 0.15;
        }
    });

    const geometries = useMemo(() => {
        return Array.from({ length: count }).map(() => ({
            position: [
                (Math.random() - 0.5) * 25,
                (Math.random() - 0.5) * 25,
                (Math.random() - 0.5) * 25
            ] as [number, number, number],
            scale: 0.2 + Math.random() * 0.8,
            rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
            // Cyan, Fuchsia, Indigo randomizer
            color: Math.random() > 0.66 ? '#06b6d4' : Math.random() > 0.33 ? '#d946ef' : '#6366f1'
        }));
    }, [count]);

    return (
        <group ref={group}>
            {geometries.map((geo, i) => (
                <Float key={i} speed={2} rotationIntensity={1.5} floatIntensity={2}>
                    <mesh position={geo.position} rotation={geo.rotation} scale={geo.scale}>
                        <dodecahedronGeometry args={[1, 0]} />
                        <meshStandardMaterial
                            color={geo.color}
                            roughness={0.2}
                            metalness={0.8}
                            emissive={geo.color}
                            emissiveIntensity={0.2}
                        />
                    </mesh>
                </Float>
            ))}
        </group>
    );
}

const Background3D = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-slate-900 via-[#1e1b4b] to-slate-900">
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4338ca" />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <Geometries />
            </Canvas>
        </div>
    );
};

export default Background3D;
