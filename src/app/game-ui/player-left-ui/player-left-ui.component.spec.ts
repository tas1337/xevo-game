import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerLeftUiComponent } from './player-left-ui.component';

describe('PlayerLeftUiComponent', () => {
  let component: PlayerLeftUiComponent;
  let fixture: ComponentFixture<PlayerLeftUiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerLeftUiComponent]
    });
    fixture = TestBed.createComponent(PlayerLeftUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
