"use client"
export default function Floor() {
  return (
    <mesh  recieveShadow>
      <boxBufferGeometry args={[20, 1, 10]} />
      <meshPhysicalMaterial color="white" />
    </mesh>
  );
}
