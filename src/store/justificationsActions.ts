import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from ".";
import { HOST } from "../constants";
import { RTOJustification, RTORetrievedJustification } from "../types";
import { justificationsActions } from "./justifications-slice";

export const fetchUserJustifications = (
    token: string,
    mechanographicCode: string
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch) => {
        const fetchData = async () => {
            const response = await axios.get(
                HOST + `/rtos/justifications/${mechanographicCode}`,
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            );
            const data = await response.data;
            return data as RTORetrievedJustification[];
        };

        const usersJustifications = await fetchData();
        dispatch(
            justificationsActions.replaceJustifications({
                justifications: usersJustifications || [],
            })
        );
    };
};

export const addJustificationToRTO = (
    rtoDate: string,
    rtoJustification: RTOJustification,
    token: string
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch) => {
        const addJustifiedUser = async () => {
            console.log(rtoJustification);
            const response = await axios.post(
                HOST + `/rtos/justifications/${rtoDate}`,
                {
                    motivation: rtoJustification.motivation,
                    motivation_description:
                        rtoJustification.motivation_description,

                    codiceMeccanografico:
                        rtoJustification.user.codiceMeccanografico.toString(),
                },
                {
                    headers: {
                        Authorization: "Bearer " + token,
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await response.data;
            console.log(data);
            return data as RTORetrievedJustification;
        };
        const justificationResp = await addJustifiedUser();
        if (justificationResp !== null) {
            dispatch(
                justificationsActions.addJustificationToRTO({
                    justification: justificationResp,
                })
            );
        }
    };
};
