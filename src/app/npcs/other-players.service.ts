// other-players.service.ts
import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class OtherPlayersService {
  private targetPositions: { [id: string]: { x: number, y: number }} = {};
  private lerpAmount: number = 0.01;
// Inside OtherPlayersService class
private prevPositions: { [id: string]: { x: number, y: number }} = {};
  // GLSL code for the vertex shader
  private vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  // GLSL code for the fragment shader
  private fragmentShader = `
    uniform float time;
    varying vec2 vUv;
    void main() {
      vec3 color = vec3(1.0, 0.0, 0.0); // red
      color.g = vUv.y + sin(time + vUv.x * 10.0) * 0.5; // animate the green channel
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  getMesh() {
    const geometry = new THREE.BoxGeometry();
    const uniforms = { time: { value: 0.0 } };
    const material = new THREE.ShaderMaterial({
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      uniforms: uniforms,
    });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  }


  setPosition(id: string, x: number, y: number) {
    this.targetPositions[id] = { x, y };
  }

  updatePosition(mesh: THREE.Mesh, id: string) {
    
    if (this.targetPositions[id]) {
      const target = this.targetPositions[id];
      mesh.position.x += (target.x - mesh.position.x) * this.lerpAmount;
      mesh.position.y += (target.y - mesh.position.y) * this.lerpAmount;
  
      // Calculate speed
      let speed = 0;
      if (this.prevPositions[id]) {
        const dx = mesh.position.x - this.prevPositions[id].x;
        const dy = mesh.position.y - this.prevPositions[id].y;
        speed = Math.sqrt(dx * dx + dy * dy);
      }
      this.prevPositions[id] = { x: mesh.position.x, y: mesh.position.y };
  
      // Update shader or mesh attributes based on speed
      if (mesh.material instanceof THREE.ShaderMaterial) {
      }
    }
  }
}