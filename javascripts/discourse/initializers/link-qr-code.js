import { apiInitializer } from "discourse/lib/api";

import LinkQRCodeButton from "../components/link-qr-code-button";

export default apiInitializer((api) => {
  api.registerValueTransformer("post-menu-buttons", ({ value: dag }) => {
    dag.add("link-qr-code-test", LinkQRCodeButton);
  });
});
