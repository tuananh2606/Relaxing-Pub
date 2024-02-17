import { NextResponse } from 'next/server';

export async function fetcher<T>({ url, options }: { url: string; options?: object }): Promise<T | any> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      return new NextResponse('Failed to fetch data', { status: 500 });
    }
    const data = (await res.json()) as T;
    return data;
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
