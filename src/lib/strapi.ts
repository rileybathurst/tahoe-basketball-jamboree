// import qs from "qs";
import querystring from "node:querystring";

interface fetchApiTypes {
  endpoint: string;
  query?: Record<string, string>;
  wrappedByKey?: string;
  wrappedByList?: boolean;
  // https://docs.strapi.io/dev-docs/api/query-engine/populating
  /* populate?: {
    [key: string]: {
      populate: boolean;
    };
  }; */
  // ! this will break but I want to figure out if i can get the data first
  // populate?: any;
  limit?: number;
  fields?: string[];
}

export default async function fetchApi<T>({
  endpoint,
  query,
  wrappedByKey,
  wrappedByList,
  fields,
  limit,
}: fetchApiTypes): Promise<T> {
  if (endpoint.startsWith("/")) {
    endpoint = endpoint.slice(1);
  }

  const fieldPasser = {
    fields: fields,
  };

  // Use the stringify() method on the object
  const passedFields = querystring.stringify(fieldPasser);

  const url = new URL(
    `${import.meta.env.STRAPI_URL}api/${endpoint}${
      fields ? `?${passedFields}` : ""
    }
    ${limit ? `&pagination[limit]=${limit}` : ""}
    `
  );

  // with populate and no ggraphiql checking the structure on the api helps
  // * test logging
  // console.log(url);
  // console.log(url.href);

  // update from strapi 4 - 5
  // was http://45.79.101.19:1346/api/meta?populate%5BsiteName%5D=true&populate%5BbyLine%5D=true,

  // needs to be
  // http://45.79.101.19:1346/api/meta?fields=siteName&fields=byLine

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
