export const createSource = (
  get: (url: string) => Promise<any>,
  url: string
) => (
  page: number,
  rowsPerPage: number,
  orderBy: string,
  desc: boolean,
  filter?: { [key: string]: any }
) => {
  const urlSep = url.indexOf("?") === -1 ? "?" : "&";
  const p = new Promise<{ total: number; data: any[] }>((res, rej) => {
    get(
      `${url}${urlSep}page=${page}&count=${rowsPerPage}&orderBy=${orderBy}&desc=${desc}${serializeFilter(
        filter || {}
      )}`
    )
      .then(resp => res({ data: resp.data, total: resp.total }))
      .catch(rej);
  });

  return p;
};

export const createJsonServerSource = (
  get: (url: string) => Promise<any>,
  url: string
) => (
  page: number,
  rowsPerPage: number,
  orderBy: string,
  desc: boolean,
  filter?: { [key: string]: any }
) => {
  const urlSep = url.indexOf("?") === -1 ? "?" : "&";
  const p = new Promise<{ total: number; data: any[] }>((res, rej) => {
    get(
      `${url}${urlSep}_page=${page}&_limit=${rowsPerPage}&_sort=${orderBy}&_order=${
        desc ? "desc" : "asc"
      }${serializeFilter(filter || {})}`
    )
      .then(resp => res({ data: resp, total: resp.length }))
      .catch(rej);
  });

  return p;
};

function serializeFilter(filter: { [key: string]: any }) {
  let query = "";
  // tslint:disable-next-line:forin
  for (const x in filter) {
    if (filter[x] != null) {
      query += `&${x}=${encodeURIComponent(filter[x])}`;
    }
  }
  return query;
}
