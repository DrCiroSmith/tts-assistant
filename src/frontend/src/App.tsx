import { NavBar } from './components/NavBar';
import { Hero } from './components/Hero';
import { FeatureSection } from './components/FeatureSection';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <main>
        <Hero />
        <FeatureSection />
      </main>
    </div>
  );
}

export default App;
