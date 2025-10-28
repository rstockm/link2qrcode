import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "link-qr-code",

  initialize(container) {
    withPluginApi("0.8.31", (api) => {
      api.decorateCooked(($elem, helper) => {
        if (!helper) return;
        
        // Prüfen ob bereits ein QR-Button existiert
        if ($elem.find(".qr-code-trigger-button").length > 0) {
          return;
        }

        // Finde alle Links (außer Mentions und Hashtags)
        const links = $elem.find("a[href]:not(.mention):not(.hashtag)").toArray();
        
        // Settings laden - aus globalem settings Objekt (Theme Component)
        const showExternalOnly = (typeof settings !== 'undefined' && settings.qr_code_show_external_only) || false;
        const buttonText = (typeof settings !== 'undefined' && settings.qr_code_button_text) || "Links als QR-Codes anzeigen";
        
        // Filtere Links basierend auf Settings
        const validLinks = links.filter(link => {
          const href = link.getAttribute("href");
          if (!href || href.startsWith("#") || href.startsWith("javascript:")) {
            return false;
          }
          
          // Wenn nur externe Links gewünscht, filtere interne Links
          if (showExternalOnly) {
            try {
              const linkUrl = new URL(href, window.location.href);
              const currentHost = window.location.hostname;
              return linkUrl.hostname !== currentHost;
            } catch (e) {
              return false;
            }
          }
          
          return true;
        });

        if (validLinks.length === 0) return;

        // Erstelle Button am Ende des Posts
        const buttonContainer = $('<div class="qr-code-button-container"></div>');
        const button = $(
          `<button class="qr-code-trigger-button btn btn-default">
            <svg class="fa d-icon d-icon-qrcode svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M0 224h192V32H0v192zM64 96h64v64H64V96zm192-64v192h192V32H256zm128 128h-64V96h64v64zM0 480h192V288H0v192zm64-128h64v64H64V352zm352-64h32v128h-96v-32h-32v96h-64V288h96v32h64v-32zm0 160h32v32h-32v-32zm-64 0h32v32h-32v-32z"/>
            </svg>
            ${buttonText} (${validLinks.length})
          </button>`
        );

        button.on("click", (e) => {
          e.preventDefault();
          showQRCodeModal(validLinks);
        });

        buttonContainer.append(button);
        $elem.append(buttonContainer);
      });
    });
  },
};

function showQRCodeModal(links) {
  // Entferne eventuell bereits existierende Modals
  $(".qr-code-modal").remove();
  
  // Settings laden - aus globalem settings Objekt (Theme Component)
  const qrSize = (typeof settings !== 'undefined' && settings.qr_code_size) ? parseInt(settings.qr_code_size) : 200;
  const errorCorrectionLevel = (typeof settings !== 'undefined' && settings.qr_code_error_correction) || "M";

  // Erstelle Modal
  const modal = $('<div class="qr-code-modal"></div>');
  const modalOverlay = $('<div class="qr-code-modal-overlay"></div>');
  const modalContent = $('<div class="qr-code-modal-content"></div>');
  const modalHeader = $('<div class="qr-code-modal-header"></div>');
  const modalBody = $('<div class="qr-code-modal-body"></div>');
  
  const title = $('<h3>QR-Codes für Links in diesem Post</h3>');
  const closeButton = $(
    `<button class="qr-code-modal-close btn-flat">
      <svg class="fa d-icon d-icon-times svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
        <path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/>
      </svg>
    </button>`
  );
  
  closeButton.on("click", () => modal.remove());
  modalOverlay.on("click", () => modal.remove());

  modalHeader.append(title);
  modalHeader.append(closeButton);

  // Entferne Duplikate basierend auf URL, bevorzuge längeren/aussagekräftigeren Text
  const urlMap = new Map();
  
  links.forEach((link) => {
    const url = link.getAttribute("href");
    const linkText = $(link).text().trim();
    
    if (!urlMap.has(url)) {
      urlMap.set(url, link);
    } else {
      // Bevorzuge Link mit längerem Text (meist aussagekräftiger)
      const existingText = $(urlMap.get(url)).text().trim();
      if (linkText.length > existingText.length) {
        urlMap.set(url, link);
      }
    }
  });
  
  const uniqueLinks = Array.from(urlMap.values());

  // Generiere QR-Codes für jeden eindeutigen Link
  uniqueLinks.forEach((link, index) => {
    const url = link.getAttribute("href");
    const linkText = $(link).text().trim() || url;
    
    const qrItem = $('<div class="qr-code-item"></div>');
    const qrCodeContainer = $('<div class="qr-code-container"></div>');
    const qrCanvas = document.createElement("div");
    qrCanvas.className = "qr-code-canvas";
    
    // Generiere QR-Code mit qrcode-generator Library
    try {
      const typeNumber = 0; // automatisch
      const qr = qrcode(typeNumber, errorCorrectionLevel);
      qr.addData(url);
      qr.make();
      
      // Erstelle SVG mit fester Zellgröße
      const cellSize = 4;
      const margin = 2;
      
      qrCanvas.innerHTML = qr.createSvgTag(cellSize, margin);
      
      // Setze SVG-Größe direkt über Attribute
      const svg = qrCanvas.querySelector('svg');
      if (svg) {
        svg.setAttribute('width', qrSize + 'px');
        svg.setAttribute('height', qrSize + 'px');
      }
    } catch (error) {
      console.error("Fehler beim Generieren des QR-Codes:", error);
      qrCanvas.innerHTML = '<div class="qr-error">QR-Code konnte nicht generiert werden</div>';
    }
    
    qrCodeContainer.append(qrCanvas);
    
    const linkInfo = $('<div class="qr-link-info"></div>');
    const linkTitle = $(`<div class="qr-link-title">${escapeHtml(linkText)}</div>`);
    const linkUrl = $(`<div class="qr-link-url">${escapeHtml(url)}</div>`);
    
    linkInfo.append(linkTitle);
    linkInfo.append(linkUrl);
    
    qrItem.append(qrCodeContainer);
    qrItem.append(linkInfo);
    
    modalBody.append(qrItem);
  });

  modalContent.append(modalHeader);
  modalContent.append(modalBody);
  modal.append(modalOverlay);
  modal.append(modalContent);
  
  $("body").append(modal);
  
  // Fokus für Accessibility
  setTimeout(() => closeButton.focus(), 100);
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
