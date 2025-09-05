import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobStore } from '../../services/job-store/job-store';

@Component({
  selector: 'app-job-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './job-form.html',
  styleUrl: './job-form.scss',
})
export class JobForm {
  constructor(private jobStore: JobStore) {}

  jobForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    salary: new FormControl('', [Validators.required, Validators.min(100)]),
    location: new FormControl('', [Validators.required]),
  });

  onSubmit(): void {
    if (this.jobForm.valid) {
      const jobFormValue = this.jobForm.value;

      const jobFormPayload = {
        title: jobFormValue.title as string,
        description: jobFormValue.description as string,
        location: jobFormValue.location as string,
        salary: Number(jobFormValue.salary), // Convert the validated string to a number
      };

      if (jobFormPayload) {
        this.jobStore.createJob(jobFormPayload).subscribe({
          next: (res) => {
            console.log('Job created successfully');
            console.log(res);
            this.jobForm.reset();
          },
          error: (err) => {
            console.log(err.error.message);
          },
        });
      }
      console.log('Form Submitted!', this.jobForm.value);
      // Here you would integrate with your backend service
    } else {
      console.log('Form is invalid. Please fill out all required fields.');
    }
  }
}
