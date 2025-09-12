import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStatsChart } from './admin-stats-chart';

describe('AdminDashboard', () => {
  let component: AdminStatsChart;
  let fixture: ComponentFixture<AdminStatsChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminStatsChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminStatsChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
