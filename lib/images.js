export const IMAGE_MAP = {
  0: "/Zero.jpg",
  1: "/One.jpg",
  2: "/Two.jpg",
  3: "/Three.jpg",
  4: "/Four.jpg",
  5: "/Five.jpg",
  6: "/Six.jpg",
};

// Preload all hand images so reveals never flash
if (typeof window !== "undefined") {
  Object.values(IMAGE_MAP).forEach((src) => {
    new Image().src = src;
  });
}
