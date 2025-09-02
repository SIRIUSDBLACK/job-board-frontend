import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-register-form',
  imports: [CommonModule , ReactiveFormsModule ,RouterLink],
  templateUrl: './register-form.html',
  styleUrl: './register-form.scss'
})
export class RegisterForm {
   
  registerForm = new FormGroup(
    {
    name : new FormControl('',[Validators.maxLength(20) , Validators.required]),
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.minLength(6), Validators.required]),
    confirm_password: new FormControl('', [Validators.required]),
    role : new FormControl('',[Validators.required])
  },
  {
    validators : passwordMatchValidator
  }
);

  onSubmit = (): void => {
    if (this.registerForm.valid) {
      console.log('Form Subbmited ', this.registerForm.value);
      this.registerForm.reset();
    } else {
      this.registerForm.markAllAsTouched();
      console.log('Form Invalid ');
    }
  };
}

export const passwordMatchValidator : ValidatorFn  = (control : AbstractControl) : ValidationErrors | null =>  {
  const password = control.get('password')?.value;
  const confirm_password = control.get('confirm_password')?.value;

  return password === confirm_password ? null : {passwordsMismatch : true}
} 


