export const FOOTER_PIN_REQUEST_EVENT = "notepad-footer-pin-request";

export type FooterPinRequestDetail = {
  id: string;
  x: number;
  y: number;
};

type ContextMenuEvent = {
  clientX: number;
  clientY: number;
  preventDefault: () => void;
  stopPropagation: () => void;
};

export function requestFooterPin(event: ContextMenuEvent, id: string) {
  if (window.matchMedia("(max-width: 512px)").matches) return false;
  event.preventDefault();
  event.stopPropagation();
  window.dispatchEvent(
    new CustomEvent<FooterPinRequestDetail>(FOOTER_PIN_REQUEST_EVENT, {
      detail: { id, x: event.clientX, y: event.clientY },
    }),
  );
  return true;
}
