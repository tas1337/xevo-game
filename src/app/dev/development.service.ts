import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Subject } from 'rxjs';
import { PlayerService } from '../player/player.service';

@Injectable({
  providedIn: 'root',
})
export class DevelopmentService {

  private debugInfo: Subject<string> = new Subject<string>();
  debugInfo$ = this.debugInfo.asObservable();

  private fpsInfo: Subject<number> = new Subject<number>();
  fpsInfo$ = this.fpsInfo.asObservable();

  private gridHelper?: THREE.GridHelper; // Declare grid helper

  constructor(private playerService: PlayerService) {}

  addOrbitControls(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer): OrbitControls {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    return controls;
  }

  toggleGrid(scene: THREE.Scene, size: number, divisions: number): void {
    if (this.gridHelper) {
      scene.remove(this.gridHelper);
      this.gridHelper = undefined;
    } else {
      this.gridHelper = new THREE.GridHelper(size, divisions);
      scene.add(this.gridHelper);
    }
  }

  toggleUIElement(element: HTMLElement, show: boolean): void {
    element.style.display = show ? 'block' : 'none';
  }

  logDebugInfo(info: string): void {
    this.debugInfo.next(info);
  }

  registerHotkeys(scene: THREE.Scene, gridSize: number, gridDivisions: number): void {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'p') {
        this.debugInfo.next('P key pressed.');
      }
      if (e.key === 'g') {
        this.toggleGrid(scene, gridSize, gridDivisions);
      }
    });
  }

  toggleWireframe(mesh: THREE.Mesh): void {
    if (mesh && mesh.material instanceof THREE.MeshBasicMaterial) {
      mesh.material.wireframe = !mesh.material.wireframe;
    }
  }

  showFPS(): void {
    let lastTime = performance.now();
    const updateFPS = () => {
      const now = performance.now();
      const fps = 1000 / (now - lastTime);
      lastTime = now;
      this.fpsInfo.next(Math.round(fps));
    };
    setInterval(updateFPS, 1000);
  }

  resetPlayerPosition(): void {
    // this.playerService.resetPosition();
  }
}
