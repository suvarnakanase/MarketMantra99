import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TbBtReportComponent } from './tb-bt-report.component';

describe('TbBtReportComponent', () => {
  let component: TbBtReportComponent;
  let fixture: ComponentFixture<TbBtReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TbBtReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TbBtReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
