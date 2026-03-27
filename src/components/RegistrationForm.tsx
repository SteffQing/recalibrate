"use client";

import { useState, FormEvent } from "react";
import styles from "./RegistrationForm.module.css";

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  institution: string;
  occupation: string;
  sex: string;
  location: string;
  hearAbout: string;
  hearAboutOther: string;
  isMinister: string; // "Yes" | "No"
  ministryDetails: string;
  isFellowshipLeader: string; // "Yes" | "No"
  fellowshipDetails: string;
  expectations: string;
  agreedToRules: boolean;
}

const initialFormData: FormData = {
  fullName: "",
  email: "",
  phoneNumber: "",
  institution: "",
  occupation: "",
  sex: "",
  location: "",
  hearAbout: "",
  hearAboutOther: "",
  isMinister: "",
  ministryDetails: "",
  isFellowshipLeader: "",
  fellowshipDetails: "",
  expectations: "",
  agreedToRules: false,
};

interface Props {
  onSuccess: (id: number) => void;
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

    // Validation for sequential leadership questions
    if (form.isMinister === "Yes" && !form.ministryDetails.trim()) {
      setError("Please provide details about your ministry.");
      return;
    }
    if (form.isMinister === "No" && !form.isFellowshipLeader) {
      setError("Please indicate if you are a campus fellowship leader.");
      return;
    }
    if (form.isMinister === "No" && form.isFellowshipLeader === "Yes" && !form.fellowshipDetails.trim()) {
      setError("Please provide details about your campus fellowship and post held.");
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
          phoneNumber: form.phoneNumber,
          institution: form.institution,
          occupation: form.occupation,
          sex: form.sex,
          location: form.location,
          hearAbout,
          isMinister: form.isMinister === "Yes",
          ministryDetails: form.isMinister === "Yes" ? form.ministryDetails : null,
          isFellowshipLeader: form.isFellowshipLeader === "Yes",
          fellowshipDetails: form.isFellowshipLeader === "Yes" ? form.fellowshipDetails : null,
          expectations: form.expectations,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      onSuccess(data.id);
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
    form.phoneNumber &&
    form.institution &&
    form.occupation &&
    form.sex &&
    form.location &&
    form.hearAbout &&
    (form.hearAbout !== "Others" || form.hearAboutOther) &&
    form.isMinister &&
    (form.isMinister !== "Yes" || form.ministryDetails) &&
    (form.isMinister === "Yes" || (form.isFellowshipLeader && (form.isFellowshipLeader !== "Yes" || form.fellowshipDetails))) &&
    form.expectations &&
    form.agreedToRules;

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <div className={styles.errorBanner}>{error}</div>}

      <div className={styles.sectionLabel}>Delegate Information</div>

      <div className={styles.grid}>
        <div className={styles.field}>
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            placeholder="John Doe"
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
            placeholder="john@example.com"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            required
            placeholder="e.g. +234 812 345 6789"
            value={form.phoneNumber}
            onChange={handleChange}
          />
          <p className={styles.fieldNote}>* WhatsApp number is best for updates</p>
        </div>

        <div className={styles.field}>
          <label htmlFor="sex">Gender</label>
          <select id="sex" name="sex" required value={form.sex} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="institution">Institution / Workplace</label>
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
            placeholder="e.g. Student, Graphic Designer"
            value={form.occupation}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="location">Residential Address/Location</label>
          <input
            id="location"
            name="location"
            type="text"
            required
            placeholder="City, State"
            value={form.location}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="hearAbout">How did you hear about Recalibrate?</label>
          <select
            id="hearAbout"
            name="hearAbout"
            required
            value={form.hearAbout}
            onChange={handleChange}
          >
            <option value="">Select Option</option>
            <option value="Social Media">Social Media</option>
            <option value="Friend/Family">Friend/Family</option>
            <option value="Church/Ministry">Church/Ministry</option>
            <option value="WhatsApp Status">WhatsApp Status</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {form.hearAbout === "Others" && (
          <div className={styles.fieldFull}>
            <label htmlFor="hearAboutOther">Please specify (Others)</label>
            <input
              id="hearAboutOther"
              name="hearAboutOther"
              type="text"
              required
              placeholder="Tell us where..."
              value={form.hearAboutOther}
              onChange={handleChange}
            />
          </div>
        )}
      </div>

      <div className={styles.sectionLabel}>Leadership &amp; Ministry</div>

      {/* Sequential Leadership Questions */}
      <div className={styles.leadershipSection}>
        <div className={styles.fieldFull}>
          <label>Are you a minister of the gospel?</label>
          <div className={styles.radioGroup}>
            {["Yes", "No"].map((option) => (
              <label key={option} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="isMinister"
                  value={option}
                  checked={form.isMinister === option}
                  onChange={handleChange}
                />
                <span className={styles.radioMark} />
                <span>{option}</span>
              </label>
            ))}
          </div>
          {form.isMinister === "Yes" && (
            <div className={styles.field} style={{ marginTop: "0.75rem" }}>
              <label htmlFor="ministryDetails">Name and Location of Ministry</label>
              <input
                id="ministryDetails"
                name="ministryDetails"
                type="text"
                required
                placeholder="e.g. Grace Tabernacle, Lagos"
                value={form.ministryDetails}
                onChange={handleChange}
              />
            </div>
          )}
        </div>

        {form.isMinister === "No" && (
          <div className={styles.fieldFull} style={{ marginTop: "1rem" }}>
            <label>Are you a campus fellowship leader?</label>
            <div className={styles.radioGroup}>
              {["Yes", "No"].map((option) => (
                <label key={option} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="isFellowshipLeader"
                    value={option}
                    checked={form.isFellowshipLeader === option}
                    onChange={handleChange}
                  />
                  <span className={styles.radioMark} />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {form.isFellowshipLeader === "Yes" && (
              <div className={styles.field} style={{ marginTop: "0.75rem" }}>
                <label htmlFor="fellowshipDetails">Campus fellowship and post held</label>
                <input
                  id="fellowshipDetails"
                  name="fellowshipDetails"
                  type="text"
                  required
                  placeholder="e.g. RCF Unilag, President"
                  value={form.fellowshipDetails}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className={styles.fieldFull}>
        <label htmlFor="expectations">What are your expectations for this camp?</label>
        <textarea
          id="expectations"
          name="expectations"
          rows={4}
          required
          placeholder="I hope to receive spiritual rejuvenation..."
          value={form.expectations}
          onChange={handleChange}
        />
      </div>

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
        disabled={loading}
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
