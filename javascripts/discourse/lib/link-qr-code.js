/* global qrcode, settings */

import loadScript from "discourse/lib/load-script";

const MAX_QR_LINKS = 50;
const MAX_URL_LENGTH = 2048;
const VALID_ERROR_CORRECTION_LEVELS = ["L", "M", "Q", "H"];

let qrcodeLibraryPromise;

export function hasLinksForPost(post) {
  return getLinksForPost(post).length > 0;
}

export function getLinksForPost(post) {
  if (!post) {
    return [];
  }

  const links = deduplicateLinks([
    ...getLinksFromLinkCounts(post),
    ...getLinksFromCooked(post),
    ...getLinksFromDOM(post),
  ]);

  return links.slice(0, MAX_QR_LINKS);
}

export async function openQRCodeModal(links) {
  try {
    await ensureQRCodeLibrary();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("QR-Code Library konnte nicht geladen werden:", error);
    return;
  }

  renderQRCodeModal(links);
}

function getLinksFromLinkCounts(post) {
  const linkCounts = post.link_counts;

  if (!linkCounts?.length) {
    return [];
  }

  const showExternalOnly = Boolean(settings.qr_code_show_external_only);

  return linkCounts.reduce((links, link) => {
    if (link.reflection) {
      return links;
    }

    const linkData = normalizeLink(link.url, link.title, showExternalOnly);

    if (linkData) {
      links.push(linkData);
    }

    return links;
  }, []);
}

function getLinksFromCooked(post) {
  const cooked = post.cooked;

  if (!cooked) {
    return [];
  }

  const documentFragment = new DOMParser().parseFromString(cooked, "text/html");
  const showExternalOnly = Boolean(settings.qr_code_show_external_only);
  const links = [];

  documentFragment.body
    .querySelectorAll("a[href]:not(.mention):not(.hashtag)")
    .forEach((anchor) => {
      const linkData = getLinkDataFromAnchor(anchor, showExternalOnly);

      if (linkData) {
        links.push(linkData);
      }
    });

  documentFragment.body.querySelectorAll("[data-onebox-src]").forEach((onebox) => {
    const linkData = normalizeLink(
      onebox.getAttribute("data-onebox-src"),
      onebox.querySelector(".source")?.textContent?.trim(),
      showExternalOnly
    );

    if (linkData) {
      links.push(linkData);
    }
  });

  return links;
}

function getLinksFromDOM(post) {
  const cookedElement =
    document.querySelector(`#post_${post.id} .cooked`) ||
    document.querySelector(`[data-post-id="${post.id}"] .cooked`) ||
    document.querySelector(`#post_${post.post_number} .cooked`);

  if (!cookedElement) {
    return [];
  }

  const showExternalOnly = Boolean(settings.qr_code_show_external_only);
  const links = [];

  cookedElement
    .querySelectorAll("a[href]:not(.mention):not(.hashtag)")
    .forEach((anchor) => {
      const linkData = getLinkDataFromAnchor(anchor, showExternalOnly);

      if (linkData) {
        links.push(linkData);
      }
    });

  cookedElement.querySelectorAll("[data-onebox-src]").forEach((onebox) => {
    const linkData = normalizeLink(
      onebox.getAttribute("data-onebox-src"),
      onebox.querySelector(".source")?.textContent?.trim(),
      showExternalOnly
    );

    if (linkData) {
      links.push(linkData);
    }
  });

  return links;
}

function getLinkDataFromAnchor(anchor, showExternalOnly) {
  return normalizeLink(anchor.getAttribute("href"), anchor.textContent.trim(), showExternalOnly);
}

function normalizeLink(href, text, showExternalOnly) {
  const trimmedHref = href?.trim();

  if (!trimmedHref || trimmedHref.startsWith("#") || trimmedHref.length > MAX_URL_LENGTH) {
    return null;
  }

  let url;

  try {
    url = new URL(trimmedHref, window.location.href);
  } catch {
    return null;
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    return null;
  }

  if (showExternalOnly && url.hostname === window.location.hostname) {
    return null;
  }

  return {
    text: text || url.href,
    url: url.href,
  };
}

function ensureQRCodeLibrary() {
  if (typeof qrcode !== "undefined") {
    return Promise.resolve();
  }

  if (!qrcodeLibraryPromise) {
    qrcodeLibraryPromise = loadScript(settings.theme_uploads.qrcode_generator);
  }

  return qrcodeLibraryPromise;
}

function renderQRCodeModal(links) {
  document.querySelectorAll(".qr-code-modal").forEach((modal) => modal.remove());

  const uniqueLinks = deduplicateLinks(links);

  if (uniqueLinks.length === 0) {
    return;
  }

  const modal = createElement("div", "qr-code-modal");
  const modalOverlay = createElement("div", "qr-code-modal-overlay");
  const modalContent = createElement("div", "qr-code-modal-content");
  const modalHeader = createElement("div", "qr-code-modal-header");
  const modalBody = createElement("div", "qr-code-modal-body");
  const title = document.createElement("h3");
  const closeButton = createElement("button", "qr-code-modal-close btn-flat");

  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "qr-code-modal-title");

  title.id = "qr-code-modal-title";
  title.textContent = "QR-Codes für Links in diesem Post";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "QR-Code Modal schließen");
  closeButton.append(createCloseIcon());

  const closeModal = () => {
    document.removeEventListener("keydown", onKeyDown);
    modal.remove();
  };

  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  };

  closeButton.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", closeModal);
  document.addEventListener("keydown", onKeyDown);

  modalHeader.append(title);
  modalHeader.append(closeButton);

  uniqueLinks.forEach((link) => {
    modalBody.append(createQRCodeItem(link));
  });

  modalContent.append(modalHeader);
  modalContent.append(modalBody);
  modal.append(modalOverlay);
  modal.append(modalContent);

  document.body.append(modal);

  setTimeout(() => closeButton.focus(), 100);
}

function deduplicateLinks(links) {
  const urlMap = new Map();

  links.forEach((link) => {
    const existingLink = urlMap.get(link.url);

    if (!existingLink || link.text.length > existingLink.text.length) {
      urlMap.set(link.url, link);
    }
  });

  return Array.from(urlMap.values());
}

function createQRCodeItem(link) {
  const qrItem = createElement("div", "qr-code-item");
  const qrCodeContainer = createElement("div", "qr-code-container");
  const qrCanvas = createElement("div", "qr-code-canvas");
  const linkInfo = createElement("div", "qr-link-info");
  const linkTitle = createElement("div", "qr-link-title");
  const linkUrl = createElement("div", "qr-link-url");

  try {
    const qr = qrcode(0, getErrorCorrectionLevel());
    qr.addData(link.url);
    qr.make();

    qrCanvas.innerHTML = qr.createSvgTag(4, 2);

    const svg = qrCanvas.querySelector("svg");
    const qrSize = getQRCodeSize();

    if (svg) {
      svg.setAttribute("width", `${qrSize}px`);
      svg.setAttribute("height", `${qrSize}px`);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Fehler beim Generieren des QR-Codes:", error);
    qrCanvas.textContent = "QR-Code konnte nicht generiert werden";
    qrCanvas.classList.add("qr-error");
  }

  linkTitle.textContent = link.text;
  linkUrl.textContent = link.url;

  qrCodeContainer.append(qrCanvas);
  linkInfo.append(linkTitle);
  linkInfo.append(linkUrl);
  qrItem.append(qrCodeContainer);
  qrItem.append(linkInfo);

  return qrItem;
}

function getQRCodeSize() {
  const qrSize = Number.parseInt(settings.qr_code_size, 10);

  if (Number.isNaN(qrSize)) {
    return 200;
  }

  return Math.min(Math.max(qrSize, 100), 400);
}

function getErrorCorrectionLevel() {
  const level = settings.qr_code_error_correction;

  return VALID_ERROR_CORRECTION_LEVELS.includes(level) ? level : "M";
}

function createElement(tagName, className) {
  const element = document.createElement(tagName);
  element.className = className;
  return element;
}

function createCloseIcon() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  svg.setAttribute("class", "fa d-icon d-icon-times svg-icon");
  svg.setAttribute("viewBox", "0 0 320 512");
  path.setAttribute(
    "d",
    "M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"
  );

  svg.append(path);

  return svg;
}
