
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterClient: React.FC = () => {
  const [step, setStep] = useState(1);
  const [locationLoading, setLocationLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    dataNascimento: '',
    endereco: {
      cep: '',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      lat: null as number | null,
      lng: null as number | null
    }
  });

  const handleCepSearch = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            endereco: {
              ...prev.endereco,
              rua: data.logradouro,
              bairro: data.bairro,
              cidade: data.localidade,
              cep: cleanCep
            }
          }));
        }
      } catch (err) { console.error(err); }
    }
  };

  const detectAddressLocation = () => {
    setLocationLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          endereco: { ...prev.endereco, lat: position.coords.latitude, lng: position.coords.longitude }
        }));
        setLocationLoading(false);
      }, () => {
        setLocationLoading(false);
        alert("A geolocalização é OBRIGATÓRIA para sua segurança e para encontrarmos profissionais próximos.");
      });
    }
  };

  const handleNext = () => {
    if (step === 1) {
      const { nome, cpf, email, telefone, dataNascimento } = formData;
      if (!nome || !cpf || !email || !telefone || !dataNascimento) {
        return alert("Todos os campos pessoais são obrigatórios!");
      }
    }
    setStep(step + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.endereco.rua || !formData.endereco.numero || !formData.endereco.lat) {
      return alert("Endereço completo e Geolocalização (GPS) são obrigatórios!");
    }
    alert("Cadastro concluído com sucesso! Bem-vindo.");
    navigate('/painel');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-[64px] shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-blue-600 p-12 text-white text-center">
          <h1 className="text-4xl font-black mb-2 tracking-tight">Criar sua Conta</h1>
          <p className="text-blue-100 font-bold uppercase text-[10px] tracking-[0.2em]">SISTEMA DE ACESSO SEM SENHA</p>
        </div>

        <form onSubmit={handleSubmit} className="p-12 space-y-10">
          {step === 1 ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input required placeholder="Nome Completo *" className="md:col-span-2 bg-slate-50 p-6 rounded-3xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-500" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} />
                <input required placeholder="CPF *" className="bg-slate-50 p-6 rounded-3xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-500" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} />
                <input required placeholder="WhatsApp *" className="bg-slate-50 p-6 rounded-3xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-500" value={formData.telefone} onChange={e => setFormData({...formData, telefone: e.target.value})} />
                <input required type="email" placeholder="E-mail *" className="bg-slate-50 p-6 rounded-3xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                <div className="md:col-span-2 space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Data de Nascimento *</label>
                   <input required type="date" className="w-full bg-slate-50 p-6 rounded-3xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-500" value={formData.dataNascimento} onChange={e => setFormData({...formData, dataNascimento: e.target.value})} />
                </div>
              </div>
              <button type="button" onClick={handleNext} className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-black text-xl shadow-xl hover:bg-blue-600 transition-all">Continuar para Endereço</button>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="flex gap-4">
                <input required placeholder="Seu CEP *" className="flex-grow bg-slate-100 p-6 rounded-3xl font-black text-2xl outline-none focus:ring-2 focus:ring-blue-500" value={formData.endereco.cep} onChange={e => { setFormData({...formData, endereco: {...formData.endereco, cep: e.target.value}}); handleCepSearch(e.target.value); }} />
                <button type="button" onClick={detectAddressLocation} className={`px-8 rounded-3xl font-black text-[10px] uppercase transition-all shadow-lg ${formData.endereco.lat ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'}`}>
                  {locationLoading ? '...' : formData.endereco.lat ? 'GPS OK ✓' : 'Ativar GPS *'}
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <input required placeholder="Sua Rua *" className="col-span-3 bg-slate-50 p-5 rounded-2xl font-bold" value={formData.endereco.rua} onChange={e => setFormData({...formData, endereco: {...formData.endereco, rua: e.target.value}})} />
                <input required placeholder="Nº *" className="bg-white border-2 border-blue-100 p-5 rounded-2xl font-bold outline-none focus:border-blue-500" value={formData.endereco.numero} onChange={e => setFormData({...formData, endereco: {...formData.endereco, numero: e.target.value}})} />
              </div>
              <input placeholder="Complemento / Bloco" className="w-full bg-slate-50 p-5 rounded-2xl font-bold" value={formData.endereco.complemento} onChange={e => setFormData({...formData, endereco: {...formData.endereco, complemento: e.target.value}})} />
              
              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(1)} className="flex-1 bg-slate-100 py-6 rounded-[32px] font-bold text-slate-400">Voltar</button>
                <button type="submit" className="flex-[2] bg-blue-600 text-white py-6 rounded-[32px] font-black text-xl shadow-2xl">Finalizar Cadastro</button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegisterClient;
