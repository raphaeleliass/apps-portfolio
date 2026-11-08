export const motionBoot = `if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.dataset.motion = 'pending';
  setTimeout(() => {
    if (document.documentElement.dataset.motion === 'pending') {
      delete document.documentElement.dataset.motion;
    }
  }, 2500);
}`;
