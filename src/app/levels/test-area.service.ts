import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root',
})
export class TestAreaService {

  // Initialize the level
  initLevel(scene: THREE.Scene): void {
    // Add the plane
    // this.addPlane(scene);

    // Add stars/planets
    this.addStarsOrPlanets(scene);
  }

  private addPlane(scene: THREE.Scene): void {
    const geometry = new THREE.PlaneGeometry(100, 100, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = Math.PI / 2;
    scene.add(plane);
  }

  private addStarsOrPlanets(scene: THREE.Scene): void {
    // Number of stars/planets you want to add
    const numberOfStars = 50;

    for (let i = 0; i < numberOfStars; i++) {
      // Random position within the plane
      const x = Math.random() * 100 - 50; // between -50 and 50
      const y = Math.random() * 100 - 50; // between -50 and 50

      // Random color
      const color = new THREE.Color(Math.random() * 0xffffff);

      // Create geometry and material
      const geometry = new THREE.SphereGeometry(1, 32, 32); // radius of 1
      const material = new THREE.MeshBasicMaterial({ color });

      // Create mesh and position it
      const star = new THREE.Mesh(geometry, material);
      star.position.set(x, 1, y); // set to 1 unit above the plane

      // Add to scene
      scene.add(star);
    }
  }
}
