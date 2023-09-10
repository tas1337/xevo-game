import { Component, OnInit, HostListener } from '@angular/core';
import * as THREE from 'three';
import { PlayerService } from '../player/player.service';
import { OtherPlayersService } from '../npcs/other-players.service';
import { SocketService } from '../server/socket.service';
import { TestAreaService } from '../levels/test-area.service';
import { DevelopmentService } from '../dev/development.service';
import { MinimapService } from '../game-ui/minimap.service';  // Add this import line

@Component({
  selector: 'app-test-game',
  template: '',
})
export class TestGameComponent implements OnInit {
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private players: { [id: string]: THREE.Mesh } = {};
  private devOn: boolean = true; 

  constructor(
    private playerService: PlayerService,
    private otherPlayerService: OtherPlayersService,
    private socketService: SocketService,
    private testAreaService: TestAreaService,
    private developmentService: DevelopmentService,
    private minimapService: MinimapService 

  ) {}

  ngOnInit(): void {
    this.initThree();
    this.initSocket();
    this.initDevelopmentFeatures();
    this.initLevel();
    this.animate();
  }

// TestGameComponent
private initDevelopmentFeatures(): void {
  const gridSize = 100; // You can choose your own size
  const gridDivisions = 10; // You can choose your own number of divisions
  this.developmentService.registerHotkeys(this.scene, gridSize, gridDivisions);
  this.developmentService.showFPS();
}

  private initLevel(): void {
    this.testAreaService.initLevel(this.scene);
  }

  private initThree(): void {
    this.scene = new THREE.Scene();
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }

  private initSocket(): void {
    this.socketService.onUpdatePositions((playerPositions) => {
      Object.keys(this.players).forEach(id => {
        if (!playerPositions[id]) {
          this.scene.remove(this.players[id]);
          delete this.players[id];
        }
      });
  
      Object.keys(playerPositions).forEach(id => {
        let mesh = this.players[id] ?? (id === this.playerService.id ? this.playerService.getMesh() : this.otherPlayerService.getMesh());
        if (!this.players[id]) {
          this.players[id] = mesh;
          this.scene.add(mesh);
        }
  
        const position = playerPositions[id];
        id === this.playerService.id ? this.playerService.setPosition(mesh, position.x, position.y) : this.otherPlayerService.setPosition(id, position.x, position.y);
      });
  
      if (this.playerService.id !== null) {
        this.minimapService.updatePositions(playerPositions, this.playerService.id); // Update minimap
      }
    });
  }

  animate = () => {
    requestAnimationFrame(this.animate.bind(this));
    const mainPlayerMesh = this.playerService.getMesh();
    this.playerService.update(mainPlayerMesh);
    Object.keys(this.players).forEach(id => {
      if (id !== this.playerService.id) {
        this.otherPlayerService.updatePosition(this.players[id], id);
      }
    });
    
    this.renderer.render(this.scene, this.playerService.getCamera());
  };



  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    this.playerService.handleKeyDown(event);
  }

  @HostListener('window:resize', ['$event'])
  handleResize(event: Event): void {
    this.onWindowResize();
  }

  private onWindowResize(): void {
    const camera = this.playerService.getCamera(); // Assuming your camera is accessible through PlayerService
  
    // Update camera aspect ratio and projection matrix
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  
    // Update renderer size
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
