
import React, { useState } from 'react';
import { Diarista, Servico, CidadeExpansion } from '../types';

const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState<'aprovacoes' | 'pro_moderacao' | 'cli_moderacao' | 'expansao' | 'financeiro' | 'legado'>('aprovacoes');
  const [isMigrating, setIsMigrating] = useState(false);
  const [legacyEndpoint, setLegacyEndpoint] = useState('https://www.sodiaristas.net/api/v1/export-pros');
  const [migrationLogs, setMigrationLogs] = useState<string[]>([]);

  const [cidades, setCidades] = useState<CidadeExpansion[]>([
    { id: '1', nome: 'São Paulo', estado: 'SP', ativa: true, tentativasCadastro: 0 },
    { id: '2', nome: 'Campinas', estado: 'SP', ativa: true, tentativasCadastro: 0 },
  ]);

  const [prosInModeration, setProsInModeration] = useState<Diarista[]>([]);

  const handleMigrateLegacy = async () => {
    setIsMigrating(true);
    setMigrationLogs(["Iniciando conexão com sodiaristas.net...", "Autenticando via Alphaservers..."]);
    
    // Simulação de busca no banco antigo
    await new Promise(resolve => setTimeout(resolve, 2000));
    setMigrationLogs(prev => [...prev, "Conexão estabelecida.", "Mapeando 142 registros encontrados...", "Convertendo endereços para formato geolocalizado..."]);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const migratedPros: Diarista[] = [
      // Fixed: Change 'periodo' to 'servico', removed non-existent saldoDevedor, and added missing required properties.
      { 
        id: 'mig_1', 
        nome: 'Marta Souza (Legado)', 
        email: 'marta@old.com', 
        cpf: '222.333.444-55', 
        telefone: '11988776655', 
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200', 
        nota: 4.8, 
        avaliacoes: 120, 
        taxaCancelamento: 0, 
        precoBase: 180, 
        especialidades: ['limpeza_padrao'], 
        restricoes: 'Dados legados.', 
        bio: 'Migrada do sistema antigo.', 
        bairro: 'Pendente', 
        cidade: 'São Paulo', 
        estado: 'SP',
        cep: '00000-000',
        numero: 'SN',
        tipoPreco: 'servico', 
        statusAprovacao: 'pendente',
        disponibilidade: [],
        termoAceite: true,
        // Adding missing required properties for Diarista interface
        lat: -23.5505,
        lng: -46.6333,
        docValidado: false,
        antecedentesValidado: false,
        residenciaValidado: false,
        fotoValidada: false
      }
    ];

    setProsInModeration(prev => [...prev, ...migratedPros]);
    setMigrationLogs(prev => [...prev, "Migração concluída com sucesso!", "Registros injetados na fila de aprovação."]);
    setIsMigrating(false);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'admin123') setIsAuthenticated(true);
    else alert("Senha incorreta!");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-md p-12 rounded-[40px] shadow-2xl border border-slate-200 text-center">
          <div className="w-20 h-20 bg-slate-900 rounded-3xl mx-auto flex items-center justify-center text-white text-3xl mb-8">🔐</div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Painel Gestor</h1>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <input autoFocus type="password" placeholder="Senha" className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl text-center font-black focus:border-slate-900 outline-none" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} />
            <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm uppercase">Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      <aside className="w-72 bg-slate-50 border-r border-slate-100 p-8 flex flex-col gap-10 shrink-0 sticky top-0 h-screen">
        <div><h2 className="text-xl font-black text-slate-900 tracking-tighter">SD Console</h2><div className="w-8 h-1 bg-slate-900 mt-2"></div></div>
        <nav className="flex flex-col gap-1">
          <button onClick={() => setActiveTab('aprovacoes')} className={`p-4 rounded-xl font-bold text-sm text-left ${activeTab === 'aprovacoes' ? 'bg-white shadow-sm ring-1 ring-slate-200 text-blue-600' : 'text-slate-400'}`}>Triagem</button>
          <button onClick={() => setActiveTab('pro_moderacao')} className={`p-4 rounded-xl font-bold text-sm text-left ${activeTab === 'pro_moderacao' ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'text-slate-400'}`}>Diaristas</button>
          <button onClick={() => setActiveTab('expansao')} className={`p-4 rounded-xl font-bold text-sm text-left ${activeTab === 'expansao' ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'text-slate-400'}`}>Cidades</button>
          <button onClick={() => setActiveTab('financeiro')} className={`p-4 rounded-xl font-bold text-sm text-left ${activeTab === 'financeiro' ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'text-slate-400'}`}>Financeiro</button>
          <div className="h-px bg-slate-200 my-4"></div>
          <button onClick={() => setActiveTab('legado')} className={`p-4 rounded-xl font-bold text-sm text-left ${activeTab === 'legado' ? 'bg-white shadow-sm ring-1 ring-slate-200 text-orange-600' : 'text-slate-400'}`}>
            Migrar sodiaristas.net
          </button>
        </nav>
        <button onClick={() => setIsAuthenticated(false)} className="mt-auto p-4 border rounded-xl text-slate-400 font-bold text-xs">SAIR</button>
      </aside>

      <main className="flex-grow p-16 max-w-7xl">
        {activeTab === 'legado' && (
          <div className="space-y-12 animate-in fade-in duration-500">
             <header>
                <h1 className="text-3xl font-black text-slate-900">Importação do Legado</h1>
                <p className="text-slate-500 font-medium">Sincronize sua base de dados hospedada na Alphaservers com o novo modelo.</p>
             </header>

             <div className="grid lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                   <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">URL do Banco Antigo (JSON Export)</label>
                         <input 
                            type="text" 
                            className="w-full bg-slate-50 p-4 rounded-2xl border-none font-mono text-xs text-blue-600"
                            value={legacyEndpoint}
                            onChange={(e) => setLegacyEndpoint(e.target.value)}
                         />
                      </div>
                      <button 
                        onClick={handleMigrateLegacy}
                        disabled={isMigrating}
                        className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all disabled:opacity-50"
                      >
                        {isMigrating ? 'Processando Sincronia...' : 'Iniciar Migração'}
                      </button>
                   </div>

                   <div className="bg-slate-900 p-8 rounded-[40px] text-white">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Log de Operações</h4>
                      <div className="font-mono text-[10px] space-y-2 opacity-80 h-40 overflow-y-auto">
                         {migrationLogs.map((log, i) => (
                            <div key={i} className="flex gap-2">
                               <span className="text-green-500">[{new Date().toLocaleTimeString()}]</span>
                               <span>{log}</span>
                            </div>
                         ))}
                         {migrationLogs.length === 0 && <span className="italic text-slate-600">Aguardando início...</span>}
                      </div>
                   </div>
                </div>

                <div className="bg-orange-50 p-10 rounded-[40px] border border-orange-100 flex flex-col justify-center">
                   <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm">🚀</div>
                   <h3 className="text-xl font-black text-orange-900 mb-2">Novo Padrão Geográfico</h3>
                   <p className="text-sm text-orange-700 leading-relaxed font-medium">
                     Ao migrar profissionais, o sistema agora solicita automaticamente que eles confirmem o **CEP** no primeiro acesso, garantindo que o novo sistema de busca funcione perfeitamente.
                   </p>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'aprovacoes' && (
          <div className="space-y-8">
            <header>
              <h1 className="text-3xl font-black text-slate-900">Aprovações Pendentes</h1>
              <p className="text-slate-500 font-medium">Verifique os documentos dos profissionais novos e migrados.</p>
            </header>
            <div className="grid gap-4">
              {prosInModeration.map(p => (
                <div key={p.id} className="flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-4">
                    <img src={p.avatar} className="w-14 h-14 rounded-2xl object-cover" />
                    <div>
                      <p className="font-black text-slate-900">{p.nome}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {p.id.startsWith('mig') ? '📍 Vindo do Legado' : '🆕 Cadastro Novo'}
                      </p>
                    </div>
                  </div>
                  <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase">Validar Documentos</button>
                </div>
              ))}
              {prosInModeration.length === 0 && <div className="py-20 text-center text-slate-300 font-bold italic">Nenhum profissional na fila.</div>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
