import Hero from '../components/home/Hero';
import PlatformKnows from '../components/home/PlatformKnows';
import Features from '../components/home/Features';
import Dashboard from '../components/home/Dashboard';
import CtaBanner from '../components/home/CtaBanner';

export default function Home() {
  return (
    <>
      <Hero />
      <PlatformKnows />
      <Features />
      <Dashboard />
      <CtaBanner />
    </>
  );
}
