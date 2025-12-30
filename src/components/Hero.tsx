import Link from 'next/link';
import Image from 'next/image';
import LogoCliente from '@/assets/sem fundo.png';

const containerStyle = {
    maxWidth: '1280px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
    width: '100%',
};

export default function Hero() {
    return (
        <section id="inicio" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#29577E] to-[#0f2438] overflow-hidden pt-20 w-full">
            {/* Decorative Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute w-[350px] lg:w-[450px] aspect-square bg-[#FC4C00] opacity-90 animate-float"
                    style={{
                        clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                        bottom: '-80px',
                        right: '-30px'
                    }}
                />
                <div
                    className="absolute w-[250px] lg:w-[350px] aspect-square bg-[#2a5a8c] opacity-50 animate-float-reverse"
                    style={{
                        clipPath: 'polygon(25% 0%, 100% 0%, 100% 100%, 25% 100%, 0% 50%)',
                        top: '15%',
                        right: '8%'
                    }}
                />
                <div
                    className="absolute w-[150px] lg:w-[200px] aspect-square bg-[#FF7033] opacity-30 animate-rotate"
                    style={{
                        clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                        bottom: '25%',
                        left: '3%'
                    }}
                />
            </div>

            {/* Floating Hexagon - Logo Placeholder */}
            <div className="absolute right-[10%] top-1/2 -translate-y-1/2 z-10 hidden lg:flex items-center justify-center">
                <div
                    className="relative w-[350px] xl:w-[400px] aspect-square animate-float"
                    style={{
                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                        background: 'linear-gradient(135deg, rgba(232,168,60,0.15) 0%, rgba(42,90,140,0.25) 100%)',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    {/* Hexagon Border */}
                    <div
                        className="absolute inset-[3px]"
                        style={{
                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                            background: 'linear-gradient(135deg, #29577E 0%, #0f2438 100%)',
                        }}
                    />
                    {/* Inner Hexagon with gradient border effect */}
                    <div
                        className="absolute inset-[6px] flex items-center justify-center"
                        style={{
                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                            background: 'linear-gradient(135deg, rgba(232,168,60,0.1) 0%, rgba(42,90,140,0.2) 100%)',
                        }}
                    >
                        {/* Logo do Cliente */}
                        <div className="flex items-center justify-center w-full h-full p-8">
                            <Image
                                src={LogoCliente}
                                alt="Logo do Cliente"
                                className="w-auto h-auto max-w-[220px] xl:max-w-[280px] object-contain drop-shadow-lg"
                                priority
                            />
                        </div>
                    </div>
                </div>
                {/* Decorative glow */}
                <div
                    className="absolute w-[280px] h-[280px] bg-[#FC4C00]/20 rounded-full blur-3xl animate-pulse"
                    style={{ zIndex: -1 }}
                />
            </div>

            {/* Content - Centralizado */}
            <div style={containerStyle} className="relative z-10">
                <div className="max-w-3xl mx-auto text-center lg:text-left lg:mx-0 lg:max-w-xl">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.1] mb-6">
                        Soluções Financeiras<br />
                        <span className="text-[#FC4C00]">Para Realizar Seus Sonhos</span>
                    </h1>
                    <p className="text-lg lg:text-xl text-white/85 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                        Oferecemos as melhores opções de crédito e financiamento para você e sua empresa.
                        Conte com a Cred Mais para transformar seus projetos em realidade.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <Link
                            href="#servicos"
                            style={{ padding: '1.25rem 2.5rem', fontSize: '1.125rem', fontWeight: 600, borderRadius: '9999px', background: 'linear-gradient(to right, #FC4C00, #FF7033)', color: 'white', boxShadow: '0 4px 15px rgba(232,168,60,0.4)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            Nossos Serviços
                        </Link>
                        <Link
                            href="#contato"
                            style={{ padding: '1.25rem 2.5rem', fontSize: '1.125rem', fontWeight: 600, borderRadius: '9999px', border: '2px solid white', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            Solicitar Proposta
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
