import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KeyboardService {
  private movementSubject = new Subject<{ x: number; z: number }>();
  private dx = 0;
  private dz = 0; // changed dy to dz
  private shouldEmit = false;

  constructor() {}

  processKeyboardEvent(event: KeyboardEvent): void {
    const movementAmount = 1;
    this.shouldEmit = false; // Reset flag

    if (event.key === 'ArrowUp') {
      this.dz = -movementAmount; // changed dy to dz
      this.shouldEmit = true;
    } else if (event.key === 'ArrowDown') {
      this.dz = movementAmount; // changed dy to dz
      this.shouldEmit = true;
    } else if (event.key === 'ArrowLeft') {
      this.dx = -movementAmount;
      this.shouldEmit = true;
    } else if (event.key === 'ArrowRight') {
      this.dx = movementAmount;
      this.shouldEmit = true;
    }

    if (this.shouldEmit) {
      this.emitMovement();
      console.log('Processed Keyboard Event:', event.key, this.dx, this.dz); // changed dy to dz
    }
  }

  releaseKey(event: KeyboardEvent): void {
    this.shouldEmit = false; // Reset flag

    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      this.dz = 0; // changed dy to dz
      this.shouldEmit = true;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      this.dx = 0;
      this.shouldEmit = true;
    }

    if (this.shouldEmit) {
      this.emitMovement();
      console.log('Key Released:', event.key, this.dx, this.dz); // changed dy to dz
    }
  }

  private emitMovement(): void {
    this.movementSubject.next({ x: this.dx, z: this.dz }); // changed dy to dz
    console.log(this.dx, this.dz); // changed dy to dz
  }

  getMovementObservable() {
    return this.movementSubject.asObservable();
  }
}
