export type Plantao = {
    id: string;
    plantonista: string;
    data: string;
    horario: string;
    local: string;
    funcao: string;
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
    avatar: any;
    plantaoIds?: string[];
}
  