import BlobScene from "../three/BlobScene";
import { resumeData } from "../data/resumeData";

const Hero = () => (
  <section id="home" className="hero">
    <div className="hero__content">
      <p className="hero__greeting">Hello, I'm</p>
      <h1 className="hero__name">{resumeData.basics.name}</h1>
      <p className="hero__title">{resumeData.basics.label}</p>
      <p className="hero__summary">{resumeData.basics.summary}</p>
      <div className="hero__cta">
        <a href="#projects" className="btn btn--primary">
          View Projects
        </a>
        <a href="#experience" className="btn btn--outline">
          Experience
        </a>
      </div>
    </div>

    <div className="hero__canvas">
      <BlobScene />
    </div>
  </section>
);

export default Hero;
