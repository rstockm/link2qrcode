/* global settings */

import Component from "@glimmer/component";
import { action } from "@ember/object";
import DButton from "discourse/components/d-button";

import { getLinksForPost, openQRCodeModal } from "../lib/link-qr-code";

export default class LinkQRCodeButton extends Component {
  get links() {
    return getLinksForPost(this.args.post);
  }

  get title() {
    const buttonText =
      settings.qr_code_button_text || "Links als QR-Codes anzeigen";

    return `${buttonText} (${this.links.length})`;
  }

  @action
  openModal() {
    openQRCodeModal(getLinksForPost(this.args.post));
  }

  <template>
    <DButton
      class="link-qr-code-post-menu-button"
      title={{this.title}}
      aria-label={{this.title}}
      ...attributes
      @action={{this.openModal}}
      @icon="qrcode"
    />
  </template>
}
