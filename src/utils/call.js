export default async (url, method = 'GET', body, headers) => {
  const mergedHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...headers,
  };

  return await fetch(
    url,
    {
      method,
      headers: mergedHeaders,
      body: body ? JSON.stringify(body) : null,
    },
  )
    .then(res => res.status < 300 ? res.json() : global.console.warn(res));
};
