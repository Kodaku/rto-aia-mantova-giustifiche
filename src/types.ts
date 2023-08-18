export type User = {
    nome: string;
    cognome: string;
    codiceMeccanografico: string;
    qualifica: string;
    codiceCategoria: string;
    categoriaEstesa: string;
    email: string;
    selezionabile: boolean;
};

export type UserInitialState = {
    users: User[];
    currentUser: User;
};

export type RTOJustification = {
    motivation: string;
    motivation_description: string;
    user: User;
};

export type RTORetrievedJustification = {
    dataRTO: string;
    statoUtente: string;
    descrizioneGiustifica: string;
    motivo: string;
};

export type JustificationsInitialState = {
    justifications: RTORetrievedJustification[];
};

export type RTO = {
    dataRTO: string;
    descrizione: string;
    codiciCategoria: string[];
    categorieEstese: string[];
};

export type RTOInitialState = {
    currentRTO: RTO;
    rtos: RTO[];
};
