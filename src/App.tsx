import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Education from "./components/Education";
import Contact from "./components/Contact";
import WorkedFor from "./components/WorkedFor";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
        <WorkedFor />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
