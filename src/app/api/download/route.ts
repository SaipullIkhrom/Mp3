import { NextResponse } from "next/server";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const format = searchParams.get("format"); // Menangkap format (mp3 atau mp4)

  // --- PENGATURAN LIMIT ---
  const MAX_DOWNLOADS = 5;
  const WINDOW_TIME = 60 * 60 * 1000;

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "anonymous";
  const now = Date.now();
  const userRecord = rateLimitMap.get(ip);

  if (userRecord) {
    if (now < userRecord.resetTime) {
      if (userRecord.count >= MAX_DOWNLOADS) {
        const minutesLeft = Math.ceil((userRecord.resetTime - now) / 60000);
        return NextResponse.json(
          { error: `Limit tercapai. Kamu bisa download lagi dalam ${minutesLeft} menit.` },
          { status: 429 }
        );
      }
      userRecord.count += 1;
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_TIME });
    }
  } else {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_TIME });
  }

  if (!url) {
    return NextResponse.json({ error: "URL tidak boleh kosong" }, { status: 400 });
  }

  try {
    // --- LOGIKA TIKTOK (VIDEO & AUDIO) ---
    if (url.includes("tiktok.com")) {
      const tiktokHeaders = new Headers();
      tiktokHeaders.set("x-rapidapi-key", process.env.RAPIDAPI_KEY || "");
      tiktokHeaders.set("x-rapidapi-host", "tiktok-video-no-watermark2.p.rapidapi.com");
      tiktokHeaders.set("Content-Type", "application/x-www-form-urlencoded");

      const body = new URLSearchParams();
      body.append("url", url);

      const tiktokRes = await fetch(`https://tiktok-video-no-watermark2.p.rapidapi.com/`, {
        method: "POST",
        headers: tiktokHeaders,
        body: body.toString(),
      });

      const tiktokData = await tiktokRes.json();

      if (tiktokData.code === 0 && tiktokData.data) {
        // Jika user pilih MP3, ambil link musiknya
        if (format === "mp3" && tiktokData.data.music) {
          return NextResponse.json({ downloadUrl: tiktokData.data.music });
        }
        // Jika user pilih MP4, ambil link video tanpa watermark
        return NextResponse.json({ downloadUrl: tiktokData.data.play });
      } else {
        return NextResponse.json({ error: "Gagal mengambil data TikTok." }, { status: 400 });
      }
    }

    // --- LOGIKA YOUTUBE ---
    const extractVideoId = (url: string) => {
      const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      const match = url.match(regExp);
      return match && match[7].length === 11 ? match[7] : null;
    };

    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json({ error: "ID Video YouTube tidak valid" }, { status: 400 });
    }

    const youtubeHeaders = new Headers();
    youtubeHeaders.set("x-rapidapi-key", process.env.RAPIDAPI_KEY || "");
    youtubeHeaders.set("x-rapidapi-host", "youtube-mp36.p.rapidapi.com");

    const ytRes = await fetch(
      `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`,
      { method: "GET", headers: youtubeHeaders }
    );

    const ytData = await ytRes.json();

    if (ytData.status === "ok" && ytData.link) {
      return NextResponse.json({ downloadUrl: ytData.link });
    }

    return NextResponse.json(
      { error: ytData.msg || "API tidak dapat memproses video ini." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Gagal menyambung ke server API." }, { status: 500 });
  }
}