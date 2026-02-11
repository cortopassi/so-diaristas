
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSmartEstimate } from '../services/geminiService';
import { EstimateResponse } from '../types';

const Home: React.FC = () => {
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState<EstimateResponse | null>(null);
  const navigate = useNavigate();

  const handleEstimate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details) return;
    setLoading(true);
    try {
      const res = await getSmartEstimate(details);
      setEstimate(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleContratarComEstimativa = () => {
    navigate(`/busca?horas=${estimate?.tempoEstimado}`);
  };

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 flex items-center justify-center">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-orange-100/50 blob-bg -z-10 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-left">
            <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              Do jardim ao telhado, cuidamos de tudo
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1]">
              O cuidado que seu imóvel <span className="text-blue-600 underline decoration-amber-300 underline-offset-8">merece.</span>
            </h1>
            <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-xl">
              Nossa plataforma inteligente planeja desde a faxina diária até a limpeza de calhas e escritórios, com especialistas verificados para cada tarefa.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <a href="#estimativa" className="bg-slate-900 text-white px-8 py-5 rounded-[24px] text-lg font-bold hover:bg-blue-600 shadow-xl transition-all flex items-center justify-center gap-2 group">
                Simular Orçamento de Manutenção
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </a>
              <button 
                onClick={() => navigate('/busca')}
                className="bg-white border-2 border-slate-100 text-slate-700 px-8 py-5 rounded-[24px] text-lg font-bold hover:border-blue-600 hover:text-blue-600 transition-all"
              >
                Conhecer Especialistas
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative z-10 rounded-[48px] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
               <img 
                 src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800" 
                 alt="Cuidado com a casa e manutenção" 
                 className="w-full h-[500px] object-cover"
               />
            </div>
          </div>
        </div>
      </section>

      {/* AI Estimator Section */}
      <section id="estimativa" className="max-w-7xl mx-auto px-6 scroll-mt-24">
        <div className="bg-white rounded-[48px] shadow-2xl overflow-hidden border border-slate-100">
          <div className="grid lg:grid-cols-5 items-stretch">
            <div className="lg:col-span-2 p-10 lg:p-16 bg-gradient-to-br from-amber-50 to-white border-r border-slate-50">
              <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">O que precisa ser feito?</h2>
              <p className="text-slate-500 mb-10 leading-relaxed text-lg">
                Descreva sua necessidade: faxina pesada, manutenção de jardim, limpeza de calhas ou até a organização do seu escritório.
              </p>
              
              <form onSubmit={handleEstimate} className="space-y-6">
                <textarea
                  className="w-full h-56 p-8 rounded-[32px] border-2 border-slate-100 focus:border-amber-400 outline-none transition-all text-slate-700 placeholder:text-slate-300 resize-none bg-white text-lg"
                  placeholder="Ex: 'Preciso de uma limpeza de calhas pois vai chover, e também lavar o portão da garagem que está com limo.'"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  disabled={loading}
                />
                
                <button
                  type="submit"
                  disabled={loading || !details}
                  className="w-full bg-slate-900 text-white py-6 rounded-[24px] font-bold hover:bg-amber-500 transition-all flex items-center justify-center gap-3 text-lg"
                >
                  {loading ? "Calculando Planejamento..." : "Analisar por IA"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-3 p-10 lg:p-16 flex flex-col justify-center bg-white relative">
              {estimate ? (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <div className="flex flex-col md:flex-row items-center gap-8 bg-blue-50/50 p-10 rounded-[40px] border border-blue-100">
                    <div className="text-center md:text-left relative z-10">
                      <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2">Estimativa de Tempo</p>
                      <div className="flex items-baseline gap-2">
                         <span className="text-6xl font-black text-slate-900">{estimate.tempoEstimado}</span>
                         <span className="text-2xl font-bold text-slate-400">horas</span>
                      </div>
                    </div>
                    <div className="hidden md:block w-[2px] h-20 bg-blue-100"></div>
                    <div className="text-center md:text-right relative z-10">
                      <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2">Valor Sugerido (Repasse)</p>
                      <p className="text-5xl font-black text-slate-900">R$ {estimate.valorSugerido.toFixed(0)}</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <h4 className="text-xl font-bold text-slate-900">Etapas do Serviço</h4>
                      <div className="space-y-4">
                        {estimate.recomendacoes.map((rec, i) => (
                          <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="w-6 h-6 bg-white rounded-full border-2 border-amber-400 flex items-center justify-center text-[10px] font-bold text-amber-600">{i + 1}</div>
                            <span className="text-slate-600 font-medium text-sm">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-xl font-bold text-slate-900">Análise do Especialista</h4>
                      <div className="p-6 bg-purple-50 rounded-[32px] border border-purple-100">
                        <p className="text-slate-700 leading-relaxed italic font-medium">{estimate.explicacao}</p>
                      </div>
                      <button 
                        onClick={handleContratarComEstimativa}
                        className="w-full bg-blue-600 text-white py-5 rounded-[24px] font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-3 text-lg"
                      >
                        Encontrar Especialista Agora
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-8 py-20">
                  <div className="w-32 h-32 bg-blue-50 rounded-[40px] mx-auto flex items-center justify-center animate-pulse">
                     <span className="text-4xl">🏗️</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Nossa IA está pronta para planejar.</h3>
                  <p className="text-slate-400 max-w-sm mx-auto">Descreva seu serviço comercial ou residencial para obter uma estimativa de tempo e custo imediata.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
