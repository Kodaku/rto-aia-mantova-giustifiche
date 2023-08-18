import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from ".";
import { HOST } from "../constants";
import { RTO } from "../types";
import { rtosActions } from "./rtos-slice";

export const fetchRTOs = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch) => {
        const fetchData = async () => {
            const response = await axios.get(HOST + `/rtos`);

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
        if (rtoResp.dataRTO)
            dispatch(
                rtosActions.getRTO({
                    date: rtoResp.dataRTO,
                })
            );
    };
};
