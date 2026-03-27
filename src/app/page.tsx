"use client";

import { useState } from "react";
import RegistrationForm from "@/components/RegistrationForm";
import SuccessModal from "@/components/SuccessModal";
import styles from "./page.module.css";

export default function Home() {
  const [showSuccess, setShowSuccess] = useState(true);
  const [registeredId, setRegisteredId] = useState<number | null>(1);

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <div className={styles.heroLogos}>
            <svg
              className={styles.turnersLogo}
              viewBox="0 0 120 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <text
                x="2"
                y="16"
                fontFamily="Arial Black, Arial"
                fontWeight="900"
                fontSize="14"
                fill="#E8751A"
                letterSpacing="-0.5"
              >
                tur
              </text>
              <text
                x="2"
                y="30"
                fontFamily="Arial Black, Arial"
                fontWeight="900"
                fontSize="14"
                fill="#E8751A"
                letterSpacing="-0.5"
              >
                ners
              </text>
              <circle cx="10" cy="4" r="3" fill="#D4A017" />
              <path
                d="M8 6 Q10 10 12 6"
                stroke="#E8751A"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
            <svg
              className={styles.recalibrateLogo}
              viewBox="0 0 100 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="2"
                y="2"
                width="96"
                height="46"
                rx="4"
                stroke="#fff"
                strokeWidth="2"
                fill="none"
              />
              <text
                x="50"
                y="18"
                textAnchor="middle"
                fontFamily="Arial Black, Arial"
                fontWeight="900"
                fontSize="11"
                fill="#fff"
                letterSpacing="1"
              >
                RECALI
              </text>
              <text
                x="50"
                y="32"
                textAnchor="middle"
                fontFamily="Arial Black, Arial"
                fontWeight="900"
                fontSize="11"
                fill="#fff"
                letterSpacing="1"
              >
                BRATE
              </text>
              <text
                x="50"
                y="43"
                textAnchor="middle"
                fontFamily="Arial, sans-serif"
                fontSize="7"
                fill="#fff"
                letterSpacing="2"
              >
                CAMP
              </text>
            </svg>
          </div>
          <p className={styles.heroEventTitle}>Recalibrate Camp Meeting</p>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroThe}>The</span>{" "}
            <span className={styles.heroGod}>God</span>
            <br />
            <span className={styles.heroOf}>of </span>
            <span className={styles.heroGlory}>Glory</span>
          </h1>
          <p className={styles.heroCta}>Register Now &amp; Secure Your Spot</p>
          <a href="#register" className={styles.heroBtn}>
            Begin Registration
          </a>
        </div>
        <div className={styles.heroFade} />
      </section>

      {/* Registration Section */}
      <section id="register" className={styles.registerSection}>
        <div className={styles.registerHeader}>
          <div className={styles.ornament}>
            <span />
            <span />
            <span />
          </div>
          <h2>Registration Form</h2>
          <p>Fill out the details below to secure your spot at the camp.</p>
        </div>
        <RegistrationForm
          onSuccess={(id) => {
            setRegisteredId(id);
            setShowSuccess(true);
          }}
        />
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>Recalibrate Camp Meeting &copy; {new Date().getFullYear()}</p>
        <p>
          Hosted by <strong>Turners</strong>
        </p>
      </footer>

      {showSuccess && registeredId && (
        <SuccessModal
          id={registeredId}
          onClose={() => {
            setShowSuccess(false);
            setRegisteredId(null);
          }}
        />
      )}
    </>
  );
}
