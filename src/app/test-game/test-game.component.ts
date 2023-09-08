import { Component, OnInit, HostListener } from '@angular/core';
import * as THREE from 'three';
import { MinimapService } from '../game-ui/minimap.service';
import { PlayerService } from '../player/player.service';
import { OtherPlayersService } from '../npcs/other-players.service';
import { SocketService } from '../server/socket.service';

@Component({
  selector: 'app-test-game',
  template: '',
})
export class TestGameComponent implements OnInit {
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private players: { [id: string]: THREE.Mesh } = {};

  constructor(
    // private minimapService: MinimapService,
    private playerService: PlayerService,
    private otherPlayerService: OtherPlayersService,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.initThree();
    this.initSocket();
    this.animate();
  }

  private initThree(): void {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }

  private initSocket(): void {
    this.socketService.onUpdatePositions((playerPositions) => {

      for (const id in this.players) {
        if (!playerPositions[id]) {
          this.scene.remove(this.players[id]);
          delete this.players[id];
        }
      }

      for (const id in playerPositions) {
        if (!this.players[id]) {
          let mesh: THREE.Mesh;

          if (id === this.playerService.id) {
            mesh = this.playerService.getMesh();
          } else {
            mesh = this.otherPlayerService.getMesh();
          }

          this.players[id] = mesh;
          this.scene.add(mesh);
        }

        const position = playerPositions[id];
        const playerMesh = this.players[id];

        console.log("Updated position to:", position);

        
        if (id === this.playerService.id) {
          this.playerService.setPosition(playerMesh, position.x, position.y);
        } else {
          this.otherPlayerService.setPosition(id, position.x, position.y);
          // console.log(this.otherPlayerService);
        }
      }
    });
  }

  animate = () => {
    requestAnimationFrame(this.animate);
  
    // Update the main player's position
    const mainPlayerMesh = this.playerService.getMesh();
    this.playerService.updatePosition(mainPlayerMesh);
  
    // Update positions for all other players
    for (const id in this.players) {
      if (id !== this.playerService.id) {
        const otherPlayerMesh = this.players[id];
        this.otherPlayerService.updatePosition(otherPlayerMesh, id);  // Pass id as the second argument
      }
    }
  
    // Make the camera follow the player
    this.playerService.updateCamera();

    // Render the scene from the updated camera position
    this.renderer.render(this.scene, this.playerService.getCamera());
  };

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    this.playerService.handleKeyDown(event);
  }
}
