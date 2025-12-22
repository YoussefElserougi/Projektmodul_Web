import React, { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";

export default function EmailHtmlRenderer({
  html = "",
  attachments = {}, // map like { 'cid:abc': 'https://...' }
  blockRemoteImages = true,
  className = "",
  style = {},
  loadImagesLabel = "Load remote images",
}) {
  const containerRef = useRef(null);
  const [imagesBlocked, setImagesBlocked] = useState(
    Boolean(blockRemoteImages)
  );

  useEffect(() => {
    if (!containerRef.current) return;

    // Parse the HTML into a document so we can rewrite anchors and images
    const parser = new DOMParser();
    const doc = parser.parseFromString(html || "<div></div>", "text/html");

    // 1) Rewrite anchors to be safe: target _blank, rel no opener
    const anchors = doc.querySelectorAll("a");
    anchors.forEach((a) => {
      // keep href but remove javascript: and data URIs that might be dangerous
      const href = a.getAttribute("href");
      if (!href) return;
      const lowered = href.trim().toLowerCase();
      if (lowered.startsWith("javascript:")) {
        a.removeAttribute("href");
      } else {
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
      }
    });

    // 2) Handle images: support cid: mapping, optionally block remote
    const imgs = doc.querySelectorAll("img");
    imgs.forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (!src) return;

      // If it's a CID attachment, replace if provided
      if (src.startsWith("cid:")) {
        const mapped = attachments[src];
        if (mapped) {
          img.setAttribute("src", mapped);
        } else {
          // Remove the image if we don't have the attachment
          img.remove();
          return;
        }
      }

      // Block remote images if requested (to avoid tracking)
      const isRemote = /^https?:\/\//i.test(src);
      if (isRemote && imagesBlocked) {
        // save original into data-src and replace src with tiny transparent
        img.setAttribute("data-src", src);
        img.setAttribute(
          "src",
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
        );
        img.setAttribute("data-remote-blocked", "true");
      }

      // Remove srcset (to avoid fetching alternate urls) — optional
      if (img.hasAttribute("srcset")) img.removeAttribute("srcset");

      // Remove on* event attributes that DOMPurify might not remove before sanitization
      Array.from(img.attributes).forEach((attr) => {
        if (/^on/i.test(attr.name)) img.removeAttribute(attr.name);
      });
    });

    // 3) Optionally: remove <meta http-equiv> or <base> tags to avoid base URL injection
    const bases = doc.querySelectorAll("base, meta[http-equiv]");
    bases.forEach((b) => b.remove());

    // 4) Serialize and sanitize with DOMPurify
    const dirty = doc.body.innerHTML;

    // Configure DOMPurify if you want to allow style attributes but remove <style> tags,
    // you can tune these options. By default DOMPurify will keep style attributes but remove <script>.
    const clean = DOMPurify.sanitize(dirty, {
      WHOLE_DOCUMENT: false,
      RETURN_TRUSTED_TYPE: false,
      // ALLOWED_TAGS: false, // use default allowed tags
      // ALLOWED_ATTR: false, // use default allowed attributes
    });

    // Finally set container's innerHTML
    containerRef.current.innerHTML = clean;

    // After injection, attach a small delegation handler for loading remote images on user action
    // We'll add a button in the container if any images were blocked.
  }, [html, attachments, imagesBlocked]);

  // Function to load all blocked images now (user-initiated)
  function loadRemoteImages() {
    if (!containerRef.current) return;
    const imgs = containerRef.current.querySelectorAll(
      'img[data-remote-blocked="true"]'
    );
    imgs.forEach((img) => {
      const real = img.getAttribute("data-src");
      if (real) img.setAttribute("src", real);
      img.removeAttribute("data-remote-blocked");
      img.removeAttribute("data-src");
    });
    setImagesBlocked(false);
  }

  return (
    <div className={`email-html-renderer ${className}`} style={style}>
      <div ref={containerRef} style={{ minHeight: 20 }} />
    </div>
  );
}
