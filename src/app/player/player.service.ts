import { Injectable } from '@angular/core';
import * as THREE from 'three';
import io, { Socket } from 'socket.io-client';
import { KeyboardService } from './keyboard.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private mySquare!: THREE.Mesh;
  private socket!: Socket;
  private camera!: THREE.Camera;
  public id: string | null = null;
  public position = { x: 0, y: 0 };
  private targetPosition = { x: 0, y: 0 };
  private lerpAmount = 0.01; // Interpolation amount, should be between 0 and 1
  private cameraTargetPosition = { x: 0, y: 0, z: 5 };
  private cameraLerpAmount = 0.05;

  private lastPosition = { x: 0, y: 0 };
  private velocity = 0;
  private baseCameraZ = 5;  // The default Z distance of the camera
  private maxCameraZ = 20;  // The maximum Z distance of the camera

  constructor(private keyboardService: KeyboardService) {
    this.initPlayer();
    this.initCamera();
    this.initSocket();
    this.initKeyboard();
    
  }

  private initPlayer(): void {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.mySquare = new THREE.Mesh(geometry, material);
    this.position = { x: this.mySquare.position.x, y: this.mySquare.position.y };
  }

  private initSocket(): void {
    this.socket = io('http://localhost:3000/');
    this.socket.on('connect', () => {
      this.id = this.socket.id;
      console.log('connected', this.socket.id)
      this.socket.emit('init', {
        id: this.socket.id,
        x: this.mySquare.position.x,
        y: this.mySquare.position.y,
      });
    });
  }

  private initCamera(): void {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;
  }


  handleKeyDown(event: KeyboardEvent): void {
    this.keyboardService.processKeyboardEvent(event);
  }

  getMesh(): THREE.Mesh {
    return this.mySquare;
  }

  updateCamera(): void {
    // Apply linear interpolation (lerp) to make the camera smoothly follow the ship
    this.camera.position.x += (this.cameraTargetPosition.x - this.camera.position.x) * this.cameraLerpAmount;
    this.camera.position.y += (this.cameraTargetPosition.y - this.camera.position.y) * this.cameraLerpAmount;
    this.camera.position.z += (this.cameraTargetPosition.z - this.camera.position.z) * this.cameraLerpAmount;
  
    // Update the camera's target position to be the same as the ship's position
    this.cameraTargetPosition.x = this.position.x;
    this.cameraTargetPosition.y = this.position.y;
  
    // Add an offset to position the camera slightly above the ship
    this.cameraTargetPosition.z = this.position.x === 0 && this.position.y === 0 ? 5 : 10;

     // Dynamically adjust the z-position of the camera based on player speed
     const speedFactor = Math.min(this.velocity * 10, 1);  // Scale and clamp the speed factor
     this.cameraTargetPosition.z = THREE.MathUtils.lerp(this.baseCameraZ, this.maxCameraZ, speedFactor);
 
     // Lerp the camera's z position
     this.camera.position.z += (this.cameraTargetPosition.z - this.camera.position.z) * this.cameraLerpAmount;
  }

  getCamera(): THREE.Camera {
    return this.camera;
  }

  private initKeyboard(): void {
    // Subscribing to movement updates from KeyboardService
    this.keyboardService.getMovementObservable().subscribe(movement => {
      // We add movement.x and movement.y to targetPosition, not set it.
      this.targetPosition.x += movement.x;
      this.targetPosition.y += movement.y;

      // Debug log
      console.log('Target Position:', this.targetPosition);

      // Emit to server
      this.emitPositionToServer();
    });
  }

  private emitPositionToServer(): void {
    if (this.socket && this.socket.id) {
      this.socket.emit('move', {
        id: this.socket.id,
        x: this.targetPosition.x,
        y: this.targetPosition.y,
      });
      console.log('Emitted to server:', this.targetPosition);
    }
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
  }
}