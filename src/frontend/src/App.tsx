import { NavBar } from './components/NavBar';
import { Hero } from './components/Hero';
import { FeatureSection } from './components/FeatureSection';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:bg-black focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Skip to main content
      </a>
      <NavBar />
      <main id="main-content">
        <Hero />
        <FeatureSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
