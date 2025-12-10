
import React from 'react';
import { AppLogo } from './Icons';

interface LoginScreenProps {
    onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gray-900 text-white font-sans">
             {/* Background Image */}
            <div 
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1526655747683-4a1e944f2487?q=80&w=2070&auto=format&fit=crop')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Overlay with blur for readability */}
                <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center p-6 w-full max-w-md animate-fade-in">
                <div className="mb-6 animate-slide-up-slow">
                    <AppLogo size={140} />
                </div>
                
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-white drop-shadow-xl animate-slide-up-slow" style={{ animationDelay: '100ms' }}>
                    Meu Combustível
                </h1>
                
                <p className="text-lg text-gray-300 mb-10 drop-shadow-md animate-slide-up-slow" style={{ animationDelay: '200ms' }}>
                    Seu assistente inteligente para controle de gastos e manutenção veicular. <span className="text-green-400 font-semibold">Inteligente. Rápido. Eficiente.</span>
                </p>

                <button
                    onClick={onLogin}
                    className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-green-900/40 hover:shadow-green-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 animate-slide-up-slow"
                    style={{ animationDelay: '300ms' }}
                >
                    Acessar Painel >
                </button>

                <div className="mt-16 text-center text-gray-500 text-xs animate-slide-up-slow" style={{ animationDelay: '400ms' }}>
                    <p>Desenvolvido por André Brito</p>
                    <p>Versão 2.0 • 2025</p>
                </div>
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.8s ease-out forwards;
                }

                @keyframes slide-up-slow {
                    from {
                        transform: translateY(30px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                .animate-slide-up-slow {
                    animation: slide-up-slow 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    opacity: 0;
                }
            `}</style>
        </div>
    );
};
