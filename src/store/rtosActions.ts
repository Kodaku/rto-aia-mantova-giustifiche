import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from ".";
import { HOST } from "../constants";
import { RTO, RTOJustification, User } from "../types";
import { rtosActions } from "./rtos-slice";

export const fetchRTOs = (
    token: string
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch) => {
        const fetchData = async () => {
            const response = await axios.get(HOST + `/rtos`, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            });

            const data = await response.data;
            return data as RTO[];
        };

        const rtos = await fetchData();
        dispatch(
            rtosActions.replaceRTOs({
                rtos: rtos || [],
            })
        );
    };
};

export const getRTO = (
    rtoDate: string,
    token: string
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch) => {
        const getData = async () => {
            const response = await axios.get(HOST + `/rtos/${rtoDate}`, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            const data = await response.data;
            return data as RTO;
        };

        const rtoResp = await getData();
        if (rtoResp.date)
            dispatch(
                rtosActions.getRTO({
                    date: rtoResp.date,
                })
            );
    };
};

export const addRTO = (
    rto: RTO
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch) => {
        const addData = async () => {
            const response = await axios.post(HOST + `/rtos`, {
                date: rto.date,
                desription: rto.description,
                users: [],
            });
            const data = await response.data;
            console.log(data);
            return data as RTO;
        };

        const rtoResp = await addData();
        dispatch(
            rtosActions.addRTO({
                rto: rtoResp,
            })
        );
    };
};

export const deleteRTO = (
    rtoDate: string
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch) => {
        const deleteData = async () => {
            const response = await axios.get(HOST + `/rtos/delete/${rtoDate}`);
            const data = await response.data;
            console.log(data);
            // return data;
        };
        await deleteData();
        dispatch(
            rtosActions.removeRTO({
                date: rtoDate,
            })
        );
    };
};

export const addUserToRTO = (
    rtoDate: string,
    user: User,
    token: string
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch) => {
        const addUser = async () => {
            const response = await axios.post(
                HOST + `/rtos/users/${rtoDate}`,
                {
                    name: user.name,
                    surname: user.surname,
                    mechanographicCode: user.mechanographicCode,
                },
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            );
            const data = await response.data;
            console.log(data);
            return data as RTO;
        };
        const rtoResp = await addUser();
        dispatch(
            rtosActions.addUserToRTO({
                date: rtoDate,
                user: user,
            })
        );
        dispatch(rtosActions.getRTO({ date: rtoResp.date }));
    };
};

export const addJustificationToRTO = (
    rtoDate: string,
    rtoJustification: RTOJustification,
    token: string
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch) => {
        const addJustifiedUser = async () => {
            const response = await axios.post(
                HOST + `/rtos/justifications/${rtoDate}`,
                {
                    motivation: rtoJustification.motivation,
                    motivation_description:
                        rtoJustification.motivation_description,
                    user: {
                        name: rtoJustification.user.name,
                        surname: rtoJustification.user.surname,
                        mechanographicCode:
                            rtoJustification.user.mechanographicCode,
                    },
                },
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            );
            const data = await response.data;
            console.log(data);
            return data as RTO;
        };
        const rtoResp = await addJustifiedUser();
        if (rtoResp !== null) {
            dispatch(
                rtosActions.addJustificationToRTO({
                    date: rtoDate,
                    justification: rtoJustification,
                })
            );
        }
    };
};

export const removeUserFromRTO = (
    rtoDate: string,
    mechanographicCode: string
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch) => {
        const removeUser = async () => {
            const response = await axios.get(
                HOST + `/rtos/delete/card/${rtoDate}/${mechanographicCode}`
            );
            const data = await response.data;
            console.log(data);
        };
        await removeUser();
        dispatch(
            rtosActions.removeUserFromRTO({
                date: rtoDate,
                mechanographicCode: mechanographicCode,
            })
        );
        dispatch(rtosActions.getRTO({ date: rtoDate }));
    };
};
