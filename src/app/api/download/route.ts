import { NextResponse } from "next/server";
import ytdl from "@distube/ytdl-core";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const format = searchParams.get("format");

  if (!url || !ytdl.validateURL(url)) {
    return NextResponse.json({ error: "URL tidak valid" }, { status: 400 });
  }

  try {
    const info = await ytdl.getInfo(url);
    const cleanTitle = info.videoDetails.title.replace(/[^\w\s]/gi, "");

    const downloadOptions: ytdl.downloadOptions = {
      quality: format === "mp3" ? "highestaudio" : "highest",
      filter: format === "mp3" ? "audioonly" : "audioandvideo",
      // Menggunakan agen standar tanpa cookie pribadi agar orang lain bisa pakai
      requestOptions: {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
        },
      },
    };

    const stream = ytdl(url, downloadOptions);

    return new NextResponse(stream as any, {
      headers: {
        "Content-Disposition": `attachment; filename="${cleanTitle}.${format === "mp3" ? "mp3" : "mp4"}"`,
        "Content-Type": format === "mp3" ? "audio/mpeg" : "video/mp4",
        
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: any) {
    console.error("Error Detail:", error.message);
    return NextResponse.json(
      { error: "YouTube memblokir permintaan. Silakan coba video lain." },
      { status: 500 }
    );
  }
}