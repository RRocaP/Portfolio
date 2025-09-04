import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://pub.orcid.org/v3.0/0000-0002-7393-6200/works", {
    headers: { Accept: "application/json" },
    // Cache for an hour in static builds
    next: { revalidate: 3600 },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

