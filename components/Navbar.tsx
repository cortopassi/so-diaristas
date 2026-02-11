
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 py-2">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tighter">
                Só Diaristas
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-10 items-center">
            <Link to="/" className="text-slate-500 hover:text-blue-600 font-bold transition-colors text-sm uppercase tracking-widest">Início</Link>
            <Link to="/cadastro-profissional" className="text-slate-500 hover:text-blue-600 font-bold transition-colors text-sm uppercase tracking-widest">Quero Trabalhar</Link>
            <Link to="/acesso" className="text-slate-500 hover:text-blue-600 font-bold transition-colors text-sm uppercase tracking-widest">Entrar</Link>
            <Link to="/admin" className="text-red-600 font-black text-[10px] uppercase border border-red-100 bg-red-50 px-3 py-1 rounded-lg hover:bg-red-600 hover:text-white transition-all">Painel ADM</Link>
            
            <div className="h-6 w-[1px] bg-slate-200"></div>
            
            <Link to="/busca" className="bg-slate-900 text-white px-8 py-3.5 rounded-[20px] font-bold hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 text-sm">
              Quero Contratar
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-4">
             <Link to="/admin" className="text-red-500 text-[10px] font-black uppercase">ADM</Link>
             <Link to="/acesso" className="text-blue-600 font-black text-xs uppercase">Entrar</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
