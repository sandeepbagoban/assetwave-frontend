import Hero from '../components/home/Hero';
import LogoBar from '../components/home/LogoBar';
import PlatformKnows from '../components/home/PlatformKnows';
import Features from '../components/home/Features';
import ImpactTimeline from '../components/home/ImpactTimeline';
import CaseStudies from '../components/home/CaseStudies';
import Dashboard from '../components/home/Dashboard';
import CtaBanner from '../components/home/CtaBanner';

export default function Home() {
  return (
    <>
      <Hero />
      <LogoBar />
      <PlatformKnows />
      <Features />
      <ImpactTimeline />
      <CaseStudies />
      <Dashboard />
      <CtaBanner />
    </>
  );
}
