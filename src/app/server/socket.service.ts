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
    this.socket = io('http://localhost:3000/');
    this.socket.on('connect', () => {
      this.id = this.socket.id; 
      console.log('connected', this.id);
    });
  }

  public initConnectionAndSendInitialPosition(position: { x: number, y: number }): void {
      this.emitInit(position.x, position.y);
  }

  emitInit(x: number, y: number): void {
    this.socket.emit('init', {
      id: this.socket.id,
      x: x,
      y: y,
    });
  }

  emitMove( x: number, y: number): void {
    this.socket.emit('move', {
      id: this.socket.id,
      x: x,
      y: y,
    });
  }

  onUpdatePositions(callback: (playerPositions: { [id: string]: { x: number, y: number } }) => void): void {
    this.socket.on('updatePositions', callback);
    console.log('updatePositions')
  }
}