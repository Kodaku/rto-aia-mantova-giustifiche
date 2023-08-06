import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from ".";
import { User } from "../types";
import { usersActions } from "./users-slice";
import { HOST } from "../constants";

export const fetchUsers = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch) => {
        const fetchData = async () => {
            const response = await axios.get(HOST + `/users`);

            const data = await response.data;
            return data as User[];
        };

        const users = await fetchData();
        dispatch(
            usersActions.replaceUsers({
                users: users || [],
            })
        );
    };
};

export const getUser = (
    mechanographicCode: string
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch) => {
        const getData = async () => {
            const response = await axios.get(
                HOST + `/users/${mechanographicCode}`
            );
            const data = await response.data;
            return data;
        };

        const userResp = await getData();
        if (userResp !== null) {
            localStorage.setItem("tokenJustifies", userResp["token"]);
            dispatch(
                usersActions.getUser({
                    mechanographicCode: userResp.mechanographicCode,
                })
            );
        } else {
            dispatch(usersActions.resetUser({}));
        }
    };
};

export const resetUser = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return (dispatch) => {
        dispatch(usersActions.resetUser({}));
    };
};

// export const addUser = (
//     user: User
// ): ThunkAction<void, RootState, unknown, AnyAction> => {
//     return async (dispatch) => {
//         const addData = async () => {
//             const response = await axios.post(HOST + `/users`, {
//                 name: user.name,
//                 surname: user.surname,
//                 mechanographicCode: user.mechanographicCode,
//             });
//             const data = await response.data;
//             console.log(data);
//             return data as User;
//         };

//         const userResp = await addData();
//         dispatch(
//             usersActions.addUser({
//                 user: userResp,
//             })
//         );
//     };
// };

export const deleteUser = (
    mechanographicCode: string
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch) => {
        const deleteData = async () => {
            const response = await axios.get(
                HOST + `/users/delete/${mechanographicCode}`
            );
            const data = await response.data;
            console.log(data);
            // return data;
        };
        await deleteData();
        dispatch(
            usersActions.removeUser({
                mechanographicCode: mechanographicCode,
            })
        );
    };
};
