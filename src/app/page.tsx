import { Header, Hero, Services, About, CTA, Contact, Footer, WhatsAppButton } from '@/components';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <About />
        <CTA />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
