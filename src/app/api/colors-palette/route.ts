import { NextResponse, type NextRequest } from 'next/server';

export interface ColorPalette {
  '50': string;
  '100': string;
  '200': string;
  '300': string;
  '400': string;
  '500': string;
  '600': string;
  '700': string;
  '800': string;
  '900': string;
}

interface Result {
  color: ColorPalette;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const color = searchParams.get('color');
  try {
    const res = await fetch(`https://www.tints.dev/api/color/${color}`);
    if (!res.ok) throw new Error(JSON.stringify(await res.json()));
    const data = (await res.json()) as Result;
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error },
      {
        status: 500,
      },
    );
  }
}
