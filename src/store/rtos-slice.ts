import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RTO, RTOInitialState, RTOJustification, User } from "../types";

const initialState: RTOInitialState = {
    rtos: [],
    currentRTO: {
        date: "",
        description: "",
        users: [],
        justifications: [],
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
        addRTO(state, action: PayloadAction<{ rto: RTO }>) {
            const rto = action.payload.rto;
            state.rtos.push({
                date: rto.date,
                description: rto.description,
                users: rto.users,
                justifications: rto.justifications,
            });
        },
        updateRTO(state, action: PayloadAction<{ rto: RTO }>) {
            const newRTO = action.payload.rto;
            const oldRTOIndex = state.rtos.findIndex(
                (rto) => rto.date === newRTO.date
            );
            state.rtos[oldRTOIndex] = newRTO;
            console.log("New RTO: ", state.rtos[oldRTOIndex]);
        },
        getRTO(state, action: PayloadAction<{ date: string }>) {
            const date = action.payload.date;
            const user = state.rtos.find((rto) => rto.date === date);
            if (user) {
                state.currentRTO = user;
            }
        },
        removeRTO(state, action: PayloadAction<{ date: string }>) {
            const date = action.payload.date;
            state.rtos = state.rtos.filter((rto) => rto.date !== date);
        },
        removeUserFromRTO(
            state,
            action: PayloadAction<{ date: string; mechanographicCode: string }>
        ) {
            const date = action.payload.date;
            const mechanographicCode = action.payload.mechanographicCode;
            const rtoIndex = state.rtos.findIndex((rto) => rto.date === date);
            const rto = state.rtos[rtoIndex];
            rto.users.filter(
                (user) => user.mechanographicCode !== mechanographicCode
            );
            state.rtos[rtoIndex] = rto;
        },
        addUserToRTO(
            state,
            action: PayloadAction<{ date: string; user: User }>
        ) {
            const date = action.payload.date;
            const user = action.payload.user;
            const rtoIndex = state.rtos.findIndex((rto) => rto.date === date);
            const rto = state.rtos[rtoIndex];
            rto.users.push(user);
            state.rtos[rtoIndex] = rto;
        },
        addJustificationToRTO(
            state,
            action: PayloadAction<{
                date: string;
                justification: RTOJustification;
            }>
        ) {
            const date = action.payload.date;
            const justification = action.payload.justification;
            const rtoIndex = state.rtos.findIndex((rto) => rto.date === date);
            const rto = state.rtos[rtoIndex];
            rto.justifications.push(justification);
            state.rtos[rtoIndex] = rto;
        },
    },
});

const rtosActions = rtosSlice.actions;

export { rtosActions, rtosSlice };
