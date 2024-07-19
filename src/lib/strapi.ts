import qs from "qs";

interface fetchApiTypes {
  endpoint: string;
  query?: Record<string, string>;
  wrappedByKey?: string;
  wrappedByList?: boolean;
  // https://docs.strapi.io/dev-docs/api/query-engine/populating
  populate?: {
    [key: string]: {
      populate: boolean;
    };
  };
}

/**
 * Fetches data from the Strapi API
 * @param endpoint - The endpoint to fetch from
 * @param query - The query parameters to add to the url
 * @param wrappedByKey - The key to unwrap the response from
 * @param wrappedByList - If the response is a list, unwrap it
 * @param populate - The fields to populate
 * @returns
 */

export default async function fetchApi<T>({
  endpoint,
  query,
  wrappedByKey,
  wrappedByList,
  populate,
}: fetchApiTypes): Promise<T> {
  if (endpoint.startsWith("/")) {
    endpoint = endpoint.slice(1);
  }

  const url = new URL(
    `${import.meta.env.STRAPI_URL}api/${endpoint}${
      populate ? `?${qs.stringify({ populate })}` : ""
    }`
  );

  // with populate and no ggraphiql checking the structure on the api helps
  // console.log(url);
  // console.log(url.href);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      url.searchParams.append(key, value);
    }
  }
  // ? can I do this in one step?
  const res = await fetch(url.toString());
  let data = await res.json();

  if (wrappedByKey) {
    data = data[wrappedByKey];
  }

  if (wrappedByList) {
    data = data[0];
  }

  return data as T;
}
