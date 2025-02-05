export type Plantao = {
  id: string;
  plantonista: string;
  data: string;
  horario: string;
  local: string;
  funcao: string;
  concluido: boolean;
  observacoes: string;
};

export type MarkedDays = {
  [date: string]: {
    dots?: { color: string; selectedColor: string }[];
    selectedColor?: string;
  };
};

export type Medico = {
  id: string;
  nome: string;
  isAdmin: boolean;
  plantaoIdsAntigos?: string[];
  plantaoIdsNovos?: string[];
};

export type Hospital = {
  id: string;
  name: string;
  address: string;
  plantaoIdsH?: string[];
};
