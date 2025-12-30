import Link from 'next/link';

const containerStyle = { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1.5rem', paddingRight: '1.5rem', width: '100%' };

export default function CTA() {
    return (
        <section className="bg-gradient-to-r from-[#FC4C00] to-[#FF7033] py-20 lg:py-24 w-full">
            <div style={containerStyle} className="text-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5">Pronto para transformar seus sonhos em realidade?</h2>
                <p className="text-lg lg:text-xl text-white/90 mb-8 max-w-2xl mx-auto">Entre em contato conosco e descubra a melhor solução financeira para você.</p>
                <Link href="#contato" style={{ padding: '1.25rem 2.5rem', fontSize: '1.125rem', fontWeight: 600, borderRadius: '9999px', backgroundColor: 'white', color: '#29577E', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>Fale com um Especialista</Link>
            </div>
        </section>
    );
}
