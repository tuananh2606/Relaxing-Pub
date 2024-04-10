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
export function replaceRange({
  s,
  start,
  end,
  substitute,
}: {
  s: string;
  start: number;
  end: number;
  substitute: string;
}) {
  return s.substring(0, start) + substitute + s.substring(end);
}
export function mungeEmailAddress(s: string) {
  const addressSign = s.indexOf('@');
  const needReplaceEmailLength = s.slice(3, addressSign);
  const menguEmail = s.slice(0, 3) + needReplaceEmailLength.replace(/./g, '*') + s.slice(addressSign);
  return menguEmail;
}
