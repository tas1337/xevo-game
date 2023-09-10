import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MinimapService {
  private minimapElement: HTMLElement;
  private playerElements: { [id: string]: HTMLElement } = {};

  constructor() {
    // Create and append the minimap element to the body
    this.minimapElement = document.createElement('div');
    this.minimapElement.style.position = 'fixed';
    this.minimapElement.style.bottom = '10px';
    this.minimapElement.style.right = '10px';
    this.minimapElement.style.width = '100px';
    this.minimapElement.style.height = '100px';
    this.minimapElement.style.border = '1px solid #000';
    document.body.appendChild(this.minimapElement);
  }

  updatePositions(playerPositions: { [id: string]: { x: number, y: number } }, myId: string) {
    // Remove old player elements
    for (const id in this.playerElements) {
      if (!playerPositions[id]) {
        this.minimapElement.removeChild(this.playerElements[id]);
        delete this.playerElements[id];
      }
    }

    // The position of yourself
    const myPosition = playerPositions[myId];

    // Add new player elements and update positions
    for (const id in playerPositions) {
      let element = this.playerElements[id];
      if (!element) {
        element = document.createElement('div');
        element.style.width = '5px';
        element.style.height = '5px';
        element.style.position = 'absolute';
        element.style.backgroundColor = id === myId ? 'green' : 'red';
        this.minimapElement.appendChild(element);
        this.playerElements[id] = element;
      }

      const position = playerPositions[id];
      const relativeX = position.x - myPosition.x;  // relative to your position
      const relativeY = position.y - myPosition.y;  // relative to your position

      element.style.left = `${50 + relativeX * 5}px`;
      element.style.top = `${50 - relativeY * 5}px`;
    }
  }
  
}