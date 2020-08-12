const fetch = require('axios');

const serverUrl = process.env.NODE_ENV !== 'production' ? 'http://localhost:3004' : '';

export async function fetchData(url, method = 'GET', headers) {
  const newUrl = `${(serverUrl || '')}${url}`;
  const ret = await fetch({
    url: newUrl,
    method,
    headers,
    transformResponse: (req) => req,
    withCredentials: true,
    timeout: 4900,
  });
  return ret.data;
}

export async function sendData(url, method = 'POST', data, headers) {
  const ret = await fetch({
    url: `${(serverUrl || '')}${url}`,
    method,
    data,
    transformResponse: (req) => req,
    headers: headers || {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 4900,
  });
  return ret.data;
}
