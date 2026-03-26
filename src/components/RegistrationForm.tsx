"use client";

import { useState, FormEvent } from "react";
import styles from "./RegistrationForm.module.css";

interface FormData {
  fullName: string;
  email: string;
  institution: string;
  occupation: string;
  sex: string;
  location: string;
  hearAbout: string;
  hearAboutOther: string;
  isLeader: string;
  leaderOffice: string;
  expectations: string;
  agreedToRules: boolean;
}

const initialFormData: FormData = {
  fullName: "",
  email: "",
  institution: "",
  occupation: "",
  sex: "",
  location: "",
  hearAbout: "",
  hearAboutOther: "",
  isLeader: "",
  leaderOffice: "",
  expectations: "",
  agreedToRules: false,
};

interface Props {
  onSuccess: () => void;
}

export default function RegistrationForm({ onSuccess }: Props) {
  const [form, setForm] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.agreedToRules) {
      setError("You must agree to the camp rules to register.");
      return;
    }

    const hearAbout =
      form.hearAbout === "Others" ? form.hearAboutOther : form.hearAbout;

    if (form.hearAbout === "Others" && !form.hearAboutOther.trim()) {
      setError("Please specify how you heard about Recalibrate.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          institution: form.institution,
          occupation: form.occupation,
          sex: form.sex,
          location: form.location,
          hearAbout,
          isLeader: form.isLeader === "Yes",
          leaderOffice: form.isLeader === "Yes" ? form.leaderOffice : null,
          expectations: form.expectations,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      onSuccess();
      setForm(initialFormData);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    form.fullName &&
    form.email &&
    form.institution &&
    form.occupation &&
    form.sex &&
    form.location &&
    form.hearAbout &&
    (form.hearAbout !== "Others" || form.hearAboutOther) &&
    form.isLeader &&
    (form.isLeader !== "Yes" || form.leaderOffice) &&
    form.expectations &&
    form.agreedToRules;

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.sectionLabel}>Delegate Information</div>

      <div className={styles.fieldGrid}>
        <div className={styles.field}>
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            placeholder="Enter your full name"
            value={form.fullName}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="your@email.com"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="institution">Institution / School</label>
          <input
            id="institution"
            name="institution"
            type="text"
            required
            placeholder="e.g. University of Lagos"
            value={form.institution}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="occupation">Occupation</label>
          <input
            id="occupation"
            name="occupation"
            type="text"
            required
            placeholder="e.g. Student, Engineer"
            value={form.occupation}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="sex">Sex</label>
          <select
            id="sex"
            name="sex"
            required
            value={form.sex}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            type="text"
            required
            placeholder="e.g. Lagos, Nigeria"
            value={form.location}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.fieldFull}>
        <label>How did you hear about Recalibrate?</label>
        <div className={styles.radioGroup}>
          {["Social Media", "Friend/Word of Mouth", "School/Campus Announcement", "Others"].map(
            (option) => (
              <label key={option} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="hearAbout"
                  value={option}
                  checked={form.hearAbout === option}
                  onChange={handleChange}
                />
                <span className={styles.radioMark} />
                <span>{option}</span>
              </label>
            )
          )}
        </div>
        {form.hearAbout === "Others" && (
          <input
            name="hearAboutOther"
            type="text"
            placeholder="Please specify..."
            value={form.hearAboutOther}
            onChange={handleChange}
            className={styles.conditionalInput}
          />
        )}
      </div>

      <div className={styles.divider} />

      <div className={styles.sectionLabel}>Leadership &amp; Ministry</div>

      <div className={styles.fieldFull}>
        <label>Are you a Campus Leader or a Minister of the Gospel?</label>
        <div className={styles.radioGroup}>
          {["Yes", "No"].map((option) => (
            <label key={option} className={styles.radioLabel}>
              <input
                type="radio"
                name="isLeader"
                value={option}
                checked={form.isLeader === option}
                onChange={handleChange}
              />
              <span className={styles.radioMark} />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {form.isLeader === "Yes" && (
          <div className={styles.field} style={{ marginTop: "0.75rem" }}>
            <label htmlFor="leaderOffice">Current Office or Portfolio</label>
            <input
              id="leaderOffice"
              name="leaderOffice"
              type="text"
              placeholder="e.g. Campus Fellowship President"
              value={form.leaderOffice}
              onChange={handleChange}
            />
          </div>
        )}
      </div>

      <div className={styles.divider} />

      <div className={styles.fieldFull}>
        <label htmlFor="expectations">
          What are you specifically trusting God for at this Camp Meeting?
        </label>
        <textarea
          id="expectations"
          name="expectations"
          rows={4}
          required
          placeholder="Share your expectations..."
          value={form.expectations}
          onChange={handleChange}
        />
      </div>

      <div className={styles.divider} />

      {/* Camp Checklist */}
      <div className={styles.infoBlock}>
        <h3>Camp Checklist</h3>
        <p className={styles.infoSubtext}>
          Come prepared with these items for the best experience:
        </p>
        <div className={styles.checklistColumns}>
          <div>
            <h4>Spiritual &amp; Academic</h4>
            <ul>
              <li>A Heart of Expectation</li>
              <li>A physical Hardcover Bible</li>
              <li>A dedicated Jotter &amp; Pen</li>
            </ul>
          </div>
          <div>
            <h4>Personal Comfort</h4>
            <ul>
              <li>A thick Sweater (it may get chilly)</li>
              <li>Your own Bedsheet</li>
              <li>A Cover cloth / Blanket</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Camp Rules */}
      <div className={styles.infoBlock}>
        <h3>Camp Rules &amp; Conduct</h3>
        <p className={styles.infoSubtext}>
          By registering, you agree to uphold these guidelines:
        </p>
        <ol className={styles.rulesList}>
          <li>Presence at every session is mandatory.</li>
          <li>
            Rooms must be vacated once a session begins — no loitering in the
            hostel during program hours.
          </li>
          <li>
            Strict silence is observed after &ldquo;Lights Out&rdquo; to ensure
            everyone rests well.
          </li>
          <li>
            Dressing must be modest and appropriate while in camp.
          </li>
        </ol>
      </div>

      <label className={styles.agreementLabel}>
        <input
          type="checkbox"
          name="agreedToRules"
          checked={form.agreedToRules}
          onChange={handleChange}
        />
        <span className={styles.checkMark} />
        <span>
          I have read and agree to abide by the Camp Rules &amp; Conduct above.
        </span>
      </label>

      {error && <div className={styles.error}>{error}</div>}

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={loading || !isFormValid}
      >
        {loading ? (
          <span className={styles.spinner} />
        ) : (
          "Register for Recalibrate"
        )}
      </button>
    </form>
  );
}
