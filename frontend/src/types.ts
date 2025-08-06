export interface Centro {
    id: string;
    nome: string;
    sigla: string;
    descricao: string;
  }
  
  export interface Edificio {
    id: string;
    nome: string;
    descricao: string;
    latitude: number;
    longitude: number;
    tipoLocal: string;
  }
  
  export interface Sala {
    id: string;
    idEdificio: string;
    numero: string;
    andar: number;
    nome: string;
    descricao: string;
    latitude: number;
    longitude: number;
  }