import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.minLength(6), Validators.required]),
  });

  onSubmit = (): void => {
    if (this.loginForm.valid) {
      console.log('Form Subbmited ', this.loginForm.value);
      this.loginForm.reset();
    } else {
      this.loginForm.markAllAsTouched();
      console.log('Form Invalid ');
    }
  };
}
