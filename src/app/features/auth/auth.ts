import { Component, inject, signal } from '@angular/core';
import { Card } from '../../components/card/card';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from '../../components/button/button';
import { SwitchButton } from '../../components/switch-button/switch-button';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, Card, Button, SwitchButton],
  templateUrl: './auth.html',
})
export class Auth {
  mode = signal<'login' | 'signup'>('login');
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private toast = inject(ToastrService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  signupForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  async onLoginSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    const { data, error } = await this.auth.signIn(
      email!,
      password!
    );

    if (error) {
      this.toast.error(error.message);
      return;
    }

    this.toast.success('Connexion réussie 🎉');

    console.log('User connecté:', data);

    await this.router.navigate(['/']);
  }

  async onSignupSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const { email, password, username } = this.signupForm.value;

    const { data, error } = await this.auth.signUp(
      email!,
      password!,
      username!
    );

    if (error) {
      this.toast.error(error.message);
      return;
    }

    this.toast.success('Inscription réussie 🎉');

    this.signupForm.reset();

    this.mode.set('login');

    console.log('User créé:', data);
  }}
