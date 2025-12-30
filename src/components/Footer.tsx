import Link from 'next/link';

const containerStyle = { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1.5rem', paddingRight: '1.5rem', width: '100%' };
const footerLinks = [
    { title: 'Links Rápidos', links: [{ label: 'Início', href: '#inicio' }, { label: 'Serviços', href: '#servicos' }, { label: 'Sobre', href: '#sobre' }, { label: 'Contato', href: '#contato' }] },
    { title: 'Serviços', links: [{ label: 'Consignados', href: '#servicos' }, { label: 'Financiamentos', href: '#servicos' }, { label: 'Seguros', href: '#servicos' }, { label: 'Crédito Empresarial', href: '#servicos' }] },
];

export default function Footer() {
    return (
        <footer className="bg-[#0f2438] pt-16 pb-6 text-white w-full">
            <div style={containerStyle}>
                <div className="footer-grid pb-10 border-b border-white/10">
                    <div><div className="text-2xl font-extrabold text-[#FC4C00] mb-4">CRED MAIS</div><p className="text-sm text-white/70 leading-relaxed">Soluções financeiras completas para você e sua empresa. Realizando sonhos e transformando vidas.</p></div>
                    {footerLinks.map((s, i) => (<div key={i}><h4 className="text-base font-semibold mb-5">{s.title}</h4>{s.links.map((l, j) => <Link key={j} href={l.href} className="block text-sm text-white/70 mb-3 hover:text-[#FC4C00] transition-all">{l.label}</Link>)}</div>))}
                    <div><h4 className="text-base font-semibold mb-5">Redes Sociais</h4><div className="flex gap-3">{['facebook', 'instagram', 'whatsapp', 'linkedin'].map((s) => (<a key={s} href="#" className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-[#FC4C00] hover:translate-y-[-4px] transition-all">{s === 'facebook' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>}{s === 'instagram' && <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /></svg>}{s === 'whatsapp' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>}{s === 'linkedin' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>}</a>))}</div></div>
                </div>
                <div className="pt-6 flex items-center justify-center gap-4">
                    <p className="text-sm text-white/50">© 2024 Cred Mais. Todos os direitos reservados.</p>
                    <Link href="/login" className="text-white/20 hover:text-white/50 transition-all" title="Área Administrativa">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                    </Link>
                </div>
            </div>
        </footer>
    );
}
