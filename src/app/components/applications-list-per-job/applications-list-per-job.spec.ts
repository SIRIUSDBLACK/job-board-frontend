import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationsListPerJob } from './applications-list-per-job';

describe('ApplicationsListPerJob', () => {
  let component: ApplicationsListPerJob;
  let fixture: ComponentFixture<ApplicationsListPerJob>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationsListPerJob]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationsListPerJob);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
