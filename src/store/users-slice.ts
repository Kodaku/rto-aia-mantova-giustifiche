import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserInitialState } from "../types";

const initialState: UserInitialState = {
    users: [],
    currentUser: {
        nome: "",
        cognome: "",
        categoriaEstesa: "",
        codiceCategoria: "",
        codiceMeccanografico: "",
        email: "",
        qualifica: "",
        selezionabile: false,
    },
};

const usersSlice = createSlice({
    name: "users",
    initialState: initialState,
    reducers: {
        replaceUsers(state, action: PayloadAction<{ users: User[] }>) {
            const users = action.payload.users;
            if (users) {
                state.users = users;
            }
        },
        getUser(state, action: PayloadAction<{ mechanographicCode: string }>) {
            const mechanographicCode = action.payload.mechanographicCode;
            const user = state.users.find((user) => {
                return (
                    user.codiceMeccanografico.toString() === mechanographicCode
                );
            });
            if (user) {
                state.currentUser = user;
            }
        },
        resetUser(state, action) {
            state.currentUser = {
                nome: "",
                cognome: "",
                categoriaEstesa: "",
                codiceCategoria: "",
                codiceMeccanografico: "",
                email: "",
                qualifica: "",
                selezionabile: false,
            };
        },
    },
});

const usersActions = usersSlice.actions;

export { usersActions, usersSlice };
