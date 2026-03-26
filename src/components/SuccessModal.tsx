"use client";

import styles from "./SuccessModal.module.css";

interface Props {
  onClose: () => void;
}

export default function SuccessModal({ onClose }: Props) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.iconWrap}>
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="32" cy="32" r="32" fill="#D4A017" fillOpacity="0.15" />
            <circle cx="32" cy="32" r="24" fill="#D4A017" fillOpacity="0.25" />
            <path
              d="M22 33L29 40L42 25"
              stroke="#D4A017"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2>Registration Successful!</h2>
        <p>
          You have been registered for the <strong>Recalibrate Camp Meeting</strong>.
          We look forward to seeing you there.
        </p>
        <p className={styles.reminder}>
          Remember to come with your Bible, jotter, pen, sweater, and beddings.
        </p>
        <button className={styles.closeBtn} onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}
