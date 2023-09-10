import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  private camera: THREE.PerspectiveCamera;
  private currentPosition = new THREE.Vector3();
  private currentLookAt = new THREE.Vector3();
  private cameraHolder: THREE.Object3D;

  constructor() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.cameraHolder = new THREE.Object3D();
    this.cameraHolder.add(this.camera);
  }

  updateCamera(position: { x: number, z: number }): void { // Changed y to z
    let idealOffset = this.calculatedIdealOffset(position);
    let idealLookAt = this.calculatedIdealLookAt(position);

    const t = 0.1; // Interpolation factor, adjust as needed

    this.currentPosition.lerp(idealOffset, t);
    this.currentLookAt.lerp(idealLookAt, t);

    if (isFinite(this.currentPosition.x) && isFinite(this.currentPosition.z) && isFinite(this.currentPosition.z)) { // Changed y to z
      this.cameraHolder.position.copy(this.currentPosition);
    }

    if (isFinite(this.currentLookAt.x) && isFinite(this.currentLookAt.z) && isFinite(this.currentLookAt.z)) { // Changed y to z
      this.camera.lookAt(this.currentLookAt);
    }
  }

  calculatedIdealOffset(position: { x: number, z: number }): THREE.Vector3 { // Changed y to z
    // Position the camera directly above the player
    return new THREE.Vector3(position.x, 50, position.z);  // 10 units above the player, changed y to z
  }

  calculatedIdealLookAt(position: { x: number, z: number }): THREE.Vector3 { // Changed y to z
    // Look directly down at the player
    return new THREE.Vector3(position.x, 0, position.z); // changed y to z
  }

  getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }
}
