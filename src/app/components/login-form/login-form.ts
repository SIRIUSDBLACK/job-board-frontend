import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  constructor(private authService: AuthService, private router: Router) {}
  errorNoti = signal("");
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.minLength(6), Validators.required]),
  });

  onSubmit = (): void => {
    if (this.loginForm.valid) {
      const loginPayload = {
        email: this.loginForm.get('email')!.value,
        password: this.loginForm.get('password')!.value,
      };
      this.authService.login(loginPayload).subscribe({
        next: (res) => {
          console.log(res);
          this.loginForm.reset();
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.log(err.error.message);
          this.errorNoti.set(err.error.message);
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
      console.log('Form Invalid ');
    }
  };

  //   onSubmit = (): void => {
  //     if (this.registerForm.valid) {
  //       const registerPayload = {
  //         name: this.registerForm?.get('name')!.value,
  //         email: this.registerForm.get('email')!.value,
  //         password: this.registerForm.get('password')!.value,
  //         role: this.registerForm.get('role')!.value,
  //       };
  //       this.authService.register(registerPayload).subscribe({
  //         next: (res) => {
  //           console.log(res);
  //           this.registerForm.reset();
  //           this.router.navigate(['/dashboard']);
  //         },
  //         error: (err) => {
  //           console.log(err.error.message);
  //           this.errorNoti.set(err.error.message)
  //         },
  //       });
  //     } else {
  //       this.registerForm.markAllAsTouched();
  //       console.log('Form Invalid ');
  //     }
  //   };
  // }
}
