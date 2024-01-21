export async function fetcher<T>({ url, options }: { url: string; options?: object }): Promise<T> {
  try {
    const res = await fetch(url, options);
    const data = (await res.json()) as T;
    return data;
  } catch (error) {
    throw error;
  }
}
