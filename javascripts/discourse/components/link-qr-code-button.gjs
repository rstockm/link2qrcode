import Component from "@glimmer/component";
import { action } from "@ember/object";
import DButton from "discourse/components/d-button";

export default class LinkQRCodeButton extends Component {
  @action
  testClick() {
    // eslint-disable-next-line no-alert
    alert("QR-Test-Button funktioniert!");
  }

  <template>
    <DButton
      class="link-qr-code-post-menu-button"
      title="QR Test"
      aria-label="QR Test"
      ...attributes
      @action={{this.testClick}}
      @icon="qrcode"
    />
  </template>
}
