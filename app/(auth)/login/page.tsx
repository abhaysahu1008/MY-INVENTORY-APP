'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { loginUser } from '../../actions/auth';

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    if (password.length > 100) {
      setError("Password must be less than 100 characters");
      setLoading(false);
      return;
    }

    const commonPasswords = ['password', '12345678', 'qwerty123', 'admin123'];
    if (commonPasswords.includes(password.toLowerCase())) {
      setError("Password is too common. Please choose a stronger password");
      setLoading(false);
      return;
    }

    const result = await loginUser(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    switch (result?.user?.role) {
      case "OWNER":
        if (result.user.companySlug) {
          router.push(`/dashboard/${result.user.companySlug}`);
        } else {
          router.push("/add-company");
        }
        break;

      case "MANAGER":
        router.push(`/dashboard/${result.user.companySlug}`);
        break;

      case "EMPLOYEE":
        router.push("/pos");
        break;

      default:
        setError("Invalid user role");
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Create Your Account</h2>
      <p style={{ color: '#666' }}>You will be the owner of your company</p>

      <form action={handleSubmit}>

        <div style={{ marginBottom: '15px' }}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            name="password"
            placeholder="Password (min 8 characters)"
            required
            minLength={8}
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
        </div>



        {error && (
          <p style={{
            color: 'red',
            backgroundColor: '#ffebee',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '15px'
          }}>
            ❌ {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Login in...' : 'Login'}
        </button>
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Dont have an account? <Link href="/register">Register</Link>
      </p>
    </div>
  );
};


export default LoginPage;
