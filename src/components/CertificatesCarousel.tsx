import React, { useState, useEffect, useRef } from 'react';

import packetTracerImg from '../assets/x2.jpg';
import cert1Img from '../assets/cert1.jpg';
import cert2Img from '../assets/cert2.jpg';

interface Certificate {
  id: number;
  name: string;
  issuer: string;
  date: string;
  credentialId: string;
  verifyUrl: string;
  emoji: string;
  image: ImageMetadata | string;
  description: string;
}

const CERTIFICATES_DATA: Certificate[] = [
  {
    id: 0,
    name: "Introduction to Packet Tracer",
    issuer: "Cisco Networking Academy",
    date: "Feb 2024",
    credentialId: "6a749b94-2673-4b23-804b-6430f319fcac",
    verifyUrl: "https://www.netacad.com/",
    emoji: "🌐",
    image: packetTracerImg,
    description:
      "Completed Cisco's official Introduction to Packet Tracer course through the Networking Academy program. Gained hands-on experience simulating network topologies, configuring routers and switches, and troubleshooting connectivity — building a practical foundation in computer networking."
  },
  {
    id: 1,
    name: "Journey from Science Practitioner to IT Specialist",
    issuer: "Davao del Norte State College",
    date: "Oct 2025",
    credentialId: "Advanced Seminar Series – Day 1",
    verifyUrl: "#",
    emoji: "💻",
    image: cert1Img,
    description:
      "Attended Day 1 of the Advanced Seminar Series for BSIT 4th Year Students at Davao del Norte State College. The session explored career transition pathways from science-oriented roles into Information Technology specializations, held via Microsoft Teams on October 8, 2025."
  },
  {
    id: 2,
    name: "The Power of Color in Graphic Design",
    issuer: "Davao del Norte State College",
    date: "Nov 2025",
    credentialId: "Advanced Seminar Series – Day 2",
    verifyUrl: "#",
    emoji: "🎨",
    image: cert2Img,
    description:
      "Attended Day 2 of the Advanced Seminar Series covering color theory, psychology, and practical application in graphic design. The seminar was held on November 5, 2025, at Davao del Norte State College Gymnasium, Panabo City."
  }
];

export const CertificatesCarousel: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const total = CERTIFICATES_DATA.length;
  const stageRef = useRef<HTMLDivElement | null>(null);

  const touchStartX = useRef(0);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);

  const goTo = (idx: number) => {
    setCurrent(((idx % total) + total) % total);
  };

  const getCardClass = (idx: number) => {
    const diff = idx - current;
    const a = ((diff % total) + total) % total;
    if (a === 0) return 'active';
    if (a === 1) return 'next-1';
    if (a === total - 1) return 'prev-1';
    return 'far';
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [current]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      goTo(diff > 0 ? current + 1 : current - 1);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartX.current = e.clientX;
    isDragging.current = true;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diff = dragStartX.current - e.clientX;
    if (Math.abs(diff) > 40) {
      goTo(diff > 0 ? current + 1 : current - 1);
    }
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  return (
    <div className="cert-deck-wrap">
      <div className="cert-deck-center">
        <div className="section-tag reveal visible">Certificates</div>
        <h2 className="section-heading font-display reveal visible" style={{ marginTop: '24px' }}>
          Professional<br />
          <span className="text-gradient">credentials</span>
        </h2>
        <p className="reveal visible" style={{ color: 'rgba(10,31,0,0.5)', maxWidth: '440px', margin: '16px auto 0', lineHeight: 1.7 }}>
          Industry-recognized certifications validating expertise in development, systems, and technology.
        </p>
      </div>

      <div
        ref={stageRef}
        className="cert-deck-stage reveal visible"
        id="certDeckStage"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {CERTIFICATES_DATA.map((cert) => {
          const cardClass = getCardClass(cert.id);
          const isActive = cardClass === 'active';

          return (
            <div
              key={cert.id}
              className={`cert-deck-card ${cardClass}`}
              onClick={() => !isActive && goTo(cert.id)}
            >
              <div className="cert-corner"></div>

              {/* Certificate Image */}
              <div className="cert-image-wrap">
                <img
                  src={typeof cert.image === 'string' ? cert.image : cert.image.src}
                  alt={cert.name}
                  className="cert-image"
                  draggable={false}
                />
              </div>

              {/* Certificate Info */}
              <div className="cert-body">
                <div className="cert-head">
                  <div className="cert-badge-wrap">{cert.emoji}</div>
                  <span className="cert-date">{cert.date}</span>
                </div>
                <div className="cert-name font-display">{cert.name}</div>
                <div className="cert-issuer">{cert.issuer}</div>
                <p className="cert-description">{cert.description}</p>
                <div className="cert-id-row">
                  <div className="cert-id-line"></div>
                  <span className="cert-id-text">ID: {cert.credentialId}</span>
                </div>
                <a
                  href={cert.verifyUrl}
                  className="cert-verify"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => !isActive && e.preventDefault()}
                >
                  ✓ Verify Credential
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <p className="cert-swipe-hint">← SWIPE OR USE ARROWS →</p>

      <div className="cert-deck-nav">
        <button className="cert-nav-btn" onClick={() => goTo(current - 1)}>&#8592;</button>
        <div className="cert-dots" id="certDots">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`cert-dot ${i === current ? 'active' : ''}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <button className="cert-nav-btn" onClick={() => goTo(current + 1)}>&#8594;</button>
      </div>
    </div>
  );
};