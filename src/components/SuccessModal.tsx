"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import styles from "./SuccessModal.module.css";

interface Props {
  id: number;
  onClose: () => void;
}

export default function SuccessModal({ id, onClose }: Props) {
  const [qrDataUrl, setQrDataUrl] = useState("");

  const generateRandomString = (length: number) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const accessCode = `RC-${generateRandomString(8)}-${id}-${generateRandomString(4)}`;

  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(accessCode, {
          width: 512,
          margin: 2,
          color: {
            dark: "#D4A017", // Gold
            light: "#00000000", // Transparent
          },
        });
        setQrDataUrl(url);
      } catch (err) {
        console.error("QR Generation Error:", err);
      }
    };
    generateQR();
  }, [id, accessCode]);

  const downloadPNG = () => {
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `recalibrate-access-${id}.png`;
    link.click();
  };

  const downloadPDF = () => {
    const pdf = new jsPDF();
    pdf.setFillColor(15, 15, 15); // Dark background
    pdf.rect(0, 0, 210, 297, "F");
    
    pdf.setTextColor(212, 160, 23); // Gold
    pdf.setFontSize(22);
    pdf.text("RECALIBRATE CAMP MEETING", 105, 40, { align: "center" });
    
    pdf.setFontSize(16);
    pdf.text("ACCESS CODE", 105, 60, { align: "center" });
    
    pdf.addImage(qrDataUrl, "PNG", 55, 80, 100, 100);
    
    pdf.setFontSize(12);
    pdf.text(`User ID: ${id}`, 105, 190, { align: "center" });
    pdf.text("Please present this QR code at the entrance.", 105, 210, { align: "center" });
    
    pdf.save(`recalibrate-access-${id}.pdf`);
  };

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

        <div className={styles.qrSection}>
          <p className={styles.qrTitle}>Your Access Code</p>
          {qrDataUrl && (
            <div className={styles.qrWrapper}>
              <img src={qrDataUrl} alt="Access QR Code" className={styles.qrImage} />
            </div>
          )}
          <div className={styles.downloadGroup}>
            <button onClick={downloadPNG} className={styles.downloadBtn}>
              Download PNG
            </button>
            <button onClick={downloadPDF} className={styles.downloadBtn}>
              Download PDF
            </button>
          </div>
        </div>

        <div className={styles.ctaBox}>
          <p className={styles.ctaText}>Join the WhatsApp group for updates:</p>
          <a
            href="https://bit.ly/4bR4d2Z"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappBtn}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Join WhatsApp Group
          </a>
        </div>
        <button className={styles.closeBtn} onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}
