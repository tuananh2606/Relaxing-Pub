export async function fetcher<T>({ url, options }: { url: string; options?: object }): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(JSON.stringify(await res.json()));
  const data = (await res.json()) as T;
  return data;
}
