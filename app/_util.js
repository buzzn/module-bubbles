export function prepareHeaders(token) {
  const headers =  {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export function parseResponse(response) {
  const json = response.json();
  if (response.status >= 200 && response.status < 300) {
    return json;
  } else {
    return json.then(error => Promise.reject(error));
  }
}
