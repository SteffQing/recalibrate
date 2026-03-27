"use client";

import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import styles from "./page.module.css";

const ACCESS_CODE = "";

export default function VerifyPage() {
  const [isGated, setIsGated] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [scanResult, setScanResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ACCESS_CODE) {
      setIsGated(false);
      setError("");
    } else {
      setError("Incorrect access code");
    }
  };

  useEffect(() => {
    if (!isGated) {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false,
      );

      scanner.render(
        async (decodedText) => {
          scanner.pause();
          await verifyCode(decodedText);
          setTimeout(() => scanner.resume(), 3000);
        },
        (error) => {
          // ignore scan errors
        },
      );

      return () => {
        scanner.clear();
      };
    }
  }, [isGated]);

  const verifyCode = async (code: string) => {
    setIsVerifying(true);
    setScanResult(null);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      setScanResult(data);
    } catch (err) {
      setScanResult({ error: "Failed to connect to server" });
    } finally {
      setIsVerifying(false);
    }
  };

  if (isGated) {
    return (
      <div className={styles.gatedContainer}>
        <div className={styles.loginBox}>
          <h1>Verification Access</h1>
          <p>Please enter the access code to continue.</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Access Code"
              className={styles.input}
            />
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.btn}>
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Verify QR Code</h1>
        <button onClick={() => setIsGated(true)} className={styles.lockBtn}>
          Lock
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.scannerSection}>
          <div id="reader" className={styles.reader}></div>
          {isVerifying && <div className={styles.loading}>Verifying...</div>}
        </div>

        <div className={styles.resultSection}>
          {scanResult ? (
            <div
              className={`${styles.resultCard} ${scanResult.success ? styles.success : styles.fail}`}
            >
              {scanResult.success ? (
                <>
                  <div className={styles.statusIcon}>✓</div>
                  <h2>Verified Successfully</h2>
                  <div className={styles.details}>
                    <p>
                      <strong>Name:</strong> {scanResult.data.fullName}
                    </p>
                    <p>
                      <strong>Category:</strong> {scanResult.data.category}
                    </p>
                    <p>
                      <strong>Residence:</strong> {scanResult.data.residence}
                    </p>
                    <p>
                      <strong>Phone:</strong> {scanResult.data.phoneNumber}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.statusIcon}>✕</div>
                  <h2>Verification Failed</h2>
                  <p className={styles.errorMsg}>{scanResult.error}</p>
                </>
              )}
              <button
                onClick={() => setScanResult(null)}
                className={styles.clearBtn}
              >
                Clear
              </button>
            </div>
          ) : (
            <div className={styles.placeholder}>
              <p>Ready to scan...</p>
              <p className={styles.hint}>
                Place the visitor's QR code in the frame
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
