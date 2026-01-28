export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const debounce = (fn, delay) => {
  let timer;

  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

export const resolveImageUrl = (src) => {
  if (!src) return "";

  // already absolute URL
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  // data urls
  if (src.startsWith("data:")) {
    return src;
  }

  // local public assets
  if (src.startsWith("/")) {
    return src;
  }

  // filename from DB → prepend base URL
  return `${import.meta.env.VITE_IMAGE_BASE_URL}/${src}`;
};
