'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase';

const containerStyle = {
    maxWidth: '1280px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
    width: '100%',
};

export default function SolarEnergySubscription() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const message = 'Olá! Gostaria de saber mais sobre a assinatura de energia solar.';

    useEffect(() => {
        const fetchSettings = async () => {
            const supabase = createBrowserClient();
            const { data } = await supabase.from('settings').select('whatsapp_number').single();
            if (data?.whatsapp_number) {
                setPhoneNumber(data.whatsapp_number);
            }
        };
        fetchSettings();
    }, []);

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    const steps = [
        {
            number: '1',
            title: 'Geramos energia limpa',
            description: 'As usinas solares são instaladas em locais onde o sol é forte e abundante. Nelas, centenas de placas fotovoltaicas captam a luz e a transformam em energia elétrica.',
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                </svg>
            )
        },
        {
            number: '2',
            title: 'Você faz sua assinatura',
            description: 'Ao assinar o Crédito de Energia da Enova, você contrata uma cota de uma dessas usinas e a energia gerada por ela é direcionada para o seu imóvel.',
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M16 13H8" />
                    <path d="M16 17H8" />
                    <path d="M10 9H8" />
                </svg>
            )
        },
        {
            number: '3',
            title: 'Utilize a sua energia',
            description: 'Tudo pronto para utilizar a sua energia! Mas, caso o volume não seja utilizado totalmente, o mesmo fica acumulado para o próximo mês. Essa é a sua recompensa por utilizar energia limpa!',
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4l3 3" />
                </svg>
            )
        }
    ];

    return (
        <section id="energia-solar" className="py-20 lg:py-28 bg-gray-50 w-full">
            <div style={{ ...containerStyle, paddingTop: '3rem' }}>
                <div className="text-center max-w-3xl mx-auto mb-16" style={{ marginTop: '3rem' }}>
                    <span style={{ display: 'inline-block', padding: '0.5rem 1.5rem', background: 'linear-gradient(to right, #FC4C00, #FF7033)', color: 'white', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', borderRadius: '9999px', marginBottom: '1rem' }}>Sustentabilidade</span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#29577E] mb-6">Assinatura de Energia Solar</h2>
                    <p className="text-lg text-gray-500 leading-relaxed">Siga estes três passos simples para começar a economizar na sua conta de luz utilizando energia limpa.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {steps.map((step, index) => (
                        <div key={index} style={{ padding: '2.5rem', backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', transition: 'all 0.3s ease' }} className="hover:-translate-y-2 hover:shadow-xl group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -mr-16 -mt-16 transition-all duration-300 group-hover:bg-[#29577E]/5"></div>
                            
                            <div className="flex items-center gap-4 mb-6 relative z-10">
                                <div style={{ width: '4rem', height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #29577E, #2a5a8c)', color: 'white', borderRadius: '0.75rem', flexShrink: 0 }}>
                                    {step.icon}
                                </div>
                                <span style={{ fontSize: '3rem', fontWeight: 900, color: '#f3f4f6', lineHeight: 1 }}>{step.number}</span>
                            </div>
                            
                            <div className="relative z-10">
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#29577E', marginBottom: '1rem' }}>{step.title}</h3>
                                <p style={{ fontSize: '1rem', color: '#6b7280', lineHeight: 1.6 }}>{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <a 
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2rem', background: 'linear-gradient(to right, #FC4C00, #FF7033)', color: 'white', fontWeight: 600, borderRadius: '9999px', transition: 'all 0.3s ease' }}
                        className="hover:shadow-lg hover:scale-105"
                    >
                        Fale Conosco
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}
