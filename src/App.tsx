import "./index.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Experience from "./components/Experience";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Footer from "./components/Footer";

function App() {
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <Experience />
        <Skills />
        <Projects />
      </main>
      <Footer />
    </div>
  );
}

export default App;
