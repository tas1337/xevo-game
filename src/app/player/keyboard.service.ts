import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KeyboardService {
  private movementSubject = new Subject<{ x: number; y: number }>();
  private dx = 0;
  private dy = 0;
  private shouldEmit = false;

  constructor() {}

  processKeyboardEvent(event: KeyboardEvent): void {
    const movementAmount = 1;
    this.shouldEmit = false; // Reset flag

    if (event.key === 'ArrowUp') {
      this.dy = movementAmount;
      this.shouldEmit = true;
    } else if (event.key === 'ArrowDown') {
      this.dy = -movementAmount;
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
      console.log('Processed Keyboard Event:', event.key, this.dx, this.dy);
    }
  }

  releaseKey(event: KeyboardEvent): void {
    this.shouldEmit = false; // Reset flag

    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      this.dy = 0;
      this.shouldEmit = true;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      this.dx = 0;
      this.shouldEmit = true;
    }

    if (this.shouldEmit) {
      this.emitMovement();
      console.log('Key Released:', event.key, this.dx, this.dy);
    }
  }

  private emitMovement(): void {
    this.movementSubject.next({ x: this.dx, y: this.dy });
    console.log(this.dx, this.dy);
  }

  getMovementObservable() {
    return this.movementSubject.asObservable();
  }
}
