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
  public position = { x: 0, y: 0 };
  private targetPosition = { x: 0, y: 0 };
  private lerpAmount = 0.01; 
  private isSpaceshipLoaded = false;  // Add this line
  private lastPosition = { x: 0, y: 0 };
  private velocity = 0;

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
        this.isSpaceshipLoaded = true;
        
        this.position = {
          x: this.playerSpaceship.position.x,
          y: this.playerSpaceship.position.y,
        };
        this.id = this.socketService.id;
        if (this.isSpaceshipLoaded) {
          const position = this.playerSpaceship ? this.playerSpaceship.position : { x: 0, y: 0 };
          this.socketService.emitInit(position.x, position.y);
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
      this.targetPosition.y += movement.y;
      this.socketService.emitMove(this.targetPosition.x, this.targetPosition.y);
    });
  }

  getPosition(): { x: number; y: number } {
    return this.position;
  }
  
  // Method to set position without emitting to server
  setPosition(mesh: THREE.Mesh, x: number, y: number): void {
    this.targetPosition.x = x;
    this.targetPosition.y = y;
  }

  // Call this method each frame to smoothly update position
  updatePosition(mesh: THREE.Mesh): void {
    if (!mesh || !mesh.position) return;

    mesh.position.x += (this.targetPosition.x - mesh.position.x) * this.lerpAmount;
    mesh.position.y += (this.targetPosition.y - mesh.position.y) * this.lerpAmount;
    
    // Update the PlayerService's position to match the mesh's position
    this.position.x = mesh.position.x;
    this.position.y = mesh.position.y;

    // Calculate the velocity of the player based on position change
    this.velocity = Math.sqrt(
      Math.pow(this.position.x - this.lastPosition.x, 2) +
      Math.pow(this.position.y - this.lastPosition.y, 2)
    );

    // Save the last position
    this.lastPosition = { x: this.position.x, y: this.position.y };
    this.cameraService.updateCamera(this.position);

  }
}