import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return auth.handler(req);
}

export async function POST(req: Request) {
  return auth.handler(req);
}
