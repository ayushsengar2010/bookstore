"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2">
            <h1 className="text-5xl font-bold leading-tight mb-8 text-gray-900">
              Your Personal
              <span className="text-blue-600"> Digital Library</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Store, manage, and read your PDF books and documents in one place.
              Access your library anywhere, anytime.
            </p>
            <div className="flex gap-4">
              <Link 
                href="/login" 
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Get Started
              </Link>
              <Link
                href="/register"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 mt-10 lg:mt-0">
            <div className="relative w-full h-[400px]">
              <Image
                src="/library-hero.svg"
                alt="Digital Library"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Features that make reading better
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Easy Organization"
              description="Organize your books with tags, categories, and custom collections."
              icon="📚"
            />
            <FeatureCard 
              title="Smart Reading"
              description="Highlight text, add notes, and bookmark important pages."
              icon="📖"
            />
            <FeatureCard 
              title="Cloud Sync"
              description="Access your library from any device, anywhere in the world."
              icon="☁️"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-8">
        <div className="container mx-auto px-6 text-center text-gray-600">
          <p>© 2025 Digital Library. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ title, description, icon }: { title: string; description: string; icon: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default LandingPage;
