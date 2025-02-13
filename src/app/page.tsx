"use client"
import React from 'react';

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

function HomePage() {
  const router = useRouter()
  const handleGettingStart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const authToken = Cookies.get("auth-token");
    if (authToken) {
      router.push("/dashboard");
    } else {
      router.push("/sign-in");
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 pt-[20vh]">
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold text-black">Welcome to Anonymous Messages</h1>
        <p className="text-gray-700 mt-3 text-base">
          Send and receive anonymous messages securely with your unique URL.
        </p>
      </header>

      <main className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-black p-4 rounded-full inline-block">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold mt-3">Get Your Unique URL</h3>
              <p className="text-gray-600 mt-2 text-sm">
              Every user receives a unique, secure link to share from their dashboard.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-black p-4 rounded-full inline-block">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold mt-3">Share Your Link</h3>
              <p className="text-gray-600 mt-2 text-sm">
                Share your URL with friends or anyone online.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-black p-4 rounded-full inline-block">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold mt-3">Receive Anonymous Messages</h3>
              <p className="text-gray-600 mt-2 text-sm">
                View the messages in your secure dashboard.
              </p>
            </div>
          </div>
        </section>

        <section className="text-center mt-8">
          <button  onClick={handleGettingStart} className="bg-black text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-800 transition text-sm">
              Get Started Now
          </button>
  
        </section>
      </main>

    </div>
  );
}

export default HomePage;
