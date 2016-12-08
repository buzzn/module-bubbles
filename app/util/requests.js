export const getJson = (response) => {
  if (!response.ok) return Promise.reject(`${response.status}: ${response.statusText}`);
  return response.json();
};
