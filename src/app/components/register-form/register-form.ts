import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register-form.html',
  styleUrl: './register-form.scss',
})
export class RegisterForm {
  constructor(private authService: AuthService, private router: Router) {}
  errorNoti = signal("")
  registerForm = new FormGroup(
    {
      name: new FormControl('', [Validators.maxLength(20), Validators.required]),
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.minLength(6), Validators.required]),
      confirm_password: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
    },
    {
      validators: passwordMatchValidator,
    }
  );



  onSubmit = (): void => {
    if (this.registerForm.valid) {
      const registerPayload = {
        name: this.registerForm?.get('name')!.value,
        email: this.registerForm.get('email')!.value,
        password: this.registerForm.get('password')!.value,
        role: this.registerForm.get('role')!.value,
      };
      this.authService.register(registerPayload).subscribe({
        next: (res) => {
          console.log(res);
          this.registerForm.reset();
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.log(err.error.message);
          this.errorNoti.set(err.error.message)
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
      console.log('Form Invalid ');
    }
  };
}

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirm_password = control.get('confirm_password')?.value;

  return password === confirm_password ? null : { passwordsMismatch: true };
};
