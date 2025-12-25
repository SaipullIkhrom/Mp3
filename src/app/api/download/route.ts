import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const format = searchParams.get("format") || "mp3";

  if (!url) {
    return NextResponse.json({ error: "URL tidak ditemukan" }, { status: 400 });
  }

  try {
    // Memanggil Cobalt API (Public Instance)
    const response = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        url: url,
        downloadMode: format === "mp3" ? "audio" : "video",
        audioFormat: "mp3",
        videoQuality: "720",
      }),
    });

    const data = await response.json();

    if (data.status === "stream" || data.status === "picker" || data.status === "redirect") {
      // Cobalt mengembalikan link di property 'url'
      return NextResponse.json({ downloadUrl: data.url });
    } else {
      return NextResponse.json({ error: "Gagal memproses video. Pastikan link benar." }, { status: 500 });
    }
  } catch (error) {
    console.error("Cobalt Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server Cobalt." }, { status: 500 });
  }
}