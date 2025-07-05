'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_BACKEND_URL; 

const VerifyEmail: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string>('Verifying...');

  useEffect(() => {
    const verifyEmail = async () => {
      const email = searchParams.get('email');
      const token = searchParams.get('token');

      if (!email || !token) {
        setStatus('Invalid verification link');
        return;
      }

      try {
        await axios.get(`${API}/students/verify-email`, {
          params: { email, token },
        });

        setStatus('Email verified successfully! You can now close this page.');
      } catch (error) {
        console.error('Verification error:', error);
        setStatus(
          'Verification failed. Please try again.'
        );
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-semibold mb-4">Email Verification</h2>
      <p>{status}</p>
      {status.includes('successfully') && (
        <button
          onClick={() => router.push('/')}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Return to Home
        </button>
      )}
    </div>
  );
};

export default VerifyEmail;
