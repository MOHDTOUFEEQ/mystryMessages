"use client"
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { useSession } from "next-auth/react";

function HomePage() {
  const { data } = useSession();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 pt-[15vh]">
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
            {data?.user ?
                (<Link href="/dashboard">
                  <button className="bg-black text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-800 transition text-sm">
                      Get Started Now
                  </button>
                  </Link>)
                :
        (<Link href="/sign-in">
        <button className="bg-black text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-800 transition text-sm">
            Get Started Now
        </button>
        </Link>)

            }
        </section>
      </main>

      <footer className="mt-10 text-gray-500 text-xs">
        <p>© 2025 Anonymous Messages. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
