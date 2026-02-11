
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Diarista } from '../types';

// Estrutura completa de serviços solicitada
const ESTRUTURA_COMPLETA = [
  {
    id: "cat_limp",
    categoria: "LIMPEZA E HIGIENIZAÇÃO",
    subcategorias: [
      {
        id: "sub_res",
        nome: "Limpeza Residencial",
        funcoes: [
          { id: "fax_pad", nome: "Faxina Padrão" },
          { id: "fax_pes", nome: "Faxina Pesada" },
          { id: "limp_mud", nome: "Limpeza Pré/Pós Mudança" },
          { id: "limp_pos_obra", nome: "Limpeza Pós-Obra" }
        ]
      },
      {
        id: "sub_com",
        nome: "Comercial & Corporativa",
        funcoes: [
          { id: "limp_escri", nome: "Limpeza de Escritórios" },
          { id: "limp_cond", nome: "Limpeza de Condomínios" }
        ]
      }
    ]
  },
  {
    id: "cat_marido",
    categoria: "MARIDO DE ALUGUEL",
    subcategorias: [
      {
        id: "sub_ele",
        nome: "Elétrica Rápida",
        funcoes: [
          { id: "troca_chuveiro", nome: "Troca de Chuveiros" },
          { id: "inst_tomada", nome: "Instalação de Tomadas" }
        ]
      },
      {
        id: "sub_hid",
        nome: "Hidráulica Rápida",
        funcoes: [
          { id: "troca_torneira", nome: "Troca de Torneiras" },
          { id: "desentupimento", nome: "Desentupimento Simples" }
        ]
      }
    ]
  }
];

// Mock atualizado com dados de verificação e localização
const MOCK_PROS: Diarista[] = [
  {
    id: '1', nome: 'Maria Silva', email: 'maria@ex.com', cpf: '1', telefone: '1', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    nota: 4.9, avaliacoes: 42, taxaCancelamento: 0, precoBase: 35, especialidades: ['fax_pad'], 
    restricoes: '', bio: 'Especialista em limpeza detalhada residencial.', bairro: 'Pinheiros', cidade: 'São Paulo', estado: 'SP',
    cep: '05409-000', numero: '100', tipoPreco: 'hora', lat: -23.5615, lng: -46.6917,
    disponibilidade: [{ dia: 1, turnos: ['manha', 'tarde'], blocosHoras: [4] }],
    statusAprovacao: 'aprovado', termoAceite: true, docValidado: true, antecedentesValidado: true, residenciaValidado: true, fotoValidada: true
  },
  {
    id: '2', nome: 'Felipe Reparos', email: 'felipe@ex.com', cpf: '2', telefone: '2', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    nota: 4.7, avaliacoes: 15, taxaCancelamento: 1, precoBase: 120, especialidades: ['troca_chuveiro'],
    restricoes: '', bio: 'Técnico em elétrica e pequenos reparos.', bairro: 'Vila Madalena', cidade: 'São Paulo', estado: 'SP',
    cep: '05443-000', numero: '20', tipoPreco: 'servico', lat: -23.5535, lng: -46.6897,
    disponibilidade: [{ dia: 1, turnos: ['manha'], blocosHoras: [4] }],
    statusAprovacao: 'aprovado', termoAceite: true, docValidado: true, antecedentesValidado: false, residenciaValidado: true, fotoValidada: true
  }
];

const SearchResults: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [selectedFunc, setSelectedFunc] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number, cidade: string} | null>(null);
  const [filteredPros, setFilteredPros] = useState<any[]>([]);

  // Captura localização e cidade do usuário
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(pos => {
      // Mock de cidade - em prod usaria Reverse Geocoding API
      setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, cidade: 'São Paulo' });
    }, () => {
      alert("Precisamos do seu GPS para mostrar profissionais na sua cidade.");
      navigate('/');
    });
  }, []);

  const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const executeFilter = () => {
    if (!userLocation) return;
    
    const results = MOCK_PROS
      .filter(p => p.statusAprovacao === 'aprovado')
      .filter(p => p.cidade === userLocation.cidade) // Regra: Somente mesmo município
      .filter(p => p.especialidades.includes(selectedFunc!))
      .map(p => ({
        ...p,
        distance: haversineDistance(userLocation.lat, userLocation.lng, p.lat, p.lng),
        isVerified: p.docValidado && p.antecedentesValidado && p.residenciaValidado && p.fotoValidada
      }))
      .sort((a, b) => a.distance - b.distance); // Regra: Ordenação por proximidade crescente

    setFilteredPros(results);
    setStep(5);
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 min-h-screen">
      {/* Etapa 1: Categoria */}
      {step === 1 && (
        <div className="space-y-12 animate-in fade-in">
          <div className="text-center">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">O que você precisa hoje?</h1>
            <p className="text-slate-400 mt-2 font-bold uppercase text-[10px] tracking-widest">Selecione uma categoria principal</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {ESTRUTURA_COMPLETA.map(cat => (
              <button key={cat.id} onClick={() => { setSelectedCat(cat.id); setStep(2); }} className="p-10 bg-white border-2 border-slate-100 rounded-[40px] hover:border-blue-500 transition-all flex items-center justify-between group shadow-sm hover:shadow-xl">
                <span className="text-2xl font-black text-slate-800">{cat.categoria}</span>
                <span className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl group-hover:bg-blue-600 group-hover:text-white transition-all">→</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Etapa 2: Subcategoria */}
      {step === 2 && (
        <div className="space-y-12 animate-in fade-in">
          <button onClick={() => setStep(1)} className="text-blue-600 font-black text-xs uppercase tracking-widest">← Voltar</button>
          <div className="text-center">
            <h2 className="text-3xl font-black text-slate-900">Qual a área de serviço?</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {ESTRUTURA_COMPLETA.find(c => c.id === selectedCat)?.subcategorias.map(sub => (
              <button key={sub.id} onClick={() => { setSelectedSub(sub.id); setStep(3); }} className="p-8 bg-white border border-slate-100 rounded-3xl font-black text-slate-700 hover:bg-blue-50 hover:border-blue-500 transition-all text-left flex justify-between items-center">
                {sub.nome}
                <span className="text-blue-200">→</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Etapa 3: Função específica */}
      {step === 3 && (
        <div className="space-y-12 animate-in fade-in">
          <button onClick={() => setStep(2)} className="text-blue-600 font-black text-xs uppercase tracking-widest">← Voltar</button>
          <div className="text-center">
            <h2 className="text-3xl font-black text-slate-900">Selecione o serviço exato</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {ESTRUTURA_COMPLETA.find(c => c.id === selectedCat)?.subcategorias.find(s => s.id === selectedSub)?.funcoes.map(f => (
              <button key={f.id} onClick={() => { setSelectedFunc(f.id); setStep(4); }} className="p-8 bg-white border border-slate-100 rounded-3xl font-black text-slate-700 hover:bg-blue-600 hover:text-white transition-all text-left">
                {f.nome}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Etapa 4: Data (Mínimo D+1) */}
      {step === 4 && (
        <div className="max-w-md mx-auto space-y-10 animate-in zoom-in-95">
          <button onClick={() => setStep(3)} className="text-blue-600 font-black text-xs uppercase tracking-widest">← Voltar</button>
          <div className="text-center">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Escolha a Data</h2>
            <p className="text-slate-400 mt-2 font-medium">Não permitimos agendamentos para o mesmo dia.</p>
          </div>
          <div className="space-y-4">
             <input 
                type="date" 
                min={minDate} 
                className="w-full bg-slate-50 border-2 border-slate-100 p-8 rounded-3xl font-black text-2xl outline-none focus:border-blue-500 transition-all" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <button 
                disabled={!selectedDate}
                onClick={executeFilter}
                className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xl disabled:opacity-30 shadow-2xl hover:bg-blue-600 transition-all"
              >
                Buscar em {userLocation?.cidade}
              </button>
          </div>
        </div>
      )}

      {/* Etapa 5: Resultados Ordenados por Distância */}
      {step === 5 && (
        <div className="space-y-12 animate-in fade-in duration-500">
          <header className="flex flex-col md:flex-row justify-between items-end gap-6">
             <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Profissionais Disponíveis</h1>
                <div className="flex items-center gap-2 mt-2">
                   <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                   <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Filtrado por Proximidade em {userLocation?.cidade}</p>
                </div>
             </div>
             <button onClick={() => setStep(1)} className="bg-slate-100 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all">REFRESH BUSCA</button>
          </header>

          <div className="grid lg:grid-cols-2 gap-10">
            {filteredPros.map(p => (
              <div key={p.id} className="bg-white border border-slate-100 rounded-[56px] overflow-hidden shadow-xl hover:shadow-2xl transition-all flex flex-col md:flex-row group">
                {/* Lado Esquerdo: Foto e Distância */}
                <div className="md:w-72 h-72 md:h-auto relative">
                  <img src={p.avatar} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl font-black text-xs shadow-lg">⭐ {p.nota}</div>
                  <div className="absolute bottom-6 left-6 bg-blue-600 text-white px-4 py-2 rounded-2xl font-black text-xs shadow-lg">
                    {p.distance.toFixed(1)} km
                  </div>
                </div>
                
                {/* Lado Direito: Info e Selos */}
                <div className="flex-grow p-10 space-y-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl font-black text-slate-900 leading-none">{p.nome}</h3>
                    </div>

                    {/* Selo de Verificação Master */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.isVerified ? (
                        <div className="bg-green-100 text-green-700 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] border border-green-200">
                          🟢 Profissional Verificado
                        </div>
                      ) : (
                        <div className="bg-amber-50 text-amber-700 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] border border-amber-100">
                          🟡 Em Processo de Validação
                        </div>
                      )}
                    </div>

                    {/* Selos Individuais */}
                    <div className="flex gap-2 mt-4">
                       <span title="Documento Validado" className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs border ${p.docValidado ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>🆔</span>
                       <span title="Antecedentes OK" className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs border ${p.antecedentesValidado ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>⚖️</span>
                       <span title="Residência Confirmada" className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs border ${p.residenciaValidado ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>🏠</span>
                       <span title="Foto Real" className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs border ${p.fotoValidada ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>📸</span>
                    </div>
                    
                    <p className="text-slate-500 text-sm mt-6 font-medium leading-relaxed italic">"{p.bio}"</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-50 pt-8">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor Repasse</p>
                      <p className="text-3xl font-black text-slate-900 tracking-tighter">
                        R$ {p.precoBase}
                        <span className="text-xs text-slate-400 font-bold ml-1 tracking-normal">/{p.tipoPreco === 'hora' ? 'h' : 'serv'}</span>
                      </p>
                    </div>
                    <button 
                      onClick={() => navigate('/cadastro-cliente')} 
                      className="bg-slate-900 text-white px-10 py-5 rounded-[24px] font-black text-sm uppercase tracking-widest hover:bg-blue-600 shadow-2xl transition-all"
                    >
                      AGENDAR
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPros.length === 0 && (
            <div className="text-center py-32 bg-slate-50 rounded-[64px] border-4 border-dashed border-slate-200">
               <div className="text-6xl mb-6">🏜️</div>
               <h3 className="text-2xl font-black text-slate-900">Nenhum profissional disponível</h3>
               <p className="text-slate-400 mt-2 font-medium">Não encontramos parceiros ativos para este serviço nesta data em {userLocation?.cidade}.</p>
               <button onClick={() => setStep(1)} className="mt-8 bg-white border-2 border-slate-200 px-8 py-4 rounded-2xl font-black text-xs uppercase hover:border-blue-500 transition-all">Tentar Outra Categoria</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
