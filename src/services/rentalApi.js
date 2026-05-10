import { supabase } from '../lib/supabaseClient';

const runtimeConfig = typeof window !== 'undefined' ? window.__ROOMLY_RUNTIME_CONFIG__ || {} : {};

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || runtimeConfig.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const buildUrl = (path) => `${API_BASE_URL}${path}`;

async function request(path, options = {}) {
  const { headers: optionHeaders, ...restOptions } = options;
  const sessionResult = supabase ? await supabase.auth.getSession() : { data: { session: null } };
  const accessToken = sessionResult.data.session?.access_token;

  let response;
  try {
    response = await fetch(buildUrl(path), {
      headers: {
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...optionHeaders
      },
      ...restOptions
    });
  } catch (networkError) {
    const isLikelyOfflineBackend = networkError instanceof TypeError;
    if (isLikelyOfflineBackend) {
      throw new Error(
        `Cannot reach backend at ${API_BASE_URL}. Start the Spring Boot server and try again.`
      );
    }
    throw networkError;
  }

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const rentalApi = {
  getListings: () => request('/listings'),
  getSavedHomes: () => request('/saved-homes'),
  getHotspots: () => request('/hotspots'),
  getCampuses: () => request('/campuses'),
  saveListing: (id) => request(`/saved-homes/${id}`, { method: 'POST' }),
  unsaveListing: (id) => request(`/saved-homes/${id}`, { method: 'DELETE' }),
  createListing: (formData) => request('/listings', { method: 'POST', body: formData }),
  updateListing: (id, formData) => request(`/listings/${id}`, { method: 'PUT', body: formData }),
  deleteListing: (id) => request(`/listings/${id}`, { method: 'DELETE' })
};
