
export interface CidadeExpansion {
  id: string;
  nome: string;
  estado: string;
  ativa: boolean;
  tentativasCadastro: number;
}

export interface AgendaConfig {
  diasSemana: number[]; // 0-6
  turnos: ('manha' | 'tarde' | 'noite')[];
  bloqueios: string[]; // ISO dates
}

export type TipoServico = 
  | 'limpeza_padrao' 
  | 'limpeza_pesada' 
  | 'limpeza_dia_a_dia'
  | 'pos_obra' 
  | 'pre_mudanca'
  | 'comercial_escritorio'
  | 'jardinagem' 
  | 'limpeza_portoes' 
  | 'limpeza_calhas' 
  | 'lavagem_telhados'
  | 'passar_robot'
  | 'passar_roupa'
  | 'organizacao';

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
  especialidades: TipoServico[];
  restricoes: string;
  bio: string;
  bairro: string;
  cidade: string;
  tipoPreco: 'hora' | 'periodo';
  horasPorPeriodo?: number;
  lat?: number;
  lng?: number;
  saldoDevedor: number;
  pixKey?: string;
  pixKeyType?: 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'EVP';
  agendaConfig?: AgendaConfig;
  statusAprovacao: 'pendente' | 'aprovado' | 'rejeitado' | 'bloqueado';
  motivoRejeicao?: string;
}

export interface Cliente {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  qtdAlertas: number;
  isBlocked: boolean;
}

export interface Review {
  nota: number;
  comentario: string;
  data: string;
  autorNome?: string;
}

export interface Servico {
  id: string;
  tipo: TipoServico;
  data: string;
  hora: string;
  horas: number;
  valorTotal: number; 
  taxaPlataforma: number;
  taxaAsaas: number;
  valorLiquido: number;
  status: 'pendente' | 'confirmado' | 'em_andamento' | 'aguardando_finalizacao' | 'concluido' | 'cancelado' | 'nao_comparecido';
  diaristaId?: string;
  bairro: string;
  distanciaKm?: number;
  enderecoCompleto?: string;
  nomeCliente?: string;
  nomeDiarista?: string;
  pagamentoStatus: 'pendente' | 'recebido' | 'estornado';
  asaasPaymentId?: string;
}

export interface EstimateResponse {
  tempoEstimado: number;
  valorSugerido: number;
  recomendacoes: string[];
  explicacao: string;
}
