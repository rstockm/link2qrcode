import { apiInitializer } from "discourse/lib/api";

import LinkQRCodeButton from "../components/link-qr-code-button";
import { hasLinksForPost } from "../lib/link-qr-code";

export default apiInitializer((api) => {
  api.registerValueTransformer(
    "post-menu-buttons",
    ({ value: dag, context: { post, firstButtonKey } }) => {
      if (!post || post.deleted_at || !hasLinksForPost(post)) {
        return;
      }

      const placement = firstButtonKey ? { before: firstButtonKey } : undefined;
      dag.add("link-qr-code", LinkQRCodeButton, placement);
    }
  );
});
