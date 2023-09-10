import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  private camera!: THREE.PerspectiveCamera;
  private cameraTargetPosition = { x: 0, y: 0, z: 5 };
  private cameraLerpAmount = 0.005;

  constructor() {
    this.initCamera();
  }

  private initCamera(): void {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 0;

    this.camera.rotation.x = 0;
    this.camera.rotation.y = 0;
    this.camera.rotation.z = 0;
  }

  updateCamera(target: { x: number, y: number }): void {
    // Linear interpolation logic for camera here
    this.camera.position.x += (target.x - this.camera.position.x) * this.cameraLerpAmount;
    this.camera.position.y += (target.y - this.camera.position.y) * this.cameraLerpAmount;
    this.camera.position.z += (this.cameraTargetPosition.z - this.camera.position.z) * this.cameraLerpAmount;
  }

  getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }
}
