import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const audioUrl = request.nextUrl.searchParams.get("url");

  if (!audioUrl) {
    return new Response("Missing audio URL", { status: 400 });
  }

  try {
    const response = await fetch(audioUrl, {
      headers: {
        // Pretend to be a browser
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      },
    });

    if (!response.ok || !response.body) {
      return new Response("Failed to fetch audio", { status: 500 });
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Accept-Ranges": "bytes", // ✅ important for seeking
        "Access-Control-Allow-Origin": "*", // ✅ CORS
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response("Error fetching audio", { status: 500 });
  }
}
