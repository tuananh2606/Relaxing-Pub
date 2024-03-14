import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { NextResponse } from 'next/server';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ConvertToHourAndMinutes = (totalMinutes: number | undefined) => {
  if (totalMinutes) {
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);
    return `${hours}h${minutes}m`;
  }
};

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
