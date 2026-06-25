"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

type Registration = {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  institution: string;
  occupation: string;
  sex: string;
  location: string;
  hearAbout: string;
  isMinister: boolean;
  ministryDetails: string | null;
  isFellowshipLeader: boolean;
  fellowshipDetails: string | null;
  expectations: string;
  createdAt: string;
};

export default function AdminPage() {
  const [isGated, setIsGated] = useState(true);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  // Auto-dismiss the error toast after a few seconds
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(""), 4000);
    return () => clearTimeout(timer);
  }, [error]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load registrations.");
        return;
      }
      setRegistrations(data.registrations);
      setIsGated(false);
      setPasscode("");
    } catch {
      setError("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  if (isGated) {
    return (
      <div className={styles.gatedContainer}>
        {error && (
          <div className={styles.toast} role="alert">
            {error}
          </div>
        )}
        <div className={styles.loginBox}>
          <h1>Admin Access</h1>
          <p>Enter the admin passcode to view registrations.</p>
          <form onSubmit={handleLogin}>
            <div className={styles.passwordField}>
              <input
                type={showPassword ? "text" : "password"}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter Passcode"
                className={styles.input}
              />
              <button
                type="button"
                className={styles.toggleBtn}
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide passcode" : "Show passcode"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? "Checking..." : "Enter"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Registrations</h1>
        <div className={styles.headerRight}>
          <span className={styles.count}>{registrations.length} sign-ups</span>
          <button
            onClick={() => {
              setIsGated(true);
              setRegistrations([]);
            }}
            className={styles.lockBtn}
          >
            Lock
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Institution</th>
                <th>Occupation</th>
                <th>Sex</th>
                <th>Location</th>
                <th>Heard via</th>
                <th>Minister</th>
                <th>Leader</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r, i) => (
                <tr key={r.id}>
                  <td>{i + 1}</td>
                  <td>{r.fullName}</td>
                  <td>{r.email}</td>
                  <td>{r.phoneNumber}</td>
                  <td>{r.institution}</td>
                  <td>{r.occupation}</td>
                  <td>{r.sex}</td>
                  <td>{r.location}</td>
                  <td>{r.hearAbout}</td>
                  <td>
                    {r.isMinister ? (
                      <span title={r.ministryDetails ?? ""}>Yes</span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    {r.isFellowshipLeader ? (
                      <span title={r.fellowshipDetails ?? ""}>Yes</span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {registrations.length === 0 && (
                <tr>
                  <td colSpan={12} className={styles.empty}>
                    No registrations yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
