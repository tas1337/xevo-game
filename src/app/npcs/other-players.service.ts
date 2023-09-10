import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

@Injectable({
  providedIn: 'root'
})
export class OtherPlayersService {
  private otherPlayerSpaceship!: THREE.Mesh;
  private targetPositions: { [id: string]: { x: number, z: number }} = {};  // Changed y to z
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
        this.otherPlayerSpaceship.position.set(0, 0, 0); // x, y, z where y remains unchanged as it's up in 3D space
        this.otherPlayerSpaceship.scale.set(0.01, 0.01, 0.01);
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

  setPosition(id: string, x: number, z: number): void {  // Changed y to z
    this.targetPositions[id] = { x, z };  // Changed y to z
  }

  updatePosition(mesh: THREE.Mesh, id: string): void {
    if (this.targetPositions[id]) {
      const target = this.targetPositions[id];
      mesh.position.x += (target.x - mesh.position.x) * this.lerpAmount;
      mesh.position.z += (target.z - mesh.position.z) * this.lerpAmount;  // Changed y to z
    }
  }
}
