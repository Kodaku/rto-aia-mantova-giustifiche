import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RTO, RTOInitialState, RTOJustification, User } from "../types";

const initialState: RTOInitialState = {
    rtos: [],
    currentRTO: {
        dataRTO: "",
        descrizione: "",
        codiciCategoria: [],
        categorieEstese: [],
    },
};

const rtosSlice = createSlice({
    name: "rtos",
    initialState: initialState,
    reducers: {
        replaceRTOs(state, action: PayloadAction<{ rtos: RTO[] }>) {
            const rtos = action.payload.rtos;
            if (rtos) {
                state.rtos = rtos;
            }
        },
        getRTO(state, action: PayloadAction<{ date: string }>) {
            const date = action.payload.date;
            const user = state.rtos.find((rto) => rto.dataRTO === date);
            if (user) {
                state.currentRTO = user;
            }
        },
    },
});

const rtosActions = rtosSlice.actions;

export { rtosActions, rtosSlice };
