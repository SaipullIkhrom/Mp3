import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const format = searchParams.get("format"); // mp3 atau mp4

  if (!url) {
    return NextResponse.json({ error: "URL tidak boleh kosong" }, { status: 400 });
  }

  try {
    // Menggunakan API Cobalt (Gratis & Open Source)
    const response = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: url,
        downloadMode: format === "mp3" ? "audio" : "video",
        videoQuality: "720",
        audioFormat: "mp3",
      }),
    });

    const data = await response.json();

    if (data.status === "stream" || data.status === "picker" || data.status === "redirect") {
      // Mengarahkan user langsung ke link download yang diberikan API
      return NextResponse.json({ downloadUrl: data.url });
    } else {
      throw new Error(data.text || "Gagal mendapatkan link download");
    }
  } catch (error: any) {
    console.error("API Error:", error.message);
    return NextResponse.json(
      { error: "Server sibuk atau link tidak didukung. Coba lagi nanti." },
      { status: 500 }
    );
  }
}