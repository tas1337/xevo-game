import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerRightUiComponent } from './player-right-ui.component';

describe('PlayerRightUiComponent', () => {
  let component: PlayerRightUiComponent;
  let fixture: ComponentFixture<PlayerRightUiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerRightUiComponent]
    });
    fixture = TestBed.createComponent(PlayerRightUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
