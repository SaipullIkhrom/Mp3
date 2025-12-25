"use client";

import { useState } from "react";
import { Music, Video, Clipboard, X, CheckCircle2, Youtube } from "lucide-react";
import Script from "next/script";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"youtube" | "tiktok">("youtube");
  const [showToS, setShowToS] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

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

    // Membuka Smartlink di tab baru
    if (typeof window !== "undefined") {
      window.open(SMARTLINK_URL, "_blank");
    }

    // Validasi URL berdasarkan mode
    if (mode === "youtube" && !url.includes("youtube.com") && !url.includes("youtu.be")) {
      setStatus({ type: "error", msg: "Link YouTube tidak valid!" });
      return;
    }
    if (mode === "tiktok" && !url.includes("tiktok.com")) {
      setStatus({ type: "error", msg: "Link TikTok tidak valid!" });
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
        setStatus({ type: "success", msg: data.downloadUrl });
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
      <Script id="adsterra-social-bar" src="https://pl28329226.effectivegatecpm.com/e2/a3/69/e2a3694808f2a5d705128385eeed3318.js" strategy="afterInteractive" />
      <Script id="adsterra-invoke" src="https://pl28329370.effectivegatecpm.com/31b09a60258f959cd2cf3347ab59d8b1/invoke.js" strategy="afterInteractive" />
      <Script id="adsterra-third-ads" src="https://pl28329390.effectivegatecpm.com/2c/65/e4/2c65e469284747fef2e5b41c72ae43ae.js" strategy="afterInteractive" />
      <Script id="adsterra-popunder" src="https://www.effectivegatecpm.com/jv9a4v0t1?key=c037c705da6f3d090d5186d8209efbed" strategy="afterInteractive" />

      <div className="w-full max-w-2xl space-y-8">
        {/* Header Section */}
        <div className="space-y-3 text-center">
          <h1 className="bg-linear-to-tr from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-5xl font-black tracking-tight text-transparent sm:text-6xl">
            Yreaa Downloader
          </h1>
          <p className="mx-auto max-w-md text-lg text-slate-400">
            Download video YouTube & TikTok tanpa watermark secara instan.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => { setMode("youtube"); setStatus(null); setUrl(""); }}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${
              mode === "youtube" 
              ? "bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]" 
              : "bg-white/5 text-slate-400 hover:bg-white/10"
            }`}
          >
            <Youtube size={20} /> YouTube
          </button>
          <button
            onClick={() => { setMode("tiktok"); setStatus(null); setUrl(""); }}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${
              mode === "tiktok" 
              ? "bg-linear-to-r from-pink-600 to-black text-white shadow-[0_0_20px_rgba(219,39,119,0.4)]" 
              : "bg-white/5 text-slate-400 hover:bg-white/10"
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.06 3.42-.01 6.83-.02 10.25-.17 4.14-4.12 7.09-8.13 6.31-3.12-.45-5.61-3.35-5.41-6.49.1-3.35 3.12-6.05 6.47-5.63.45.05.89.17 1.3.33v4.19c-.42-.17-.88-.26-1.33-.27-1.42-.06-2.79.91-3.1 2.29-.38 1.4.38 3.05 1.74 3.65 1.15.53 2.66.21 3.44-.78.36-.45.54-1.01.53-1.58V.02z"/></svg>
            TikTok
          </button>
        </div>

        {/* Input Section */}
        <div className={`group relative rounded-2xl border transition-all p-2 shadow-2xl backdrop-blur-xl ${
          mode === "youtube" ? "border-red-500/20 bg-red-500/5 hover:border-red-500/40" : "border-pink-500/20 bg-pink-500/5 hover:border-pink-500/40"
        }`}>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={mode === "youtube" ? "Tempel link YouTube..." : "Tempel link TikTok..."}
              className="w-full bg-transparent p-4 text-lg outline-hidden placeholder:text-slate-500"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <div className="flex pr-2 gap-1">
              {url && (
                <button onClick={() => setUrl("")} className="p-2 text-slate-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              )}
              <button onClick={handlePaste} className="rounded-lg bg-white/10 p-3 text-slate-300 transition-all hover:bg-white/20 active:scale-95">
                <Clipboard size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {mode === "youtube" ? (
            <>
              <button
                onClick={() => handleDownload("mp3")}
                disabled={loading || !url}
                className="flex items-center justify-center gap-3 rounded-xl bg-linear-to-r from-red-600 to-rose-600 p-4 font-bold shadow-lg transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
              >
                <Music size={22} /> Download MP3
              </button>
              <button
                onClick={() => handleDownload("mp4")}
                disabled={loading || !url}
                className="flex items-center justify-center gap-3 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 p-4 font-bold shadow-lg transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
              >
                <Video size={22} /> Download MP4
              </button>
            </>
          ) : (
            <button
              onClick={() => handleDownload("mp4")}
              disabled={loading || !url}
              className="sm:col-span-2 flex items-center justify-center gap-3 rounded-xl bg-linear-to-r from-pink-600 to-black p-4 font-bold shadow-lg transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
            >
              <Video size={22} /> Download No Watermark
            </button>
          )}
        </div>

        {/* Status & Result Card */}
        <div className="min-h-10 text-center">
          {loading && (
            <div className="flex items-center justify-center gap-3 py-4">
              <div className={`h-6 w-6 animate-spin rounded-full border-2 border-t-transparent ${mode === 'youtube' ? 'border-red-400' : 'border-pink-400'}`}></div>
              <span className={mode === 'youtube' ? 'text-red-400' : 'text-pink-400'}>Sedang memproses...</span>
            </div>
          )}

          {status && (
            <div className="animate-in fade-in zoom-in duration-500">
              {status.type === "success" ? (
                <div className="mt-4 overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 backdrop-blur-md">
                  <div className="mb-4 flex items-center justify-center gap-2 text-emerald-400">
                    <CheckCircle2 size={24} />
                    <span className="text-lg font-bold">File Siap di Download!</span>
                  </div>
                  <a
                    href={status.msg}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-8 py-4 font-bold text-white transition-all hover:scale-[1.02] active:scale-95 shadow-lg"
                  >
                    <Video size={24} className="animate-bounce" />
                    SIMPAN KE PERANGKAT
                  </a>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-red-400 bg-red-400/5 py-3 rounded-lg border border-red-400/20">
                  <X size={18} />
                  <span className="font-medium">{status.msg}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div id="container-31b09a60258f959cd2cf3347ab59d8b1"></div>

        <footer className="mt-12 text-center pb-8 border-t border-white/5 pt-6">
          <div className="flex justify-center gap-6 text-sm text-slate-500 mb-4">
            <button onClick={() => setShowToS(true)} className="hover:text-blue-400 transition-colors">Terms of Service</button>
            <a href="mailto:support@yreaa.com" className="hover:text-blue-400 transition-colors">Contact</a>
          </div>
          <p className="text-[10px] text-slate-600">© 2025 Yreaa Downloader. We are not affiliated with YouTube or TikTok.</p>
        </footer>

        {/* Modal ToS */}
        {showToS && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-blue-400">Terms of Service</h2>
                <button onClick={() => setShowToS(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
              </div>
              <div className="text-sm text-slate-300 space-y-3 overflow-y-auto max-h-[60vh] pr-2">
                <p><strong>1. Layanan:</strong> Menyediakan konversi video YouTube dan TikTok untuk penggunaan pribadi.</p>
                <p><strong>2. Hak Cipta:</strong> Pengguna bertanggung jawab penuh atas konten yang diunduh.</p>
                <p><strong>3. Iklan:</strong> Website didukung oleh iklan pihak ketiga (Adsterra).</p>
              </div>
              <button onClick={() => setShowToS(false)} className="mt-6 w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold">Tutup</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}