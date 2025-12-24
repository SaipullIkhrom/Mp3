"use client";

import { useState } from "react";
import { Music, Video } from "lucide-react";
import Footer from "@/components/Footer";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = async (format: "mp3" | "mp4") => {
    if (!url) return alert("Masukkan URL YouTube terlebih dahulu!");

    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
      return alert("Link yang kamu masukkan bukan link YouTube!");
    }

    setLoading(true);

    try {
      // 1. Meminta link download dari backend (RapidAPI)
      const res = await fetch(`/api/download?url=${encodeURIComponent(url)}&format=${format}`);
      const data = await res.json();

      if (data.downloadUrl) {
        // 2. Memicu browser untuk mendownload file dari link yang didapat
        const link = document.createElement("a");
        link.href = data.downloadUrl;
        link.setAttribute("download", ""); // Memaksa browser mengunduh
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert(data.error || "Gagal memproses video.");
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex grow flex-col items-center justify-center bg-slate-900 p-6 text-white">
        <div className="w-full max-w-xl space-y-6 text-center">
          {/* Judul dengan gradient Tailwind v4 */}
          <h1 className="bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-4xl font-extrabold text-transparent">
            Yreaa Downloader Mp3
          </h1>

          <p className="text-gray-400">
            Download video YouTube favoritmu ke format MP3 atau MP4
          </p>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Tempel link YouTube di sini..."
              // focus:outline-hidden adalah standar Tailwind v4
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-4 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleDownload("mp3")}
                disabled={loading}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 p-3 font-bold transition-all hover:bg-red-700 disabled:opacity-50"
              >
                <Music size={20} />
                <span>Download MP3</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownload("mp4")}
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
              {/* Spinner sederhana untuk indikator loading */}
              <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-yellow-400 border-t-transparent"></div>
              <p className="animate-pulse font-medium text-yellow-400">
                Sedang memproses, mohon tunggu...
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}