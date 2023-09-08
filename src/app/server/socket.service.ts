import { Injectable } from '@angular/core';
import io, { Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;

  constructor() {
    this.initSocket();
  }

  private initSocket(): void {
    this.socket = io('http://localhost:3000');
  }

  emitInit(x: number, y: number): void {
    this.socket.emit('init', {
      id: this.socket.id,
      x,
      y,
    });
  }

  emitMove(x: number, y: number): void {
    this.socket.emit('move', {
      id: this.socket.id,
      x,
      y,
    });
  }

  onUpdatePositions(callback: (playerPositions: { [id: string]: { x: number, y: number } }) => void): void {
    this.socket.on('updatePositions', callback);
    
  }
}