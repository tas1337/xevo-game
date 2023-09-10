import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root',
})
export class TestAreaService {

  initLevel(scene: THREE.Scene): { planet: THREE.Mesh, glowMesh: THREE.Mesh } {
    return this.addPlanet(scene);
  }

  private addPlanet(scene: THREE.Scene): { planet: THREE.Mesh, glowMesh: THREE.Mesh } {
    // Create a large sphere geometry as the planet
    const planetGeometry = new THREE.SphereGeometry(25, 32, 32); 

    // Load texture
    const textureLoader = new THREE.TextureLoader();
    const planetTexture = textureLoader.load('assets/test/earth.jpg');

    // Create a MeshPhongMaterial as it supports texture maps and lighting
    const planetMaterial = new THREE.MeshPhongMaterial({
      map: planetTexture
    });

    // Create mesh and position it
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.position.set(-30, 0, -30);

    // Add to scene
    scene.add(planet);

    // Shader code
    const vertexShader = `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float c;
      uniform float p;
      varying vec3 vNormal;
      void main() {
        float intensity = pow(c - dot(vNormal, vec3(0.0, 0.0, 1.0)), p);
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0) * intensity;
      }
    `;

    // Glow effect using custom shader
    const customMaterial = new THREE.ShaderMaterial({
      uniforms: {
        "c": { value: 0.1 },
        "p": { value: 1.4 }
      },
      vertexShader,
      fragmentShader,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    const glowMesh = new THREE.Mesh(planetGeometry.clone(), customMaterial);
    glowMesh.scale.multiplyScalar(1.3);
    scene.add(glowMesh);

    return { planet, glowMesh };
  }
}
