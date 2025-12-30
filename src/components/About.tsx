const containerStyle = { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1.5rem', paddingRight: '1.5rem', width: '100%' };

const features = [
    { title: 'Atendimento Personalizado', description: 'Cada cliente é único e merece atenção especial' },
    { title: 'Melhores Taxas', description: 'Trabalhamos com as melhores taxas do mercado' },
    { title: 'Agilidade', description: 'Processo rápido e descomplicado' },
    { title: 'Segurança', description: 'Seus dados protegidos com total transparência' },
];

const stats = [
    { number: '1000+', label: 'Clientes Satisfeitos' },
    { number: 'R$50M+', label: 'Em Crédito Liberado' },
    { number: '10+', label: 'Parceiros' },
    { number: '98%', label: 'Taxa de Aprovação' },
];

export default function About() {
    return (
        <section id="sobre" className="py-20 lg:py-28 w-full">
            <div style={containerStyle}>
                <div className="about-grid">
                    <div>
                        <span style={{ display: 'inline-block', padding: '0.5rem 1.5rem', background: 'linear-gradient(to right, #FC4C00, #FF7033)', color: 'white', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', borderRadius: '9999px', marginBottom: '1rem' }}>Sobre Nós</span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#29577E] mb-6">Por que escolher a Cred Mais?</h2>
                        <p className="text-lg text-gray-600 leading-relaxed mb-8">Somos especialistas em soluções financeiras, oferecendo as melhores condições do mercado para você realizar seus sonhos. Nossa equipe está preparada para encontrar a melhor opção para o seu perfil.</p>
                        <div className="space-y-5">
                            {features.map((f, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className="w-9 h-9 flex items-center justify-center bg-gradient-to-r from-[#FC4C00] to-[#FF7033] text-white font-bold rounded-full flex-shrink-0">✓</div>
                                    <div><h4 className="text-lg font-semibold text-[#29577E] mb-1">{f.title}</h4><p className="text-base text-gray-500">{f.description}</p></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="stats-grid">
                        {stats.map((s, i) => (
                            <div key={i} style={{ padding: '2.5rem', background: 'linear-gradient(to bottom right, #29577E, #0f2438)', borderRadius: '1rem', textAlign: 'center', color: 'white' }} className="transition-transform hover:scale-105">
                                <span style={{ display: 'block', fontSize: '2.5rem', fontWeight: 800, color: '#FC4C00', marginBottom: '0.5rem' }}>{s.number}</span>
                                <span style={{ fontSize: '0.9rem', fontWeight: 500, opacity: 0.9 }}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
