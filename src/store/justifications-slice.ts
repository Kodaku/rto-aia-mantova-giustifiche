import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    JustificationsInitialState,
    RTORetrievedJustification,
} from "../types";

const initialState: JustificationsInitialState = {
    justifications: [],
};

const justificationsSlice = createSlice({
    name: "justifications",
    initialState: initialState,
    reducers: {
        replaceJustifications(
            state,
            action: PayloadAction<{
                justifications: RTORetrievedJustification[];
            }>
        ) {
            const justifications = action.payload.justifications;
            state.justifications = justifications;
        },
        addJustificationToRTO(
            state,
            action: PayloadAction<{
                justification: RTORetrievedJustification;
            }>
        ) {
            const justification = action.payload.justification;
            state.justifications.push({
                dataRTO: justification.dataRTO,
                descrizioneGiustifica: justification.descrizioneGiustifica,
                motivo: justification.motivo,
                statoUtente: justification.statoUtente,
            });
        },
    },
});

const justificationsActions = justificationsSlice.actions;

export { justificationsActions, justificationsSlice };
