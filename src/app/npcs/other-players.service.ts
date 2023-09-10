import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

@Injectable({
  providedIn: 'root'
})
export class OtherPlayersService {
  private otherPlayerSpaceship!: THREE.Mesh;
  private targetPositions: { [id: string]: { x: number, y: number }} = {};
  private isSpaceshipLoaded = false;
  private lerpAmount = 0.01;

  constructor() {
    this.initOtherPlayerSpaceship();
  }

  private async initOtherPlayerSpaceship(): Promise<void> {
    return new Promise<void>((resolve) => {
      const loader = new GLTFLoader();
      loader.load('assets/test/spaceship.glb', (gltf) => {
        this.otherPlayerSpaceship = gltf.scene.children[0] as THREE.Mesh;
        this.isSpaceshipLoaded = true;
        resolve();
      });
    });
  }

  getMesh(): THREE.Mesh {
    if (!this.isSpaceshipLoaded) {
      throw new Error('Spaceship mesh not yet loaded');
    }
    return this.otherPlayerSpaceship.clone();
  }

  setPosition(id: string, x: number, y: number): void {
    this.targetPositions[id] = { x, y };
  }

  updatePosition(mesh: THREE.Mesh, id: string): void {
    if (this.targetPositions[id]) {
      const target = this.targetPositions[id];
      mesh.position.x += (target.x - mesh.position.x) * this.lerpAmount;
      mesh.position.y += (target.y - mesh.position.y) * this.lerpAmount;
    }
  }
}
