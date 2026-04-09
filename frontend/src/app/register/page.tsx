'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiUserPlus } from 'react-icons/fi';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';
import styles from '@/styles/Auth.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [strength, setStrength] = useState('');

  const checkStrength = (pw: string) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[a-z]/.test(pw)) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/\d/.test(pw)) s++;
    if (/[!@#$%^&*]/.test(pw)) s++;
    setStrength(s < 3 ? 'weak' : s < 5 ? 'medium' : 'strong');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'password') checkStrength(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });
      showToast('Registration successful! Please login.', 'success');
      router.push('/login');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1>Create Account</h1>
          <p>Join our community and start your gaming journey</p>
        </div>

        <div className={styles.authBody}>
          <form className={styles.form} onSubmit={handleSubmit}>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>First Name</label>
                <div className={styles.inputWrapper}>
                  <FiUser />
                  <input type="text" name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} required />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Last Name</label>
                <div className={styles.inputWrapper}>
                  <FiUser />
                  <input type="text" name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Email Address</label>
              <div className={styles.inputWrapper}>
                <FiMail />
                <input type="email" name="email" placeholder="Enter your email" value={form.email} onChange={handleChange} required />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Password</label>
              <div className={styles.inputWrapper}>
                <FiLock />
                <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Create password" value={form.password} onChange={handleChange} required />
                <button type="button" className={styles.togglePassword} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {form.password && <div className={`${styles.strengthBar} ${styles[strength]}`} />}
            </div>

            <div className={styles.formGroup}>
              <label>Confirm Password</label>
              <div className={styles.inputWrapper}>
                <FiLock />
                <input type="password" name="confirmPassword" placeholder="Confirm password" value={form.confirmPassword} onChange={handleChange} required />
              </div>
            </div>

            <label className={styles.checkbox}>
              <input type="checkbox" required /> I agree to the Terms of Service and Privacy Policy
            </label>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              <FiUserPlus /> {loading ? 'Creating...' : 'Create Account'}
            </button>

            <div className={styles.divider}><span>or continue with</span></div>

            <div className={styles.socialBtns}>
              <button type="button" className={styles.socialBtn} onClick={() => showToast('Google signup coming soon!', 'warning')}>
                <FaGoogle /> Google
              </button>
              <button type="button" className={styles.socialBtn} onClick={() => showToast('Facebook signup coming soon!', 'warning')}>
                <FaFacebookF /> Facebook
              </button>
            </div>

            <div className={styles.authFooter}>
              Already have an account? <Link href="/login">Sign in here</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
