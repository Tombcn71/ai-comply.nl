import FirecrawlApp from "@mendable/firecrawl-js";

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY! });

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return Response.json(
        { success: false, error: "A valid URL is required." },
        { status: 400 }
      );
    }

    const scrapeResult = await firecrawl.scrapeUrl(url, {
      formats: ["markdown", "html", "branding"],
      onlyMainContent: false,
    });

    if (!scrapeResult.success) {
      return Response.json(
        { success: false, error: "Firecrawl could not scrape this URL." },
        { status: 502 }
      );
    }

    return Response.json({ success: true, data: scrapeResult });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
