
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterProfessional: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loadingCep, setLoadingCep] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    pixKey: '',
    pixKeyType: 'CPF' as 'CPF' | 'EMAIL' | 'PHONE' | 'EVP',
    documentos: {
      fotoCpf: null as File | null,
      comprovanteEndereco: null as File | null,
      antecedentes: null as File | null
    },
    endereco: {
      cep: '',
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      lat: null as number | null,
      lng: null as number | null
    }
  });

  const handleCepSearch = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      setLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            endereco: { ...prev.endereco, rua: data.logradouro, bairro: data.bairro, cidade: data.localidade, cep: cleanCep }
          }));
        } else {
          alert("CEP INVÁLIDO.");
        }
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof formData.documentos) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        documentos: { ...prev.documentos, [field]: e.target.files![0] }
      }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-[48px] shadow-2xl overflow-hidden">
        <div className="bg-slate-900 p-12 text-white">
          <h1 className="text-4xl font-black mb-2 tracking-tight">Cadastro Profissional</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Passo {step} de 4</p>
          <div className="mt-6 flex gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${step >= i ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
            ))}
          </div>
        </div>

        <div className="p-10 md:p-14">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-2xl font-black text-slate-900">1. Informações Pessoais</h2>
              <div className="grid md:grid-cols-2 gap-6">
                 <input placeholder="Nome Completo" className="md:col-span-2 w-full bg-slate-50 p-5 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-500" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} />
                 <input placeholder="CPF" className="w-full bg-slate-50 p-5 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-500" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} />
                 <input placeholder="WhatsApp" className="w-full bg-slate-50 p-5 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-500" value={formData.telefone} onChange={e => setFormData({...formData, telefone: e.target.value})} />
              </div>
              <button onClick={() => setStep(2)} className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-xl shadow-xl hover:bg-blue-700 transition-all">Próximo</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-2xl font-black text-slate-900">2. Localização</h2>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Digite seu CEP</label>
                <div className="relative">
                  <input 
                    placeholder="00000-000" 
                    className="w-full bg-slate-100 p-6 rounded-3xl font-black text-3xl outline-none focus:ring-4 focus:ring-blue-500/20" 
                    value={formData.endereco.cep} 
                    onChange={e => {
                       setFormData({...formData, endereco: {...formData.endereco, cep: e.target.value}});
                       if (e.target.value.length === 8) handleCepSearch(e.target.value);
                    }} 
                  />
                  {loadingCep && <div className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <input readOnly placeholder="Rua" className="col-span-3 bg-slate-50 p-4 rounded-xl font-bold text-slate-500" value={formData.endereco.rua} />
                <input placeholder="Nº" className="bg-white border-2 border-blue-100 p-4 rounded-xl font-bold outline-none focus:border-blue-500" value={formData.endereco.numero} onChange={e => setFormData({...formData, endereco: {...formData.endereco, numero: e.target.value}})} />
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 bg-slate-100 py-6 rounded-3xl font-bold text-slate-400 uppercase text-xs">Voltar</button>
                <button onClick={() => setStep(3)} className="flex-[2] bg-slate-900 text-white py-6 rounded-3xl font-black text-xl">Próximo: Documentos</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
               <div className="text-center space-y-4 mb-8">
                  <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-sm">🛡️</div>
                  <h2 className="text-3xl font-black text-slate-900">Segurança do Profissional</h2>
                  <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">Para sua proteção e de nossos clientes, precisamos validar sua documentação básica.</p>
               </div>

               <div className="grid gap-6">
                  {/* CPF Upload */}
                  <div className="relative">
                    <input type="file" id="cpf-upload" className="hidden" onChange={(e) => handleFileUpload(e, 'fotoCpf')} accept="image/*,.pdf" />
                    <label htmlFor="cpf-upload" className={`flex items-center justify-between p-6 rounded-[24px] border-2 border-dashed cursor-pointer transition-all ${formData.documentos.fotoCpf ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200 hover:border-blue-300'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm ${formData.documentos.fotoCpf ? 'bg-green-500 text-white' : 'bg-white text-slate-400'}`}>
                          {formData.documentos.fotoCpf ? '✓' : '🪪'}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm">Documento de Identidade (CPF/RG)</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {formData.documentos.fotoCpf ? formData.documentos.fotoCpf.name : 'Clique para selecionar arquivo'}
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Endereço Upload */}
                  <div className="relative">
                    <input type="file" id="address-upload" className="hidden" onChange={(e) => handleFileUpload(e, 'comprovanteEndereco')} accept="image/*,.pdf" />
                    <label htmlFor="address-upload" className={`flex items-center justify-between p-6 rounded-[24px] border-2 border-dashed cursor-pointer transition-all ${formData.documentos.comprovanteEndereco ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200 hover:border-blue-300'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm ${formData.documentos.comprovanteEndereco ? 'bg-green-500 text-white' : 'bg-white text-slate-400'}`}>
                          {formData.documentos.comprovanteEndereco ? '✓' : '🏠'}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm">Comprovante de Endereço</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {formData.documentos.comprovanteEndereco ? formData.documentos.comprovanteEndereco.name : 'Contas recentes (Água/Luz)'}
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Antecedentes Upload */}
                  <div className="relative">
                    <input type="file" id="background-upload" className="hidden" onChange={(e) => handleFileUpload(e, 'antecedentes')} accept="image/*,.pdf" />
                    <label htmlFor="background-upload" className={`flex items-center justify-between p-6 rounded-[24px] border-2 border-dashed cursor-pointer transition-all ${formData.documentos.antecedentes ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200 hover:border-blue-300'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm ${formData.documentos.antecedentes ? 'bg-green-500 text-white' : 'bg-white text-slate-400'}`}>
                          {formData.documentos.antecedentes ? '✓' : '📋'}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm">Antecedentes Criminais</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {formData.documentos.antecedentes ? formData.documentos.antecedentes.name : 'Certidão de antecedentes'}
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
               </div>

               <div className="flex gap-4">
                  <button onClick={() => setStep(2)} className="flex-1 bg-slate-100 py-6 rounded-3xl font-bold text-slate-400 uppercase text-xs">Voltar</button>
                  <button 
                    onClick={() => {
                      if(!formData.documentos.fotoCpf || !formData.documentos.comprovanteEndereco || !formData.documentos.antecedentes) {
                        return alert("Por favor, selecione todos os documentos obrigatórios.");
                      }
                      setStep(4);
                    }} 
                    className="flex-[2] bg-slate-900 text-white py-6 rounded-3xl font-black text-xl shadow-xl hover:bg-blue-600 transition-all"
                  >
                    Próximo: Pagamentos
                  </button>
               </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
               <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-sm">💸</div>
                  <h2 className="text-3xl font-black text-slate-900">Onde você quer receber?</h2>
                  <p className="text-slate-500 font-medium max-w-sm mx-auto">Não precisa criar conta. O valor da faxina cai direto no seu banco via PIX.</p>
               </div>

               <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                     {['CPF', 'EMAIL', 'PHONE', 'EVP'].map(type => (
                        <button 
                          key={type}
                          onClick={() => setFormData({...formData, pixKeyType: type as any})}
                          className={`py-4 rounded-2xl font-black text-[10px] tracking-widest border-2 transition-all ${formData.pixKeyType === type ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200'}`}
                        >
                          {type === 'PHONE' ? 'CELULAR' : type === 'EVP' ? 'ALEATÓRIA' : type}
                        </button>
                     ))}
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Sua Chave PIX</label>
                     <input 
                        type="text"
                        placeholder={formData.pixKeyType === 'CPF' ? '000.000.000-00' : 'Sua chave aqui...'}
                        className="w-full bg-slate-50 p-6 rounded-3xl border-none font-black text-2xl focus:ring-4 focus:ring-blue-500/20 outline-none"
                        value={formData.pixKey}
                        onChange={e => setFormData({...formData, pixKey: e.target.value})}
                     />
                  </div>
                  
                  <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex gap-4 items-center">
                     <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl">🛡️</div>
                     <p className="text-[10px] text-blue-700 font-bold leading-relaxed uppercase tracking-tight">
                        Seus dados estão protegidos. O saque será realizado automaticamente sempre que um serviço for concluído.
                     </p>
                  </div>
               </div>

               <div className="flex gap-4">
                  <button onClick={() => setStep(3)} className="flex-1 bg-slate-100 py-6 rounded-3xl font-bold text-slate-400 uppercase text-xs">Voltar</button>
                  <button onClick={() => { alert("Cadastro Finalizado! Bem-vindo(a). Seus documentos serão analisados em até 24h."); navigate('/painel'); }} className="flex-[2] bg-green-600 text-white py-6 rounded-3xl font-black text-xl shadow-xl shadow-green-100 hover:bg-green-700 transition-all">Finalizar Cadastro</button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterProfessional;
