import React, { useEffect, useRef, useState } from 'react';

interface Skill {
  name: string;
  pct: number;
}

interface SkillCategory {
  title: string;
  icon: string;
  skills: Skill[];
}

const SKILLS_DATA: SkillCategory[] = [
  {
    title: "Frontend",
    icon: "🎨",
    skills: [
      { name: "React", pct: 88 },
      { name: "Astro", pct: 85 },
      { name: "Flutter", pct: 82 },
      { name: "Three.js", pct: 72 },
      { name: "TypeScript", pct: 80 },
      { name: "Tailwind CSS", pct: 92 },
      { name: "HTML5 / CSS3", pct: 95 },
      { name: "JavaScript", pct: 88 },
      { name: "Vite", pct: 80 }
    ]
  },
  {
    title: "Backend",
    icon: "⚙️",
    skills: [
      { name: "Firebase", pct: 88 },
      { name: "FastAPI", pct: 85 },
      { name: "Python", pct: 85 },
      { name: "PHP", pct: 85 },
      { name: "Node.js", pct: 78 }
    ]
  },
  {
    title: "Database",
    icon: "🗄️",
    skills: [
      { name: "Firebase Firestore", pct: 88 },
      { name: "MySQL", pct: 85 },
      { name: "PostgreSQL", pct: 80 },
      { name: "SQLite", pct: 78 }
    ]
  }
];

export const SkillsProgress: React.FC = () => {
  const [animate, setAnimate] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimate(true);
            observer.disconnect(); // Animate once
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="stack-grid" id="stack-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
      {SKILLS_DATA.map((cat, idx) => (
        <div key={idx} className="stack-card reveal visible" style={{ transitionDelay: `${idx * 0.1}s` }}>
          <div className="stack-card-header">
            <span className="stack-icon">{cat.icon}</span>
            <span className="stack-cat font-display">{cat.title}</span>
          </div>
          {cat.skills.map((skill, sIdx) => (
            <div key={sIdx} className="skill-item">
              <div className="skill-row">
                <span className="skill-name">{skill.name}</span>
                <span className="skill-pct">{skill.pct}%</span>
              </div>
              <div className="skill-track">
                <div
                  className="skill-fill"
                  style={{
                    width: animate ? `${skill.pct}%` : '0%',
                    transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
