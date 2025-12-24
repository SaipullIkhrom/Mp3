import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const format = searchParams.get("format");

  if (!url) return NextResponse.json({ error: "URL kosong" }, { status: 400 });

  try {
    // Ambil Video ID dari URL
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
    
    // Menggunakan Instance Invidious yang stabil
    const invidiousRes = await fetch(`https://invidious.sethforprivacy.com/api/v1/videos/${videoId}`);
    const data = await invidiousRes.json();

    if (!data.formatStreams || data.formatStreams.length === 0) {
      throw new Error("Video tidak ditemukan atau tidak bisa diproses.");
    }

    
    let finalUrl = "";
    if (format === "mp3") {
  
      const audioStream = data.adaptiveFormats.find((f: any) => f.type.includes('audio/webm') || f.type.includes('audio/mp4'));
      finalUrl = audioStream?.url;
    } else {
  
      finalUrl = data.formatStreams[0]?.url;
    }

    if (!finalUrl) throw new Error("Link download tidak tersedia.");

    return NextResponse.json({ downloadUrl: finalUrl });
  } catch (error: any) {
    console.error("Error:", error.message);
    return NextResponse.json(
      { error: "YouTube memblokir akses ini. Coba video lain yang lebih pendek." },
      { status: 500 }
    );
  }
}