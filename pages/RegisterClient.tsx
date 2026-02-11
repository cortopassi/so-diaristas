
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterClient: React.FC = () => {
  const [step, setStep] = useState(1);
  const [locationLoading, setLocationLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
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
      referencia: '',
      lat: null as number | null,
      lng: null as number | null
    }
  });

  const handleCepSearch = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      setCepLoading(true);
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
              cep: cleanCep
            }
          }));
        } else {
          alert("CEP não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar CEP", error);
      } finally {
        setCepLoading(false);
      }
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.nome || !formData.cpf || !formData.email || !formData.telefone || !formData.dataNascimento) {
        alert("Todos os campos de dados pessoais são obrigatórios.");
        return;
      }
    }
    setStep(step + 1);
  };
  
  const handleBack = () => setStep(step - 1);

  const detectAddressLocation = () => {
    setLocationLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          endereco: {
            ...prev.endereco,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        }));
        setLocationLoading(false);
      }, (err) => {
        console.error(err);
        setLocationLoading(false);
        alert("Para sua segurança e precisão do serviço, o acesso ao GPS é obrigatório.");
      });
    } else {
      alert("Geolocalização não suportada no seu navegador.");
      setLocationLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.endereco.rua || !formData.endereco.numero || !formData.endereco.bairro || !formData.endereco.referencia) {
      alert("Todos os campos de endereço são obrigatórios.");
      return;
    }
    if (!formData.endereco.lat) {
      alert("É obrigatório fixar a localização exata pelo GPS antes de concluir.");
      return;
    }
    alert("Cadastro de cliente realizado com sucesso!");
    navigate('/painel');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-10 text-white">
            <h1 className="text-3xl font-black mb-2">Crie sua conta</h1>
            <p className="text-blue-100 opacity-80">Rápido, seguro e obrigatório para sua primeira faxina.</p>
            <div className="mt-8 flex items-center gap-4">
              {[1, 2].map(i => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-all ${
                    step === i ? 'bg-white text-blue-600 scale-110 shadow-lg' : 'bg-blue-400/30 text-blue-100'
                  }`}>
                    {i}
                  </div>
                  {i < 2 && <div className="w-12 h-1 bg-blue-400/30 rounded-full"></div>}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-5 duration-500">
                <div className="flex justify-between items-center border-b pb-4">
                  <h2 className="text-xl font-bold text-gray-900">Dados Pessoais</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nome Completo</label>
                    <input required type="text" className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl font-medium" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">CPF</label>
                    <input required type="text" placeholder="000.000.000-00" className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl font-medium" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">E-mail</label>
                    <input required type="email" className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl font-medium" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">WhatsApp</label>
                    <input required type="tel" placeholder="(00) 00000-0000" className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl font-medium" value={formData.telefone} onChange={e => setFormData({...formData, telefone: e.target.value})} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Data de Nascimento</label>
                    <input required type="date" className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl font-medium" value={formData.dataNascimento} onChange={e => setFormData({...formData, dataNascimento: e.target.value})} />
                  </div>
                </div>
                <button type="button" onClick={handleNext} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 group">
                  Próximo: Endereço
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-5 duration-500">
                <div className="flex justify-between items-center border-b pb-4">
                  <h2 className="text-xl font-bold text-gray-900">Local da Limpeza</h2>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-black text-blue-600 uppercase tracking-widest">Digite seu CEP</label>
                   <div className="relative">
                      <input 
                        required 
                        type="text" 
                        placeholder="00000-000"
                        className="w-full bg-blue-50 border-2 border-blue-100 p-5 rounded-3xl font-black text-2xl outline-none focus:border-blue-500" 
                        value={formData.endereco.cep} 
                        onChange={e => {
                          const val = e.target.value;
                          setFormData({...formData, endereco: {...formData.endereco, cep: val}});
                          if (val.replace(/\D/g, '').length === 8) handleCepSearch(val);
                        }}
                      />
                      {cepLoading && <div className="absolute right-6 top-1/2 -translate-y-1/2 animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full"></div>}
                   </div>
                </div>
                
                <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 transition-opacity ${cepLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                  <div className="md:col-span-3 space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rua / Avenida</label>
                    <input required type="text" className="w-full bg-gray-50 border-none p-4 rounded-2xl font-medium" value={formData.endereco.rua} onChange={e => setFormData({...formData, endereco: {...formData.endereco, rua: e.target.value}})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nº</label>
                    <input required type="text" className="w-full bg-gray-50 border-none p-4 rounded-2xl font-medium" value={formData.endereco.numero} onChange={e => setFormData({...formData, endereco: {...formData.endereco, numero: e.target.value}})} />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Apto / Bloco</label>
                    <input type="text" className="w-full bg-gray-50 border-none p-4 rounded-2xl font-medium" value={formData.endereco.complemento} onChange={e => setFormData({...formData, endereco: {...formData.endereco, complemento: e.target.value}})} />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bairro</label>
                    <input required type="text" className="w-full bg-gray-50 border-none p-4 rounded-2xl font-medium" value={formData.endereco.bairro} onChange={e => setFormData({...formData, endereco: {...formData.endereco, bairro: e.target.value}})} />
                  </div>
                  <div className="md:col-span-4 space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ponto de Referência</label>
                    <textarea required className="w-full bg-gray-50 border-none p-4 rounded-2xl font-medium h-24 resize-none" value={formData.endereco.referencia} onChange={e => setFormData({...formData, endereco: {...formData.endereco, referencia: e.target.value}})} />
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-[32px] border-2 border-dashed border-blue-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-blue-900 text-sm">GPS do Imóvel</h4>
                      <p className="text-xs text-blue-600">Obrigatório para segurança.</p>
                    </div>
                    <button type="button" onClick={detectAddressLocation} className="bg-white text-blue-600 px-4 py-2 rounded-xl text-xs font-black shadow-sm flex items-center gap-2">
                      {locationLoading ? 'Buscando...' : formData.endereco.lat ? 'Localização OK!' : 'Fixar GPS'}
                    </button>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={handleBack} className="flex-1 bg-gray-100 text-gray-600 py-5 rounded-2xl font-bold">Voltar</button>
                  <button type="submit" className="flex-[2] bg-blue-600 text-white py-5 rounded-2xl font-bold shadow-xl">Concluir</button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterClient;
