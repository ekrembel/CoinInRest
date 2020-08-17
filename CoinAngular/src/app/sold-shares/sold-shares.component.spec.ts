import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoldSharesComponent } from './sold-shares.component';

describe('SoldSharesComponent', () => {
  let component: SoldSharesComponent;
  let fixture: ComponentFixture<SoldSharesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoldSharesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoldSharesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
