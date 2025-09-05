import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobTable } from './job-table';

describe('JobTable', () => {
  let component: JobTable;
  let fixture: ComponentFixture<JobTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
