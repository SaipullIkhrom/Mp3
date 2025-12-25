import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL tidak boleh kosong" },
      { status: 400 }
    );
  }

  try {
    // Fungsi ekstraksi ID yang lebih kuat
    const extractVideoId = (url: string) => {
      const regExp =
        /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      const match = url.match(regExp);
      return match && match[7].length === 11 ? match[7] : null;
    };

    const videoId = extractVideoId(url);

    if (!videoId) {
      return NextResponse.json(
        { error: "ID Video YouTube tidak valid" },
        { status: 400 }
      );
    }

    // Gunakan objek Headers untuk menghindari error TypeScript
    const headers = new Headers();
    headers.set("x-rapidapi-key", process.env.RAPIDAPI_KEY || "");
    headers.set("x-rapidapi-host", "youtube-mp36.p.rapidapi.com");

    // Panggil API RapidAPI dengan ID bersih
    const res = await fetch(
      `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`,
      {
        method: "GET",
        headers: headers,
      }
    );

    const data = await res.json();

    // Jika API mengembalikan status sukses
    if (data.status === "ok" && data.link) {
      return NextResponse.json({ downloadUrl: data.link });
    }

    // Jika API memberikan pesan error spesifik
    return NextResponse.json(
      { error: data.msg || "API tidak dapat memproses video ini." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("RapidAPI Error:", error.message);
    return NextResponse.json(
      { error: "Gagal menyambung ke server API. Coba lagi nanti." },
      { status: 500 }
    );
  }
}