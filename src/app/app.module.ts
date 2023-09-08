import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestGameComponent } from './test-game/test-game.component';
import { MinimapService } from './game-ui/minimap.service';
import { PlayerService } from './player/player.service';
import { KeyboardService } from './player/keyboard.service';
import { OtherPlayersService } from './npcs/other-players.service';
import { InventoryComponent } from './game-ui/inventory/inventory.component';
import { QuestsComponent } from './game-ui/quests/quests.component';
import { StatsComponent } from './game-ui/stats/stats.component';
import { PlayerRightUiComponent } from './game-ui/player-right-ui/player-right-ui.component';
import { PlayerLeftUiComponent } from './game-ui/player-left-ui/player-left-ui.component';
import { MapComponent } from './game-ui/map/map.component';
@NgModule({
  declarations: [
    AppComponent,
    TestGameComponent,
    InventoryComponent,
    QuestsComponent,
    StatsComponent,
    PlayerRightUiComponent,
    PlayerLeftUiComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [KeyboardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
