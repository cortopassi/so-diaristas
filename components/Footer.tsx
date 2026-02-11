
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2 md:col-span-1">
            <span className="text-2xl font-bold text-blue-600 mb-6 block">Só Diaristas</span>
            <p className="text-gray-500 text-sm">
              Simplificando a limpeza residencial e comercial desde 2015 com tecnologia e confiança.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Empresa</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-blue-600">Sobre nós</a></li>
              <li><a href="#" className="hover:text-blue-600">Trabalhe conosco</a></li>
              <li><a href="#" className="hover:text-blue-600">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Ajuda</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-blue-600">Dúvidas frequentes</a></li>
              <li><a href="#" className="hover:text-blue-600">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-blue-600">Segurança</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-blue-600">Privacidade</a></li>
              <li><a href="#" className="hover:text-blue-600">Termos de uso</a></li>
              <li><a href="#" className="hover:text-blue-600">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs text-center md:text-left">
            © 2023 Só Diaristas. Todos os direitos reservados. CNPJ: 00.000.000/0001-00
          </p>
          <div className="flex gap-6 text-gray-400">
             {/* Social Icon Placeholders */}
             <div className="w-5 h-5 bg-gray-100 rounded"></div>
             <div className="w-5 h-5 bg-gray-100 rounded"></div>
             <div className="w-5 h-5 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
