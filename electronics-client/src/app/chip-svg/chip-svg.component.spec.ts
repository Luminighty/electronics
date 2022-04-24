import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipSvgComponent } from './chip-svg.component';

describe('ChipSvgComponent', () => {
  let component: ChipSvgComponent;
  let fixture: ComponentFixture<ChipSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChipSvgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
