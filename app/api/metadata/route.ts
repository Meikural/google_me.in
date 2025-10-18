import { NextRequest, NextResponse } from "next/server";

interface Metadata {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

function extractMetaTags(html: string): Metadata {
  const metadata: Metadata = {};

  // Extract Open Graph tags
  const ogTitle = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  const ogDescription = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  const ogImage = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  const ogUrl = html.match(/<meta[^>]*property=["']og:url["'][^>]*content=["']([^"']*)["'][^>]*>/i);

  // Also try reverse order (content before property)
  const ogTitleReverse = html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:title["'][^>]*>/i);
  const ogDescriptionReverse = html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:description["'][^>]*>/i);
  const ogImageReverse = html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:image["'][^>]*>/i);
  const ogUrlReverse = html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:url["'][^>]*>/i);

  // Fallback to regular meta tags
  const metaTitle = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const metaDescription = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  const metaDescriptionReverse = html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);

  metadata.title = ogTitle?.[1] || ogTitleReverse?.[1] || metaTitle?.[1] || undefined;
  metadata.description = ogDescription?.[1] || ogDescriptionReverse?.[1] || metaDescription?.[1] || metaDescriptionReverse?.[1] || undefined;
  metadata.image = ogImage?.[1] || ogImageReverse?.[1] || undefined;
  metadata.url = ogUrl?.[1] || ogUrlReverse?.[1] || undefined;

  return metadata;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    // Fetch the webpage
    const response = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LinkPreviewBot/1.0)",
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.status} ${response.statusText}` },
        { status: 400 }
      );
    }

    const html = await response.text();
    const metadata = extractMetaTags(html);

    return NextResponse.json({ metadata }, { status: 200 });
  } catch (error) {
    console.error("Error fetching metadata:", error);

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return NextResponse.json({ error: "Request timeout" }, { status: 408 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
