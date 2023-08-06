import { configureStore } from "@reduxjs/toolkit";
import { usersSlice } from "./users-slice";
import { rtosSlice } from "./rtos-slice";

export const store = configureStore({
    reducer: {
        users: usersSlice.reducer,
        rtos: rtosSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
