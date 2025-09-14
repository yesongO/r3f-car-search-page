import { Suspense, useEffect, useState, type JSX } from 'react';
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three';
import './App.css'

// 이미지 import
import naverLogo from './assets/naver_logo.png';
import searchLeft from './assets/naver_search.png';

// -- CarModel 컴포넌트 --
function CarModel({ color, ...props } : { color: string } & JSX.IntrinsicElements['group']) {
  const { scene, nodes } = useGLTF('/audi_a7_55_tfsi.glb');

  console.log(nodes); // 구성 요소 출력
  
  useEffect(() => {
    // 'audi-body' 이름을 가진 노드를 찾기!
    const bodyNode = nodes['audi-body'];

    if (bodyNode) {
      // traverse를 사용해서 bodyNode와 그 모든 자식들을 순회
      bodyNode.traverse((child) => {
        // 순회하는 대상(child)이 색칠 가능한 Mesh인지 확인
        if (child instanceof THREE.Mesh) {
          // Mesh가 맞다면, 재질을 복제 후 색 바꿔치기
          const bodyMaterial = (child.material as THREE.MeshStandardMaterial).clone();
          bodyMaterial.color = new THREE.Color(color);
          // 광택 줄이기
          bodyMaterial.roughness = 0.5;
          bodyMaterial.metalness = 0.7;

          child.material = bodyMaterial;
        }
      });
    }
  }, [nodes, color]); // color나 nodes 정보가 바뀔 때만 실행

  return <primitive object={scene} {...props} />;
}

// 자동차 하단에 표시할 색상 목록 데이터
const colors = [
  { name: 'Matador Red Metallic', hex: '#AD2229' },
  { name: 'Moonlight Blue Matallic', hex: '#2A3457' },
  { name: 'Florett Silver Metallic', hex: '#A9A9A9' },
  { name: 'Glacier White Metallic', hex: '#F0F0F0' },
  { name: 'Brilliant Black', hex: '#000000' },
];

// 키워드 목록 데이터
const keywords = [
  "전체", "기본정보", "제원", "중고시세", "포토", "모델비교", "함께 찾은 모델"
];

const App = () => {
  // 현재 선택된 색상 상태
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  // 현재 선택된 키워드 상태
  const [selectedKeyword, setSelectedKeyword] = useState("전체");

  return (
    <>
    <div className="container">
      <div className="top-container">
      <div className="top-container-content">
        <div className="logo-title-group">
          <div className="naver-logo">
            <img src={naverLogo} alt="naver-logo" />
          </div>
          <h2>아우디 a7 2018</h2>
        </div>
        <div className="naver-search">
          <img src={searchLeft} alt="search-left" />
        </div>
      </div>
      </div>
      <div className="car-viewer-card">
        <div className="header">
          <h2>아우디 A7</h2>
          <p>준대형 세단 &middot; 2018</p>
        </div>

        <div className="keyword-selector">
          {keywords.map((keyword) => (
            <button
              key={keyword}
              className={selectedKeyword === keyword ? 'active' : ''}
              onClick={() => setSelectedKeyword(keyword)}
            >
              {keyword}
            </button>
          ))}
        </div>

        <div className="canvas-container">
          <Canvas camera={{ position: [-3, 2, 10], fov: 30 }}>
            <Suspense fallback={null}>
              <CarModel color={selectedColor.hex} position={[2, -0.4, 1]} rotation={[0, -Math.PI / 3, 0]} />
            </Suspense>
            <OrbitControls />
            <ambientLight intensity={1.5} />
            <pointLight position={[10, 10, 10]} intensity={4.5} />
            <Environment preset="city" />
          </Canvas>
        </div>

        <div className="controls">
          <div className="color-picker">
            {/* colors 배열을 map으로 돌면서 버튼 생성 */}
            {colors.map((color) => (
              <button
                key={color.name}
                className={selectedColor.name === color.name ? 'selected' : ''}
                style={{ backgroundColor: color.hex }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
          <span className="color-name">{selectedColor.name}</span>
        </div>

        <div className="info-section">
        <h3>기본정보</h3>
          <div className="info-grid">
            <div className="info-row">
              <span className="info-label">가격</span>
              <span className="info-value">
                67,800유로 · <a href="#">보험료계산</a> <span className="ad-tag">광고</span>
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">연료</span>
              <span className="info-value">
                가솔린 <a href="#">내차시세</a>
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">연비</span>
              <span className="info-value">복합 6.8ℓ/100km</span>
            </div>
            <div className="info-row">
              <span className="info-label">출력</span>
              <span className="info-value">340hp 엔진</span>
            </div>
            <div className="info-row">
              <span className="info-label">엔진</span>
              <span className="info-value">V6 싱글터보</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default App
