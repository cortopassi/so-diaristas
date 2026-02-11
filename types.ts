
export interface CidadeExpansion {
  id: string;
  nome: string;
  estado: string;
  ativa: boolean;
  tentativasCadastro: number;
}

export interface AgendaDisponibilidade {
  dia: number; // 0-6
  turnos: ('manha' | 'tarde' | 'noite')[];
  blocosHoras: (4 | 6 | 8)[];
}

export interface Diarista {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  avatar: string;
  nota: number;
  avaliacoes: number;
  taxaCancelamento: number; 
  precoBase: number;
  especialidades: string[]; 
  restricoes: string;
  bio: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  numero: string;
  complemento?: string;
  tipoPreco: 'hora' | 'servico';
  lat: number;
  lng: number;
  pixKey?: string;
  pixKeyType?: 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'EVP';
  disponibilidade: AgendaDisponibilidade[];
  statusAprovacao: 'pendente' | 'aprovado' | 'rejeitado' | 'bloqueado';
  termoAceite: boolean;
  // Selos de Verificação
  docValidado: boolean;
  antecedentesValidado: boolean;
  residenciaValidado: boolean;
  fotoValidada: boolean;
}

export interface Servico {
  id: string;
  tipo: string;
  data: string;
  hora: string;
  horas: number;
  valorTotal: number;
  taxaPlataforma: number;
  taxaAsaas: number;
  valorLiquido: number;
  status: string;
  pagamentoStatus: string;
  bairro: string;
  nomeCliente: string;
  nomeDiarista: string;
}

export interface EstimateResponse {
  tempoEstimado: number;
  valorSugerido: number;
  recomendacoes: string[];
  explicacao: string;
}
