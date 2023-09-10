import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { KeyboardService } from './keyboard.service';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { CameraService } from './camera.service';
import { SocketService } from '../server/socket.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private playerSpaceship!: THREE.Mesh;
  public id: string | null = null;
  public position = { x: 0, z: 0 };
  private targetPosition = { x: 0, z: 0 };
  private lerpAmount = 0.01; 
  private isSpaceshipLoaded = false;
  private lastPosition = { x: 0, z: 0 };
  private velocity = 0;
  private rotationAngle = 0;

  constructor(
    private keyboardService: KeyboardService,
    private cameraService: CameraService,
    private socketService: SocketService,
  ) {
    this.initPlayer();
    this.initKeyboard();
  }

  private async initPlayer(): Promise<void> {
    return new Promise<void>((resolve) => {
      const loader = new GLTFLoader();
    
      loader.load('assets/test/spaceship.glb', (gltf) => {
        this.playerSpaceship = gltf.scene.children[0] as THREE.Mesh;
        this.playerSpaceship.position.set(0, 0, 0);
        this.playerSpaceship.scale.set(0.01, 0.01, 0.01);
        this.isSpaceshipLoaded = true;
        
        this.position = {
          x: this.playerSpaceship.position.x,
          z: this.playerSpaceship.position.z,
        };
        this.id = this.socketService.id;
        if (this.isSpaceshipLoaded) {
          const position = this.playerSpaceship ? this.playerSpaceship.position : { x: 0, z: 0 };
          this.socketService.emitInit(position.x, position.z);
        }
        resolve();
      });
    });
  }

  update(mesh: THREE.Mesh): void {
    if (this.isSpaceshipLoaded) {
      this.updatePosition(mesh);
    }
    this.updateCamera();
  }

  handleKeyDown(event: KeyboardEvent): void {
    this.keyboardService.processKeyboardEvent(event);
  }

  getMesh(): THREE.Mesh {
    return this.playerSpaceship;
  }

  updateCamera(): void {
    this.cameraService.updateCamera(this.position);
  }

  getCamera(): THREE.PerspectiveCamera {
    return this.cameraService.getCamera();
  }

  private initKeyboard(): void {
    this.keyboardService.getMovementObservable().subscribe(movement => {
      this.targetPosition.x += movement.x;
      this.targetPosition.z += movement.z;
      var position = { x: this.targetPosition.x, z: this.targetPosition.z}
      this.updateRotation(movement);  // <-- New method to handle rotation
      this.socketService.emitMove(position, { x: this.rotationAngle, z: this.rotationAngle });
    });
  }

  // New method to handle rotation
  private updateRotation(movement: { x: number, z: number }): void {
    if (movement.x < 0) {
      this.rotationAngle = Math.PI;  // 180 degrees, facing left
    } else if (movement.x > 0) {
      this.rotationAngle = 0;  // 0 degrees, facing right
    } else if (movement.z > 0) {
      this.rotationAngle = -Math.PI / 2;  // -90 degrees, facing up
    } else if (movement.z < 0) {
      this.rotationAngle = Math.PI / 2;  // 90 degrees, facing down
    }
    this.playerSpaceship.rotation.y = this.rotationAngle;
  }

  getPosition(): { x: number; z: number } {
    return this.position;
  }
  
  setPosition(mesh: THREE.Mesh, x: number, z: number): void {
    this.targetPosition.x = x;
    this.targetPosition.z = z;
  }

  updatePosition(mesh: THREE.Mesh): void {
    if (!mesh || !mesh.position) return;

    mesh.position.x += (this.targetPosition.x - mesh.position.x) * this.lerpAmount;
    mesh.position.z += (this.targetPosition.z - mesh.position.z) * this.lerpAmount;
    
    this.position.x = mesh.position.x;
    this.position.z = mesh.position.z;

    this.velocity = Math.sqrt(
      Math.pow(this.position.x - this.lastPosition.x, 2) +
      Math.pow(this.position.z - this.lastPosition.z, 2)
    );

    this.lastPosition = { x: this.position.x, z: this.position.z };
    this.cameraService.updateCamera(this.position);
  }
}
