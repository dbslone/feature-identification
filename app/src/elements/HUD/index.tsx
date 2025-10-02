import React from 'react';
import { useThree } from '@react-three/fiber';

const HUD = () => {
  const { width, height } = useThree(state => state.viewport);
  const size = 245; // Size of the axes helper

  return (
    // The group positions the helper based on the viewport size
    <group position={[width / 2 - size, -height / 2 + size, 0]}>
      <axesHelper args={[size]} />
    </group>
  );
};

export default HUD;