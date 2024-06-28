import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotCreateComponent } from './lot-create.component';

describe('LotCreateComponent', () => {
  let component: LotCreateComponent;
  let fixture: ComponentFixture<LotCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LotCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LotCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
