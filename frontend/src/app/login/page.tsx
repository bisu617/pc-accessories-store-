'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';
import styles from '@/styles/Auth.module.css';

export default function LoginPage() {
  const router = useRouter();
  const { login, loading } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      showToast('Login successful!', 'success');
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1>Welcome Back!</h1>
          <p>Sign in to access your account and continue shopping</p>
        </div>

        <div className={styles.authBody}>
          <form className={styles.form} onSubmit={handleSubmit}>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.formGroup}>
              <label>Email Address</label>
              <div className={styles.inputWrapper}>
                <FiMail />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Password</label>
              <div className={styles.inputWrapper}>
                <FiLock />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className={styles.formOptions}>
              <label className={styles.checkbox}>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className={styles.forgotLink}>Forgot Password?</a>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              <FiLogIn /> {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className={styles.divider}>
              <span>or continue with</span>
            </div>

            <div className={styles.socialBtns}>
              <button type="button" className={styles.socialBtn} onClick={() => showToast('Google login coming soon!', 'warning')}>
                <FaGoogle /> Google
              </button>
              <button type="button" className={styles.socialBtn} onClick={() => showToast('Facebook login coming soon!', 'warning')}>
                <FaFacebookF /> Facebook
              </button>
            </div>

            <div className={styles.authFooter}>
              Don&apos;t have an account?{' '}
              <Link href="/register">Sign up here</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
