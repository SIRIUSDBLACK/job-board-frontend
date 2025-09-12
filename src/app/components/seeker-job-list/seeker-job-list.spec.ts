import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekerJobList } from './seeker-job-list';

describe('SeekerJobList', () => {
  let component: SeekerJobList;
  let fixture: ComponentFixture<SeekerJobList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeekerJobList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeekerJobList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
