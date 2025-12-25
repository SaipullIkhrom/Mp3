"use client";

import { useState } from "react";
import { Music, Video, Clipboard, X, CheckCircle2 } from "lucide-react";
import Script from "next/script"; // Siap untuk iklan eksternal

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  // Fungsi untuk menempelkan link dari clipboard secara otomatis
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch (err) {
      alert("Gagal mengakses clipboard. Silakan tempel manual.");
    }
  };

  const handleDownload = async (format: "mp3" | "mp4") => {
    if (!url) return;

    // Validasi sederhana link YouTube
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
      setStatus({ type: "error", msg: "Link YouTube tidak valid!" });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(
        `/api/download?url=${encodeURIComponent(url)}&format=${format}`
      );
      const data = await res.json();

      if (data.downloadUrl) {
        // Memicu trigger download otomatis di browser
        const link = document.createElement("a");
        link.href = data.downloadUrl;
        link.setAttribute("download", "");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setStatus({ type: "success", msg: "Download berhasil dimulai!" });
      } else {
        setStatus({
          type: "error",
          msg: data.error || "Gagal memproses video.",
        });
      }
    } catch (err) {
      setStatus({ type: "error", msg: "Kesalahan koneksi ke server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white selection:bg-blue-500/30">
      <Script
        id="adsterra-ads"
        src="//www.highperformanceformat.com/ads-code.js"
        strategy="afterInteractive"
      />

      <div className="w-full max-w-2xl space-y-8">
        {/* SLOT IKLAN ATAS */}
        <div className="flex justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-2 transition-colors hover:bg-slate-900/60">
          <p className="text-[10px] font-medium tracking-widest text-slate-600 uppercase">
            Space for Advertisement
          </p>
        </div>

        {/* Header Section */}
        <div className="space-y-3 text-center">
          <h1 className="bg-linear-to-tr from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-5xl font-black tracking-tight text-transparent sm:text-6xl">
            Yreaa Downloader
          </h1>
          <p className="mx-auto max-w-md text-lg text-slate-400">
            Cara tercepat untuk konversi video YouTube menjadi MP3 atau MP4
            berkualitas tinggi.
          </p>
        </div>

        {/* Input Card dengan Glassmorphism */}
        <div className="group relative rounded-2xl border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur-xl transition-all hover:border-white/20">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Tempel link YouTube di sini..."
              className="w-full bg-transparent p-4 text-lg outline-hidden placeholder:text-slate-500"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <div className="flex pr-2 gap-1">
              {url && (
                <button
                  onClick={() => setUrl("")}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                  title="Hapus input"
                >
                  <X size={20} />
                </button>
              )}
              <button
                onClick={handlePaste}
                title="Tempel link"
                className="rounded-lg bg-white/10 p-3 text-slate-300 transition-all hover:bg-white/20 active:scale-95"
              >
                <Clipboard size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            onClick={() => handleDownload("mp3")}
            disabled={loading || !url}
            className="flex items-center justify-center gap-3 rounded-xl bg-linear-to-r from-red-600 to-rose-600 p-4 font-bold shadow-lg shadow-red-900/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Music size={22} />
            Download MP3
          </button>

          <button
            onClick={() => handleDownload("mp4")}
            disabled={loading || !url}
            className="flex items-center justify-center gap-3 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 p-4 font-bold shadow-lg shadow-blue-900/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Video size={22} />
            Download MP4
          </button>
        </div>

        {/* Status & Loading Section */}
        <div className="min-h-10 text-center">
          {loading && (
            <div className="flex items-center justify-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-400 border-t-transparent"></div>
              <span className="font-medium text-blue-400">
                Memproses permintaan Anda...
              </span>
            </div>
          )}

          {status && (
            <div
              className={`flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-300 ${
                status.type === "success" ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {status.type === "success" && <CheckCircle2 size={18} />}
              <span className="font-medium">{status.msg}</span>
            </div>
          )}
        </div>

        {/* SLOT IKLAN BAWAH */}
        <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-4 transition-colors hover:bg-slate-900/60">
          <p className="text-xs font-medium tracking-widest text-slate-600 uppercase">
            Native Ads Space
          </p>
        </div>
      </div>
    </div>
  );
}
