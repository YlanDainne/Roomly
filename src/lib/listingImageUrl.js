const runtimeConfig = typeof window !== 'undefined' ? window.__ROOMLY_RUNTIME_CONFIG__ || {} : {};
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || runtimeConfig.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
const backendOrigin = apiBaseUrl.replace(/\/api$/, '');

export const resolveListingImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return '';
  }

  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }

  const normalizedPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  return `${backendOrigin}${normalizedPath}`;
};
