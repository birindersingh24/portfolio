import { useEffect, useRef } from "react";
import { resumeData } from "../data/resumeData";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const formatDate = (d: string) => {
  if (!d) return "Present";
  const [year, month] = d.split("-");
  return `${MONTHS[parseInt(month) - 1]} ${year}`;
};

// Parses "Label: description" → bold label + rest of text
const parseHighlight = (h: string) => {
  const idx = h.indexOf(":");
  if (idx === -1) return <>{h}</>;
  return (
    <>
      <strong>{h.slice(0, idx)}</strong>
      {h.slice(idx)}
    </>
  );
};

const Experience = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const items = sectionRef.current?.querySelectorAll(".reveal");
    items?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="experience">
      <div className="section" ref={sectionRef}>
        <p className="section__label">Career</p>
        <h2 className="section__title">Work Experience</h2>

        <div className="timeline">
          {resumeData.work.map((job, i) => (
            <div
              key={i}
              className="timeline__item reveal"
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              <div className="timeline__dot" />
              <div className="timeline__meta">
                <span className="timeline__date">
                  {formatDate(job.startDate)} — {formatDate(job.endDate)}
                </span>
                <span className="timeline__location">{job.location}</span>
              </div>
              <h3 className="timeline__role">{job.position}</h3>
              <p className="timeline__company">{job.name}</p>
              <ul className="timeline__highlights">
                {job.highlights.map((h, j) => (
                  <li key={j}>{parseHighlight(h)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
