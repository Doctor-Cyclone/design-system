const stack: HTMLElement[] = [];
const previous = new Map<HTMLElement, boolean>();
let overflow = '';
let observer: MutationObserver | undefined;

function update() {
  const top = stack.at(-1);
  for (const child of document.body.children) {
    if (!(child instanceof HTMLElement)) continue;
    if (!previous.has(child)) previous.set(child, child.hasAttribute('inert'));
    if (child === top) child.removeAttribute('inert');
    else child.setAttribute('inert', '');
  }
}

/** Reference-counted document isolation so nested dialogs restore the parent first. */
export function isolateModal(layer: HTMLElement) {
  if (stack.length === 0) {
    overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    observer = new MutationObserver(update);
    observer.observe(document.body, { childList: true });
  }
  stack.push(layer);
  update();
  return () => {
    const index = stack.indexOf(layer);
    if (index !== -1) stack.splice(index, 1);
    if (stack.length) update();
    else {
      observer?.disconnect();
      previous.forEach((wasInert, element) => {
        if (wasInert) element.setAttribute('inert', '');
        else element.removeAttribute('inert');
      });
      previous.clear();
      document.body.style.overflow = overflow;
    }
  };
}

export const isTopModal = (layer: HTMLElement) => stack.at(-1) === layer;
export function focusableElements(root: HTMLElement) {
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'button, a[href], input, select, textarea, [tabindex]',
    ),
  ).filter(
    (element) =>
      element.tabIndex >= 0 &&
      !element.matches(':disabled') &&
      !element.closest('[hidden], [inert]') &&
      getComputedStyle(element).display !== 'none' &&
      getComputedStyle(element).visibility !== 'hidden',
  );
}
