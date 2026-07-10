import { Component, inject, signal } from '@angular/core';
import { Card } from '../../components/card/card';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from '../../components/button/button';
import { SwitchButton } from '../../components/switch-button/switch-button';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, Card, Button, SwitchButton],
  templateUrl: './auth.html',
})
export class Auth {
  mode = signal<'login' | 'signup'>('login');
  private fb = inject(FormBuilder);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  signupForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onLoginSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    console.log(this.loginForm.value);
  }

  onSignupSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    console.log(this.signupForm.value);
  }
}
