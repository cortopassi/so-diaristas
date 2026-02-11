
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [role, setRole] = useState<'profissional' | 'cliente'>('cliente');
  const [step, setStep] = useState(1);
  const [cpf, setCpf] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (cpf.length < 11) return alert("Digite um CPF válido");
    setLoading(true);
    // Simulação de envio de código por 1.5 segundos
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 4) return alert("Digite o código de 4 dígitos");
    // Em produção, aqui validaria o código no backend
    alert("Acesso autorizado!");
    navigate('/painel');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[48px] shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-10 text-white text-center">
          <h1 className="text-3xl font-black mb-2">Acesso Rápido</h1>
          <p className="text-slate-400 font-medium">Sem senhas. Use apenas seu CPF.</p>
        </div>

        <div className="p-10 space-y-8">
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <button 
              onClick={() => {setRole('cliente'); setStep(1);}}
              className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase transition-all ${role === 'cliente' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
            >
              Sou Cliente
            </button>
            <button 
              onClick={() => {setRole('profissional'); setStep(1);}}
              className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase transition-all ${role === 'profissional' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
            >
              Sou Profissional
            </button>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSendCode} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Digite seu CPF</label>
                <input 
                  required
                  type="text"
                  placeholder="000.000.000-00"
                  className="w-full bg-slate-50 p-6 rounded-3xl border-none font-black text-2xl focus:ring-4 focus:ring-blue-500/20 outline-none"
                  value={cpf}
                  onChange={e => setCpf(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-lg shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : "Receber Código de Acesso"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="text-center">
                <p className="text-sm font-medium text-slate-500 mb-6">Enviamos um código de acesso para o seu WhatsApp cadastrado.</p>
                <div className="flex gap-4 justify-center">
                  <input 
                    required
                    type="text"
                    maxLength={4}
                    placeholder="0000"
                    className="w-48 bg-slate-900 text-white p-6 rounded-3xl font-black text-4xl text-center tracking-[0.5em] focus:ring-4 focus:ring-blue-500/50 outline-none"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-lg shadow-xl hover:bg-blue-600 transition-all"
              >
                Entrar no Sistema
              </button>
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-blue-600 font-black text-xs uppercase"
              >
                Corrigir CPF
              </button>
            </form>
          )}

          <div className="pt-6 border-t border-slate-50 text-center">
            <p className="text-xs text-slate-400 font-medium">
              Não tem conta? 
              <button onClick={() => navigate(role === 'cliente' ? '/cadastro-cliente' : '/cadastro-profissional')} className="text-blue-600 font-bold ml-1">Cadastre-se agora</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
