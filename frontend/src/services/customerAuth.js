const ROOT = '/api/customer-auth';
let csrfToken;
export async function customerRequest(path, payload) {
  if (!csrfToken) {
    const response = await fetch(`${ROOT}/csrf`, { credentials: 'same-origin' });
    if (!response.ok) throw new Error('Unable to initialize customer session.');
    csrfToken = (await response.json()).token;
  }
  const response = await fetch(`${ROOT}${path}`, {
    method: payload === undefined ? 'GET' : 'POST',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken,
    },
    ...(payload === undefined ? {} : { body: JSON.stringify(payload) }),
  });
  let data;
  try { data = await response.json(); }
  catch { throw new Error(`Server returned ${response.status}. Check Laravel logs.`); }
  if (response.status === 419) { csrfToken = null; throw new Error('Session expired. Refresh and try again.'); }
  if (!response.ok) throw new Error(data.message || Object.values(data.errors || {})[0]?.[0] || 'Request failed.');
  if (path === '/login' || path === '/complete') csrfToken = null;
  return data;
}
