import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import './Background3D.css';

function Geometries({ count = 20 }) {
  const group = useRef();
  
  useFrame((state) => {
    if (group.current) {
      // Rotate the entire group based on mouse position
      group.current.rotation.y = state.mouse.x * 0.2;
      group.current.rotation.x = state.mouse.y * 0.2;
    }
  });

  const geometries = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      ],
      scale: 0.2 + Math.random() * 0.8,
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
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
            <meshStandardMaterial color={geo.color} roughness={0.2} metalness={0.8} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

const Background3D = () => {
  return (
    <div className="background-3d">
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
