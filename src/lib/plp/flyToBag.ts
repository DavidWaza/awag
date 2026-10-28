// Clones the product image and animates it along a curve to the header bag
// icon. Pure DOM + one keyframe (see globals.css); nothing persists.
export function flyToBag(source: HTMLElement | null) {
  if (!source || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const bag = document.getElementById('bag-icon');
  if (!bag) return;

  const from = source.getBoundingClientRect();
  const to = bag.getBoundingClientRect();

  const ghost = source.querySelector('img')?.cloneNode(true) as HTMLElement | undefined;
  if (!ghost) return;

  Object.assign(ghost.style, {
    position: 'fixed',
    left: `${from.left}px`,
    top: `${from.top}px`,
    width: `${from.width}px`,
    height: `${from.height}px`,
    borderRadius: '8px',
    objectFit: 'cover',
    zIndex: '60',
    pointerEvents: 'none',
  });
  ghost.style.setProperty('--fly-x', `${to.left - from.left + to.width / 2}px`);
  ghost.style.setProperty('--fly-y', `${to.top - from.top}px`);
  ghost.classList.add('ag-fly-ghost');

  document.body.appendChild(ghost);
  ghost.addEventListener('animationend', () => {
    ghost.remove();
    bag.classList.add('ag-bag-bump');
    setTimeout(() => bag.classList.remove('ag-bag-bump'), 350);
  });
}
