import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Servico } from '../types';
import { requestPixTransfer, checkTransferStatus } from '../services/asaasService';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'profissional' | 'cliente'>('profissional');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [saldo, setSaldo] = useState(1250.00);
  
  const [services] = useState<Servico[]>([
    { 
      id: 'srv_1', 
      tipo: 'limpeza_padrao', 
      data: '25/05/2024', 
      hora: '08:00', 
      horas: 4, 
      valorTotal: 180.00,
      taxaPlataforma: 27.00,
      taxaAsaas: 2.50,
      valorLiquido: 150.50,
      status: 'pendente', 
      pagamentoStatus: 'pendente',
      bairro: 'Vila Madalena, SP',
      nomeCliente: 'Ricardo Oliveira',
      nomeDiarista: 'Maria Santos',
    }
  ]);

  const handleWithdraw = async () => {
    if (saldo <= 0) return;
    setIsWithdrawing(true);
    try {
      // Usando chave mockada para o exemplo, em prod viria do perfil do user
      const response = await requestPixTransfer(saldo, '12345678900', 'CPF');
      const status = await checkTransferStatus(response.id);
      if (status === 'DONE') {
        setWithdrawSuccess(true);
        setSaldo(0);
        setTimeout(() => setWithdrawSuccess(false), 5000);
      }
    } catch (err) {
      alert("Erro ao processar saque. Verifique sua chave PIX no perfil.");
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Meu Painel</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Gestão de Ganhos e PIX</p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-[24px] shadow-inner">
           <button onClick={() => setView('profissional')} className={`px-8 py-3 rounded-[18px] font-bold text-xs uppercase transition-all ${view === 'profissional' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}>Sou Profissional</button>
           <button onClick={() => setView('cliente')} className={`px-8 py-3 rounded-[18px] font-bold text-xs uppercase transition-all ${view === 'cliente' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}>Sou Cliente</button>
        </div>
      </div>

      {view === 'profissional' && (
        <div className="grid md:grid-cols-3 gap-6 mb-12 animate-in fade-in duration-500">
           <div className={`p-8 rounded-[40px] text-white flex flex-col justify-between min-h-[250px] shadow-2xl transition-all duration-500 ${withdrawSuccess ? 'bg-green-600 shadow-green-200' : 'bg-slate-900 shadow-slate-200'}`}>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full animate-pulse ${withdrawSuccess ? 'bg-white' : 'bg-green-500'}`}></span>
                  {withdrawSuccess ? 'Saque Realizado!' : 'Saldo Disponível'}
                </p>
                <h2 className="text-5xl font-black tracking-tighter">
                  {withdrawSuccess ? "PIX ENVIADO!" : `R$ ${saldo.toFixed(2)}`}
                </h2>
              </div>
              
              {!withdrawSuccess && (
                <button 
                  onClick={handleWithdraw}
                  disabled={isWithdrawing || saldo <= 0}
                  className="w-full bg-blue-600 text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isWithdrawing ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> ENVIANDO PIX...</>
                  ) : (
                    <><span className="text-xl">⚡</span> RESGATAR VIA PIX AGORA</>
                  )}
                </button>
              )}
              {withdrawSuccess && (
                <div className="text-center py-4 bg-white/10 rounded-2xl animate-bounce">
                  <span className="text-xs font-black uppercase tracking-widest">Confira seu banco! 🚀</span>
                </div>
              )}
           </div>

           <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl space-y-4">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Sua Chave Cadastrada</p>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex justify-between items-center">
                 <div>
                    <p className="text-[10px] font-black text-blue-600 uppercase">PIX CPF</p>
                    <p className="text-xl font-black text-slate-900">***.456.789-**</p>
                 </div>
                 <button className="text-[10px] font-black text-slate-400 underline uppercase tracking-widest">Alterar</button>
              </div>
              <p className="text-[10px] text-slate-400 font-medium italic leading-tight">Pagamentos processados instantaneamente via transferência direta Asaas.</p>
           </div>

           <div className="bg-blue-50/30 p-8 rounded-[40px] border border-blue-100 flex flex-col justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-sm">💎</div>
              <h4 className="text-xl font-black text-blue-900 leading-tight">Você é uma Pro Top!</h4>
              <p className="text-xs font-bold text-blue-700 opacity-70">Nota 4.9 • 124 Faxinas</p>
              <button className="text-[10px] font-black text-blue-600 uppercase border-2 border-blue-200 py-3 rounded-xl hover:bg-white transition-all">Ver Reputação</button>
           </div>
        </div>
      )}

      <div className="space-y-6">
         <div className="flex justify-between items-center px-2">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Atividades Recentes</h3>
            <span className="text-[10px] font-bold text-slate-300">Total: {services.length}</span>
         </div>
         {services.map(s => (
            <div key={s.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl flex flex-col md:flex-row items-center justify-between group hover:border-blue-200 transition-all gap-6">
               <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase leading-none">{s.data.split('/')[0]}</span>
                    <span className="text-xl font-black text-slate-900 leading-none">{s.data.split('/')[1]}</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-2xl font-black text-slate-900">{view === 'profissional' ? s.nomeCliente : s.nomeDiarista}</h4>
                    <div className="flex items-center gap-3">
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[9px] font-black uppercase">{s.hora}</span>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.bairro}</p>
                    </div>
                  </div>
               </div>
               <div className="text-right w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Repasse Líquido</p>
                  <p className="text-3xl font-black text-blue-600 tracking-tighter">R$ {s.valorLiquido.toFixed(2)}</p>
                  <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest">Pagamento Concluído</span>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};

export default Dashboard;