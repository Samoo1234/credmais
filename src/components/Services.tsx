import Link from 'next/link';

const containerStyle = {
    maxWidth: '1280px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
    width: '100%',
};

const services = [
    { title: 'Consignados', description: 'Crédito consignado com as melhores taxas do mercado. Desconto direto em folha para servidores públicos e aposentados.', icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg> },
    { title: 'Projetos Energia Sustentável', description: 'Financiamento para energia solar e projetos sustentáveis. Economize na conta de luz e ajude o planeta.', icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /></svg> },
    { title: 'Seguros e Crédito Empresarial', description: 'Proteja seu patrimônio e impulsione seu negócio com capital de giro e linhas de crédito empresarial.', icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> },
    { title: 'Limpa Nome', description: 'Renegocie suas dívidas e limpe seu nome. Condições especiais para você voltar a ter crédito no mercado.', icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg> },
    { title: 'Financiamentos e Usina Solar', description: 'Financie sua usina solar com condições exclusivas. Invista em energia limpa e reduza seus custos.', icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg> },
    { title: 'Financiamentos de Veículos', description: 'Realize o sonho do carro próprio. Financiamento e consórcios com as melhores condições do mercado.', icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-2.7-3.6c-.4-.5-1-.9-1.7-.9H8.4c-.7 0-1.3.4-1.7.9L4 10l-2.5 1.1C.7 11.3 0 12.1 0 13v3c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></svg> },
    { title: 'Crédito com Garantia de Imóvel Rural', description: 'Use seu imóvel rural como garantia e acesse crédito com taxas reduzidas e prazos estendidos.', icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg> },
    { title: 'Financiamentos e Consórcios', description: 'Diversas opções de financiamento e consórcios para realizar seus objetivos de forma planejada.', icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg> },
];

export default function Services() {
    return (
        <section id="servicos" className="py-20 lg:py-28 bg-gray-50 w-full">
            <div style={containerStyle}>
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span style={{ display: 'inline-block', padding: '0.5rem 1.5rem', background: 'linear-gradient(to right, #FC4C00, #FF7033)', color: 'white', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', borderRadius: '9999px', marginBottom: '1rem' }}>Nossos Serviços</span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#29577E] mb-4">Parcerias e Produtos</h2>
                    <p className="text-lg lg:text-xl text-gray-500 leading-relaxed">Conheça nossa linha completa de soluções financeiras pensadas para atender todas as suas necessidades.</p>
                </div>
                <div className="services-grid">
                    {services.map((service, i) => (
                        <div key={i} className="service-card" style={{ padding: '2.5rem', backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', transition: 'all 0.3s ease' }}>
                            <div style={{ width: '4rem', height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #29577E, #2a5a8c)', color: 'white', borderRadius: '0.75rem', marginBottom: '1.25rem' }}>{service.icon}</div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#29577E', marginBottom: '0.75rem' }}>{service.title}</h3>
                            <p style={{ fontSize: '1rem', color: '#6b7280', lineHeight: 1.6, marginBottom: '1.25rem' }}>{service.description}</p>
                            <Link href="#contato" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#FC4C00' }}>Saiba mais →</Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
