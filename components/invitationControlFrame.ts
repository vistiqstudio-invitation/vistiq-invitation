const invitationFrameSelector = 'iframe[data-invitation-frame], iframe[src^="/themes/"]';

export function getInvitationControlFrame() {
  return Array.from(document.querySelectorAll<HTMLIFrameElement>(invitationFrameSelector))
    .find((frame) => frame.contentDocument && frame.contentWindow);
}

export function getInvitationScrollTarget() {
  const frameDocument = getInvitationControlFrame()?.contentDocument;
  if (frameDocument) {
    const root = frameDocument.scrollingElement;
    const body = frameDocument.body;
    if (root && root.scrollHeight - root.clientHeight > 80) return root;
    if (body && body.scrollHeight - body.clientHeight > 80) {
      const overflow = frameDocument.defaultView?.getComputedStyle(body).overflowY;
      if (overflow === "auto" || overflow === "scroll") return body;
    }
  }
  return document.scrollingElement ?? document.documentElement;
}
