"use client";
import React, { useState, useContext, useEffect } from 'react';
import { X, User } from 'lucide-react';
import { Button } from '@/components/ui/button'
import { signIn } from "next-auth/react";
import Image from 'next/image'

const SignInButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [theme, setTheme] = useState("light");

  const handleOpenModal = () => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setDisabled(true);
      await signIn('email', { email, callbackUrl: '/' });
    } catch (error) {
      setLoading(false);
      setDisabled(false);
      console.error('Error signing in', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: `/` });
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  return (
    <div>
      <Button variant="outline" size="icon" onClick={handleOpenModal}>
        <div className="flex items-center justify-center">
          <User className="h-[1.2rem] w-[1.2rem]" aria-label="user" />
        </div>
      </Button>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#1B1D21] bg-opacity-50 z-50">
          <div
            className={`p-6 rounded shadow-xl w-96 border ${theme == "light" ? "bg-white" : "bg-[#1B1D21]"
              }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Sign In</h2>
              <X
                onClick={handleCloseModal}
                color="red"
                className="cursor-pointer"
              />
            </div>

            <div className="mb-5 mt-5" onClick={handleGoogleSignIn}>
              {theme === "light" ? (
                <Image
                  src='/svg/google-logo-light.svg'
                  width={200}
                  height={50}
                  alt='google-logo-light'
                  className="cursor-pointer"
                />
              ) : (
                <Image
                  src='/svg/google-logo-dark.svg'
                  width={200}
                  height={50}
                  alt='google-logo-dark'
                  className="cursor-pointer"
                />
              )}
            </div>

            <label className='font-bold text-sm'>Sign in with Magic link:</label>
            <input
              type="email"
              value={email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full mb-4 mt-1 p-2 border border-gray-300 rounded"
              required
            />
            <button
              className="py-2 px-4 bg-[#1B1D21] text-white rounded border"
              onClick={handleSignIn}
              disabled={disabled}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>


          </div>
        </div>
      )}
    </div>
  );
};

export default SignInButton;
