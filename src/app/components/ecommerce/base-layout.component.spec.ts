import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcommercePlantilla } from './base-layout.component';

describe('BaseLayoutComponent', () => {
  let component: EcommercePlantilla;
  let fixture: ComponentFixture<EcommercePlantilla>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcommercePlantilla]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EcommercePlantilla);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
