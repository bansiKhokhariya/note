import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useSession } from "next-auth/react";
import { X } from 'lucide-react'

export default function GuestModal({ noteUniqueId, onSubmit, isOpen, theme, onClose, handleGoogleSignIn, title, setTitle, email, setEmail }) {
  const { data: session, status } = useSession();
  if (!isOpen) return null;

  const currentUrl = `https://snowy.hksync.com/${noteUniqueId}`;

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=Check%20this%20out!`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(currentUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=Check%20this%20out!`
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#1B1D21] bg-opacity-50 z-50">
      <div className={`p-6 rounded shadow-xl w-full sm:w-3/4 md:w-1/2 lg:w-1/3 max-w-lg border ${theme === "light" ? "bg-white" : "bg-[#1B1D21] text-white"}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Make a Guest Account</h2>
          <X size={24} color="red" className="cursor-pointer" onClick={onClose} />
        </div>
        <label htmlFor="title" className="text-sm">Enter your note title:</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your note title here"
          className="w-full text-sm p-2 border border-gray-300 rounded mb-3 mt-1"
          required
        />
        {!session?.user && <>
          <label htmlFor="email" className="text-sm mb-5">Enter your email (optional):</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full text-sm p-2 border border-gray-300 rounded  mt-1"
          />
          <p className="text-xs text-green-500 mb-3">This will create a guest account</p>
          <div className="mb-3" onClick={handleGoogleSignIn}>
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
        </>}
        <div>
          <div>Your note URL:</div>
          <p className="border p-2 mt-1 text-sm">
            {currentUrl}
          </p>
        </div>
        <Button className="w-full mt-6" onClick={onSubmit}>OK</Button>
        <div className="mt-3 flex justify-center">
          <div className='flex gap-2 items-center'>
            <a href={shareUrls.facebook} target="_blank" rel="noopener noreferrer">
              <Image src='/svg/facebook.svg' width={30} height={30} className='rounded' alt='facebook' />
            </a>
            <a href={shareUrls.twitter} target="_blank" rel="noopener noreferrer">
              <Image src='/svg/twitter.svg' width={30} height={30} className='rounded' alt='twitter' />
            </a>
            <a href={shareUrls.whatsapp} target="_blank" rel="noopener noreferrer">
              <Image src='/images/whatsapp.webp' width={30} height={30} className='rounded w-7 h-7' alt='whatsapp' />
            </a>
            <a href={shareUrls.telegram} target="_blank" rel="noopener noreferrer">
              <Image src='/svg/telegram.svg' width={35} height={35} className='rounded' alt='telegram' />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
