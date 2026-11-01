import { getCatalog } from "@/lib/github";
export const dynamic = "force-dynamic";
export async function GET() {
  const catalog = await getCatalog();
  const available = catalog.status === "ready" || catalog.status === "stale";
  return Response.json(catalog, {
    status: available ? 200 : 503,
    headers: { "Cache-Control": "no-store" },
  });
}
