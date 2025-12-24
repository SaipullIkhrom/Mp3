import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const format = searchParams.get("format");

  if (!url) {
    return NextResponse.json({ error: "URL tidak boleh kosong" }, { status: 400 });
  }

  try {
    // 1. Ambil Video ID dari URL YouTube
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();

    if (!videoId) {
      throw new Error("ID Video tidak ditemukan");
    }

    // 2. Panggil API dari RapidAPI (YouTube MP3)
    const res = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`, {
      method: 'GET',
      headers: {
        // Gunakan Key yang ada di gambar kamu
        'x-rapidapi-key': '60ba667ea8msh8a4d3066ccd8c5ep159555jsncd08727aa2d1',
        'x-rapidapi-host': 'youtube-mp36.p.rapidapi.com'
      }
    });

    const data = await res.json();

    // 3. Cek apakah API memberikan link download (biasanya di field 'link')
    if (data.status === "ok" && data.link) {
      return NextResponse.json({ downloadUrl: data.link });
    } else {
      throw new Error(data.msg || "Gagal mendapatkan link download dari API.");
    }

  } catch (error: any) {
    console.error("RapidAPI Error:", error.message);
    return NextResponse.json(
      { error: `Terjadi kesalahan: ${error.message}` },
      { status: 500 }
    );
  }
}