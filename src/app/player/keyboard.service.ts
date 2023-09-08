import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KeyboardService {
  private movementSubject = new Subject<{ x: number; y: number }>();
  private dx = 0;
  private dy = 0;

  constructor() {}

  processKeyboardEvent(event: KeyboardEvent): void {
    const movementAmount = 1;

    if (event.key === 'ArrowUp') {
      this.dy = movementAmount;
    } else if (event.key === 'ArrowDown') {
      this.dy = -movementAmount;
    } else if (event.key === 'ArrowLeft') {
      this.dx = -movementAmount;
    } else if (event.key === 'ArrowRight') {
      this.dx = movementAmount;
    }

    this.emitMovement();
    console.log('Processed Keyboard Event:', event.key, this.dx, this.dy);

  }

  releaseKey(event: KeyboardEvent): void {
    // Handle key release, e.g., set dx and dy to zero if needed
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      this.dy = 0;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      this.dx = 0;
    }

    this.emitMovement();
    console.log('Key Released:', event.key, this.dx, this.dy);

  }

  private emitMovement(): void {
    this.movementSubject.next({ x: this.dx, y: this.dy });
    console.log(this.dx, this.dy);
  }

  getMovementObservable() {
    return this.movementSubject.asObservable();
  }
}