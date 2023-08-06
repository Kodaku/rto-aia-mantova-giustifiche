export type User = {
    name: string;
    surname: string;
    mechanographicCode: string;
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

export type RTO = {
    date: string;
    description: string;
    users: User[];
    justifications: RTOJustification[];
};

export type RTOInitialState = {
    currentRTO: RTO;
    rtos: RTO[];
};
