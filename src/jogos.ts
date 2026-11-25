export const STATUS = ['Quero jogar', 'Jogando', 'Concluído'] as const;
export type StatusJogo = (typeof STATUS)[number];

export type DadosJogo = {
  titulo: string;
  plataforma: string;
  status: StatusJogo;
  observacoes: string;
};

export type Jogo = DadosJogo & { id: number };
