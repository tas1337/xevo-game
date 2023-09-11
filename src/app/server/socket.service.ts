import { Injectable } from '@angular/core';
import io, { Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;
  public id: string | null = null;

  constructor() {
    this.initSocket();
  }

  private initSocket(): void {
    this.socket = io('/');
    this.socket.on('connect', () => {
      this.id = this.socket.id; 
      console.log('connected', this.id);
    });
  }

  public initConnectionAndSendInitialPosition(position: { x: number, z: number }): void {  // Changed y to z
      this.emitInit(position.x, position.z);  // Changed y to z
  }

  emitInit(x: number, z: number): void {  // Changed y to z
    this.socket.emit('init', {
      id: this.socket.id,
      x: x,
      z: z,  // Changed y to z
    });
  }

  emitMove(position: {x: number, z: number}, rotation: { x:number, z: number }): void {  // Changed y to z
    this.socket.emit('move', {
      id: this.socket.id,
      x: position.x,
      z: position.z,  // Changed y to z
    });
  }

  onUpdatePositions(callback: (playerPositions: { [id: string]: { x: number, z: number } }) => void): void {  // Changed y to z
    this.socket.on('updatePositions', callback);
    console.log('updatePositions')
  }
}
