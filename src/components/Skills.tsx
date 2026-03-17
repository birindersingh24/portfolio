import { useEffect, useRef } from "react";
import { resumeData } from "../data/resumeData";

const Skills = () => {
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
    <section id="skills">
      <div className="section" ref={sectionRef}>
        <p className="section__label">Expertise</p>
        <h2 className="section__title">Skills</h2>

        <div className="skills-grid">
          {resumeData.skills.map((skill, i) => (
            <div
              key={i}
              className="skill-card reveal"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <p className="skill-card__name">{skill.name}</p>
              <div className="skill-card__tags">
                {skill.keywords.map((kw, j) => (
                  <span key={j} className="tag">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
