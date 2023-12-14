export async function fetcher<Value>({ url }: { url: string }): Promise<Value> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(JSON.stringify(await res.json()));
  const data = (await res.json()) as Value;
  return data;
}
