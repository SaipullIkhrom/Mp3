"use client";

import { useState } from 'react';
import { Music, Video } from 'lucide-react';
import Footer from '@/components/Footer';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDownload = (format: 'mp3' | 'mp4') => {
    if (!url) return alert('Masukkan URL YouTube terlebih dahulu!');
    
    // Validasi sederhana sebelum kirim ke backend
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      return alert('Link yang kamu masukkan bukan link YouTube!');
    }

    setLoading(true);
    
    // Memicu download browser ke API route
    window.location.href = `/api/download?url=${encodeURIComponent(url)}&format=${format}`;
    
    setTimeout(() => setLoading(false), 5000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex grow flex-col items-center justify-center bg-slate-900 p-6 text-white"> 
        <div className="w-full max-w-xl space-y-6 text-center">
          
          <h1 className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-4xl font-extrabold text-transparent">
            Yreaa Downloader Mp3
          </h1>
          
          <p className="text-gray-400">Download video YouTube favoritmu ke format MP3 atau MP4</p>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Tempel link YouTube di sini..."
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-4 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <div className="flex gap-2">
              <button
                onClick={() => handleDownload('mp3')}
                disabled={loading}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 p-3 font-bold transition-all hover:bg-red-700 disabled:opacity-50"
              >
                <Music size={20} />
                <span>Download MP3</span>
              </button>
              
              <button
                onClick={() => handleDownload('mp4')}
                disabled={loading}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 p-3 font-bold transition-all hover:bg-blue-700 disabled:opacity-50"
              >
                <Video size={20} />
                <span>Download MP4</span>
              </button>
            </div>
          </div>

          {loading && (
            <div className="space-y-2">
              <p className="animate-pulse font-medium text-yellow-400">
                Sedang memproses, mohon tunggu...
              </p>
              <p className="text-xs text-gray-500 italic">
                Jika download tidak berjalan otomatis, pastikan link YouTube valid.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}