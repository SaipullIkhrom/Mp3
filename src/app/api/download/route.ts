import { NextResponse } from "next/server";

// Menggunakan Map untuk menyimpan data limit (IP: {count, resetTime})
// Di Vercel (Serverless), variabel global ini akan bertahan selama instance aktif
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  // --- PENGATURAN LIMIT ---
  const MAX_DOWNLOADS = 5; // Maksimal 5 lagu
  const WINDOW_TIME = 60 * 60 * 1000; // Per 1 jam (dalam milidetik)

  // Ambil IP Pengunjung
  const ip = request.headers.get("x-forwarded-for")?.split(',')[0] || "anonymous";
  const now = Date.now();

  const userRecord = rateLimitMap.get(ip);

  // Cek apakah user sudah mencapai limit
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
      // Waktu reset sudah lewat, buat record baru
      rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_TIME });
    }
  } else {
    // Pengunjung baru pertama kali download
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_TIME });
  }

  // --- LOGIKA API TETAP SAMA ---
  if (!url) {
    return NextResponse.json({ error: "URL tidak boleh kosong" }, { status: 400 });
  }

  try {
    const extractVideoId = (url: string) => {
      const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      const match = url.match(regExp);
      return match && match[7].length === 11 ? match[7] : null;
    };

    const videoId = extractVideoId(url);

    if (!videoId) {
      return NextResponse.json({ error: "ID Video YouTube tidak valid" }, { status: 400 });
    }

    const headers = new Headers();
    headers.set("x-rapidapi-key", process.env.RAPIDAPI_KEY || "");
    headers.set("x-rapidapi-host", "youtube-mp36.p.rapidapi.com");

    const res = await fetch(
      `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`,
      {
        method: "GET",
        headers: headers,
      }
    );

    const data = await res.json();

    if (data.status === "ok" && data.link) {
      return NextResponse.json({ downloadUrl: data.link });
    }

    return NextResponse.json(
      { error: data.msg || "API tidak dapat memproses video ini." },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Gagal menyambung ke server API." },
      { status: 500 }
    );
  }
}