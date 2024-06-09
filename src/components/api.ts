export type ICoin = string;
async function fetchCoinList(): Promise<ICoin[]> {
  try {
    const url = `https://api-eu.okotoki.com/coins`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ICoin[] = await response.json();

    return data;
  } catch (error: Error | any) {
    console.error(error);
    return [];
  }
}
export { fetchCoinList };
