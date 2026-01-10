import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const OFFICIAL_REGISTRY_URL = 'https://registry.modelcontextprotocol.io/v0/servers';

export async function GET(request: NextRequest) {
  try {
    // Get the limit and cursor from the query params
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') || '100';
    const cursor = searchParams.get('cursor');

    // Construct the URL
    const url = new URL(OFFICIAL_REGISTRY_URL);
    url.searchParams.set('limit', limit);
    if (cursor) {
      url.searchParams.set('cursor', cursor);
    }

    console.log(`Proxying registry request to: ${url.toString()}`);

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Registry upstream error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Registry proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error fetching registry' },
      { status: 500 }
    );
  }
}
