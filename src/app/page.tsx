"use client";

import { useState } from "react";
import { Music, Video, Clipboard, X, CheckCircle2 } from "lucide-react";
import Script from "next/script";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  // LINK SMARTLINK BARU SAIPUL
  const SMARTLINK_URL = "https://www.effectivegatecpm.com/f1v3pp7j?key=44fbd607e91a5eeaba21e30c13f89b49";

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

    // --- EKSEKUSI SMARTLINK ---
    // Membuka tab iklan baru saat tombol diklik
    if (typeof window !== "undefined") {
      window.open(SMARTLINK_URL, "_blank");
    }

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
      {/* 1. SOCIAL BAR */}
      <Script
        id="adsterra-social-bar"
        src="https://pl28329226.effectivegatecpm.com/e2/a3/69/e2a3694808f2a5d705128385eeed3318.js"
        strategy="afterInteractive"
      />

      {/* 2. INVOKE */}
      <Script
        id="adsterra-invoke"
        src="https://pl28329370.effectivegatecpm.com/31b09a60258f959cd2cf3347ab59d8b1/invoke.js"
        strategy="afterInteractive"
      />

      {/* 3. SCRIPT TAMBAHAN */}
      <Script
        id="adsterra-third-ads"
        src="https://pl28329390.effectivegatecpm.com/2c/65/e4/2c65e469284747fef2e5b41c72ae43ae.js"
        strategy="afterInteractive"
      />

      {/* 4. POPUNDER */}
      <Script
        id="adsterra-popunder"
        src="https://www.effectivegatecpm.com/jv9a4v0t1?key=c037c705da6f3d090d5186d8209efbed"
        strategy="afterInteractive"
      />

      <div className="w-full max-w-2xl space-y-8">
        <div className="space-y-3 text-center">
          <h1 className="bg-linear-to-tr from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-5xl font-black tracking-tight text-transparent sm:text-6xl">
            Yreaa Downloader
          </h1>
          <p className="mx-auto max-w-md text-lg text-slate-400">
            Cara tercepat untuk konversi video YouTube menjadi MP3 atau MP4 berkualitas tinggi.
          </p>
        </div>

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
                >
                  <X size={20} />
                </button>
              )}
              <button
                onClick={handlePaste}
                className="rounded-lg bg-white/10 p-3 text-slate-300 transition-all hover:bg-white/20 active:scale-95"
              >
                <Clipboard size={20} />
              </button>
            </div>
          </div>
        </div>

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

        <div className="min-h-10 text-center">
          {loading && (
            <div className="flex items-center justify-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-400 border-t-transparent"></div>
              <span className="font-medium text-blue-400">Memproses...</span>
            </div>
          )}
          {status && (
            <div className={`flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-300 ${status.type === "success" ? "text-emerald-400" : "text-red-400"}`}>
              {status.type === "success" && <CheckCircle2 size={18} />}
              <span className="font-medium">{status.msg}</span>
            </div>
          )}
        </div>

        <div id="container-31b09a60258f959cd2cf3347ab59d8b1"></div>
      </div>
    </div>
  );
}