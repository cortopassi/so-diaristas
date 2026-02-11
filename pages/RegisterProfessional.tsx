
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ESTRUTURA_SERVICOS = [
  {
    categoria: "LIMPEZA E HIGIENIZAÇÃO",
    icon: "🧹",
    subcategorias: [
      {
        nome: "Limpeza Residencial",
        funcoes: [
          { id: "fax_pad", nome: "Faxina Padrão", desc: "Manutenção e dia a dia" },
          { id: "fax_pes", nome: "Faxina Pesada", desc: "Limpeza profunda e remoção de gordura" },
          { id: "limp_mud", nome: "Limpeza Pré/Pós Mudança", desc: "Imóvel vazio e higienização total" },
          { id: "limp_pos_obra", nome: "Limpeza Pós-Obra", desc: "Remoção de resíduos finos e poeira" }
        ]
      }
    ]
  },
  {
    categoria: "MARIDO DE ALUGUEL",
    icon: "🔧",
    subcategorias: [
      {
        nome: "Elétrica Rápida",
        funcoes: [
          { id: "troca_chuveiro", nome: "Troca de Chuveiros", desc: "Substituição de aparelhos e resistências" },
          { id: "inst_tomada", nome: "Tomadas e Interruptores", desc: "Instalação e reparos elétricos simples" }
        ]
      }
    ]
  }
];

const RegisterProfessional: React.FC = () => {
  const [step, setStep] = useState(1);
  const [activeCategory, setActiveCategory] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    personal: { nome: '', cpf: '', telefone: '', email: '' },
    address: { cep: '', rua: '', numero: '', bairro: '', cidade: '', estado: '', lat: null as number | null, lng: null as number | null },
    docs: { foto: null as File | null, rgFrente: null as File | null, rgVerso: null as File | null, comprovante: null as File | null, antecedentes: null as File | null },
    payment: { pixKeyType: 'CPF', pixKey: '' },
    terms: false,
    services: [] as string[],
    billing: { tipo: 'hora' as 'hora' | 'servico', valor: 0 },
    availability: [] as { dia: number, turnos: string[] }[]
  });

  const validateStep = (): boolean => {
    switch (step) {
      case 1:
        const { nome, cpf, telefone, email } = formData.personal;
        if (!nome || !cpf || !telefone || !email) {
          alert("Todos os dados pessoais são obrigatórios!");
          return false;
        }
        return true;
      case 2:
        if (!formData.address.cep || !formData.address.numero || !formData.address.lat) {
          alert("Endereço completo e Geolocalização (GPS) são obrigatórios!");
          return false;
        }
        return true;
      case 3:
        const { foto, rgFrente, rgVerso, comprovante, antecedentes } = formData.docs;
        if (!foto || !rgFrente || !rgVerso || !comprovante || !antecedentes) {
          alert("Todos os 5 documentos solicitados são obrigatórios!");
          return false;
        }
        return true;
      case 4:
        if (!formData.payment.pixKey) {
          alert("Dados bancários PIX são obrigatórios!");
          return false;
        }
        return true;
      case 5:
        if (!formData.terms) {
          alert("Você deve aceitar os termos!");
          return false;
        }
        return true;
      case 6:
        if (formData.services.length === 0) {
          alert("Selecione pelo menos um serviço!");
          return false;
        }
        return true;
      case 7:
        if (formData.billing.valor <= 0) {
          alert("Informe seu valor de repasse!");
          return false;
        }
        return true;
      case 8:
        if (formData.availability.length === 0) {
          alert("Defina sua agenda!");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleCepSearch = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      setLoading(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            address: { ...prev.address, rua: data.logradouro, bairro: data.bairro, cidade: data.localidade, estado: data.uf, cep: cleanCep }
          }));
        }
      } finally { setLoading(false); }
    }
  };

  const captureLocation = () => {
    if (!("geolocation" in navigator)) return alert("GPS não suportado.");
    setLoading(true);
    navigator.geolocation.getCurrentPosition(pos => {
      setFormData(prev => ({ ...prev, address: { ...prev.address, lat: pos.coords.latitude, lng: pos.coords.longitude } }));
      setLoading(false);
    }, () => { setLoading(false); alert("GPS Obrigatório para ativação do perfil."); });
  };

  const toggleService = (id: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(id) ? prev.services.filter(s => s !== id) : [...prev.services, id]
    }));
  };

  const toggleAvailability = (dia: number, turno: string) => {
    setFormData(prev => {
      const existing = prev.availability.find(a => a.dia === dia);
      if (existing) {
        const newTurnos = existing.turnos.includes(turno) ? existing.turnos.filter(t => t !== turno) : [...existing.turnos, turno];
        return { ...prev, availability: prev.availability.map(a => a.dia === dia ? { ...a, turnos: newTurnos } : a) };
      }
      return { ...prev, availability: [...prev.availability, { dia, turnos: [turno] }] };
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-[48px] shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-10 text-white flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Trabalhe Conosco</h1>
            <p className="text-blue-400 font-bold text-[10px] uppercase mt-1 tracking-widest">ETAPA {step} DE 9</p>
          </div>
          <div className="text-right">
             <span className="text-slate-500 font-black text-xs uppercase tracking-[0.2em]">Sem Senha</span>
          </div>
        </div>

        <div className="p-12">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-2xl font-black text-slate-900">1. Seus Dados <span className="text-red-500">*</span></h2>
              <div className="grid md:grid-cols-2 gap-5">
                <input required placeholder="Nome Completo" className="md:col-span-2 w-full bg-slate-50 p-6 rounded-3xl border-none font-bold" value={formData.personal.nome} onChange={e => setFormData({...formData, personal: {...formData.personal, nome: e.target.value}})} />
                <input required placeholder="CPF" className="w-full bg-slate-50 p-6 rounded-3xl border-none font-bold" value={formData.personal.cpf} onChange={e => setFormData({...formData, personal: {...formData.personal, cpf: e.target.value}})} />
                <input required placeholder="WhatsApp" className="w-full bg-slate-50 p-6 rounded-3xl border-none font-bold" value={formData.personal.telefone} onChange={e => setFormData({...formData, personal: {...formData.personal, telefone: e.target.value}})} />
              </div>
              <button onClick={handleNext} className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-xl shadow-xl">Continuar</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-2xl font-black text-slate-900">2. Endereço e GPS <span className="text-red-500">*</span></h2>
              <div className="flex gap-4">
                <input placeholder="CEP" className="flex-grow bg-slate-100 p-6 rounded-3xl font-black text-2xl" value={formData.address.cep} onChange={e => { setFormData({...formData, address: {...formData.address, cep: e.target.value}}); handleCepSearch(e.target.value); }} />
                <button onClick={captureLocation} className={`px-8 rounded-3xl font-black text-[10px] uppercase transition-all ${formData.address.lat ? 'bg-green-500 text-white shadow-lg' : 'bg-slate-900 text-white'}`}>
                  {formData.address.lat ? 'Localização Fixada ✓' : 'Ativar GPS *'}
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <input readOnly placeholder="Rua" className="col-span-3 bg-slate-50 p-5 rounded-2xl font-bold opacity-50" value={formData.address.rua} />
                <input required placeholder="Nº" className="bg-white border-2 border-blue-100 p-5 rounded-2xl font-bold" value={formData.address.numero} onChange={e => setFormData({...formData, address: {...formData.address, numero: e.target.value}})} />
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 bg-slate-100 py-6 rounded-3xl font-bold text-slate-400">Voltar</button>
                <button onClick={handleNext} className="flex-[2] bg-slate-900 text-white py-6 rounded-3xl font-black text-xl">Próximo</button>
              </div>
            </div>
          )}

          {/* Outras etapas omitidas para brevidade, mas seguem a mesma lógica de obrigatoriedade */}
          {step > 2 && step < 9 && (
            <div className="text-center py-20 animate-in fade-in">
               <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-4">Etapa em desenvolvimento</p>
               <div className="flex gap-4 max-w-sm mx-auto">
                 <button onClick={() => setStep(step - 1)} className="flex-1 bg-slate-100 py-4 rounded-2xl font-bold">Voltar</button>
                 <button onClick={handleNext} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black">Pular</button>
               </div>
            </div>
          )}

          {step === 9 && (
            <div className="text-center space-y-10 animate-in zoom-in">
               <div className="w-40 h-40 bg-green-50 text-green-600 rounded-[50px] mx-auto flex items-center justify-center text-7xl shadow-sm">🚀</div>
               <div className="space-y-3">
                  <h2 className="text-4xl font-black text-slate-900">Quase lá!</h2>
                  <p className="text-slate-500 font-medium">Seu perfil será revisado em até 24h por nossa equipe.</p>
               </div>
               <button onClick={() => navigate('/acesso')} className="w-full bg-slate-900 text-white py-8 rounded-[40px] font-black text-2xl shadow-2xl hover:bg-blue-600 transition-all">Enviar para Moderação</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterProfessional;
