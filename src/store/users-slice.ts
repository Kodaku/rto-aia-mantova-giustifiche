import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserInitialState } from "../types";

const initialState: UserInitialState = {
    users: [],
    currentUser: {
        name: "",
        surname: "",
        mechanographicCode: "",
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
        // addUser(state, action: PayloadAction<{ user: User }>) {
        //     const user = action.payload.user;
        //     state.users.push({
        //         name: user.name,
        //         surname: user.surname,
        //         mechanographicCode: user.mechanographicCode,
        //     });
        // },
        updateUser(state, action: PayloadAction<{ user: User }>) {
            const newUser = action.payload.user;
            const oldUserIndex = state.users.findIndex(
                (user) => user.mechanographicCode === newUser.mechanographicCode
            );
            state.users[oldUserIndex] = newUser;
            console.log("New User: ", state.users[oldUserIndex]);
        },
        getUser(state, action: PayloadAction<{ mechanographicCode: string }>) {
            const mechanographicCode = action.payload.mechanographicCode;
            const user = state.users.find(
                (user) => user.mechanographicCode === mechanographicCode
            );
            if (user) {
                state.currentUser = user;
            }
        },
        removeUser(
            state,
            action: PayloadAction<{ mechanographicCode: string }>
        ) {
            const mechanographicCode = action.payload.mechanographicCode;
            state.users = state.users.filter(
                (user) => user.mechanographicCode !== mechanographicCode
            );
        },
        resetUser(state, action) {
            state.currentUser = {
                name: "",
                surname: "",
                mechanographicCode: "",
            };
        },
    },
});

const usersActions = usersSlice.actions;

export { usersActions, usersSlice };
