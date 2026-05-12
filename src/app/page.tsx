import { Header, Hero, Services, About, CTA, Contact, Footer, WhatsAppButton, PromotionPopup, SolarEnergySubscription } from '@/components';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <About />
        <SolarEnergySubscription />
        <CTA />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
      <PromotionPopup />
    </>
  );
}
