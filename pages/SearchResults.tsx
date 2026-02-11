
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Diarista } from '../types';

const mockDiaristas: Diarista[] = [
  {
    id: '1',
    nome: 'Fernanda R.',
    email: 'fernanda@exemplo.com',
    cpf: '111.222.333-44',
    telefone: '(11) 99999-8888',
    statusAprovacao: 'aprovado',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    nota: 4.9,
    avaliacoes: 124,
    taxaCancelamento: 2,
    precoBase: 160,
    tipoPreco: 'periodo',
    especialidades: ['limpeza_pesada', 'passar_roupa'],
    restricoes: 'Não lava roupas delicadas.',
    bio: 'Especialista em limpezas pesadas e organização de armários.',
    bairro: 'Vila Madalena',
    cidade: 'São Paulo',
    saldoDevedor: 0
  },
  {
    id: '2',
    nome: 'Luciano P.',
    email: 'luciano@exemplo.com',
    cpf: '555.666.777-88',
    telefone: '(11) 97777-6666',
    statusAprovacao: 'aprovado',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    nota: 4.8,
    avaliacoes: 56,
    taxaCancelamento: 5,
    precoBase: 35,
    tipoPreco: 'hora',
    especialidades: ['jardinagem', 'limpeza_calhas'],
    restricoes: 'Trabalho apenas em áreas externas.',
    bio: 'Manutenção de jardins e limpeza de calhas com segurança.',
    bairro: 'Moema',
    cidade: 'São Paulo',
    saldoDevedor: 0
  }
];

const SearchResults: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-16">
        <h1 className="text-5xl font-extrabold text-slate-900 mb-2">Especialistas Disponíveis</h1>
        <p className="text-slate-500 font-medium">Contratação simplificada com geolocalização precisa.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
        {mockDiaristas.map(d => (
          <div key={d.id} className="bg-white rounded-[48px] overflow-hidden border border-slate-50 shadow-xl hover:shadow-2xl transition-all group">
            <div className="h-72 relative">
              <img src={d.avatar} className="w-full h-full object-cover" />
              <div className="absolute top-6 left-6 bg-white px-4 py-2 rounded-2xl font-black text-amber-500 shadow-lg">★ {d.nota}</div>
              <div className="absolute bottom-6 left-6 flex gap-2">
                <div className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Verificado</div>
              </div>
            </div>
            
            <div className="p-10 space-y-6">
              <div className="flex justify-between items-start">
                <h3 className="text-3xl font-black text-slate-900">{d.nome}</h3>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed italic">"{d.bio}"</p>
              <div className="flex flex-wrap gap-2">
                {d.especialidades.map(esp => (
                  <span key={esp} className="bg-slate-100 px-3 py-1 rounded-lg text-[9px] font-black uppercase text-slate-500">{esp.replace('_', ' ')}</span>
                ))}
              </div>
              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase">A partir de</p>
                   <p className="text-3xl font-black text-slate-900">R$ {d.precoBase}</p>
                </div>
                <button onClick={() => navigate('/cadastro-cliente')} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-600 transition-all shadow-xl">Contratar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
