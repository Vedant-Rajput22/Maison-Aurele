import { NextResponse, type NextRequest } from "next/server";
import path from "path";
import { stat } from "fs/promises";
import { createReadStream } from "fs";
import { Readable } from "stream";

const ASSET_ROOT = path.join(process.cwd(), "public", "assets");

const MIME_MAP: Record<string, string> = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".json": "application/json",
};

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ asset?: string[] }> },
) {
  const { asset = [] } = await context.params;
  const joinedPath = path.join(ASSET_ROOT, ...asset);

  if (!joinedPath.startsWith(ASSET_ROOT)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let fileStats: Awaited<ReturnType<typeof stat>>;
  try {
    fileStats = await stat(joinedPath);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!fileStats.isFile()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const ext = path.extname(joinedPath).toLowerCase();
  const contentType = MIME_MAP[ext] ?? "application/octet-stream";
  const fileStream = createReadStream(joinedPath);
  const body = Readable.toWeb(fileStream) as unknown as BodyInit;

  return new NextResponse(body, {
    headers: {
      "content-type": contentType,
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
