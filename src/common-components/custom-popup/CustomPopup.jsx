"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import styles from "./CustomPopup.module.css";

const CustomPopup = ({
  isOpen = true, 
  onclose,
  onClose,
  children,
  wide = false,
  closeIcon = true,
  maxWidth,
}) => {
  const handleClose = onclose || onClose || (() => {});

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !isOpen) return undefined;

    const scrollY = window.scrollY;
    const prev = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    const onKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev.overflow;
      document.body.style.position = prev.position;
      document.body.style.top = prev.top;
      document.body.style.width = prev.width;
      window.scrollTo(0, scrollY);
    };
  }, [mounted, isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className={styles.root}>
      <div className={styles.overlay} onClick={handleClose}>
        <div
          className={`${styles.popup} ${wide ? styles.popupWide : ""}`}
          style={maxWidth ? { maxWidth } : undefined}
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.content}>{children}</div>
  
          {closeIcon && (
            <button
              type="button"
              className={styles.closeBtn}
              onClick={handleClose}
              aria-label="Close"
            >
              <IoClose size={20} color="#333" />
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default CustomPopup;