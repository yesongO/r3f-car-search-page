import React, { Suspense, useEffect, useState, type JSX } from 'react';
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three';
import './App.css'

function CarModel({ color, ...props } : { color: string } & JSX.IntrinsicElements['group']) {
  const { scene, nodes } = useGLTF('/audi_a7_55_tfsi.glb');

  console.log(nodes); // 구성 요소 출력

  // useEffect(() => {
  //   const bodyNode = nodes['audi-body'] as THREE.Mesh;

  //   if (bodyNode) {
  //     const bodyMaterial = (bodyNode.material as THREE.MeshStandardMaterial).clone();

  //     bodyMaterial.color = new THREE.Color(color);
  //     bodyNode.material = bodyMaterial;
  //   }
  // }, [nodes, color])
  
  useEffect(() => {
    // 'audi-body' 라는 이름을 가진 노드를 찾자.
    const bodyNode = nodes['audi-body'];

    // bodyNode가 실제로 존재할 때만 아래 코드를 실행
    if (bodyNode) {
      // ✅ traverse를 사용해서 bodyNode와 그 모든 자식들을 순회하자!
      bodyNode.traverse((child) => {
        // 순회하는 대상(child)이 색칠 가능한 Mesh인지 확인!
        if (child instanceof THREE.Mesh) {
          // Mesh가 맞다면, 재질을 복제하고 색을 바꿔치기!
          const bodyMaterial = (child.material as THREE.MeshStandardMaterial).clone();
          bodyMaterial.color = new THREE.Color(color);
          child.material = bodyMaterial;
        }
      });
    }
  }, [nodes, color]); // color나 nodes 정보가 바뀔 때만 실행

  return <primitive object={scene} {...props} />;
}


const App = () => {

  return (
    <>
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [5, 5, 5], fov: 25}}>
        <Suspense fallback={null}>
          <CarModel color={'red'}/>
        </Suspense>
        <OrbitControls />
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={4.5} />
        <Environment preset="city" />
      </Canvas>
    </div>
    </>
  );
}

export default App
