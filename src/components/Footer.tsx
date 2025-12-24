// src/components/Footer.tsx
import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-800 p-6 text-center text-gray-400 mt-auto">
      <div className="max-w-xl mx-auto flex flex-col items-center justify-center space-y-3">
        <p>&copy; {new Date().getFullYear()} Saipul Downloader. All rights reserved.</p>
        <p>Made with ❤️ by Saipul</p>
        <div className="flex gap-4">
          <a
            href="https://www.instagram.com/saipul_dev/" // Ganti dengan link Instagram kamu
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
          >
            Instagram
          </a>
          <a
            href="https://github.com/saipul" // Opsional: Link GitHub atau lainnya
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-gray-100 transition-colors duration-200"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}