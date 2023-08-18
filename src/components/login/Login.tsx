import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import Header from "../UI/Header";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/redux-hooks";
import { fetchUsers, getUser, resetUser } from "../../store/usersActions";
import { User } from "../../types";
import axios, { HttpStatusCode } from "axios";
import { HOST } from "../../constants";

const Login = () => {
    const chiaveRef = useRef<HTMLInputElement>(null);
    const [isValid, setIsValid] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const doVerification = async () => {
            if (localStorage.getItem("tokenJustifies")) {
                axios
                    .get(HOST + "/verify", {
                        headers: {
                            Authorization:
                                "Bearer " +
                                localStorage.getItem("tokenJustifies")!,
                        },
                    })
                    .then((response) => {
                        if (response.status !== HttpStatusCode.Forbidden) {
                            const data = response.data;
                            console.log(data);
                            localStorage.setItem(
                                "codeJustifies",
                                data["mechanographicCode"].toString()
                            );
                            navigate("/rto");
                        }
                    })
                    .catch((error) => {
                        localStorage.removeItem("codeJustifies");
                        localStorage.removeItem("tokenJustifies");
                        if (error.response && error.response.status === 401) {
                            console.error("Unauthorized");
                        } else {
                            console.error("Error:", error.message);
                        }
                    });
            }
        };
        dispatch(resetUser());
        dispatch(fetchUsers());
        doVerification();
    }, [dispatch, navigate]);

    const submitHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        if (chiaveRef.current && isValid) {
            if (chiaveRef.current.value.length === 8) {
                dispatch(getUser(chiaveRef.current.value));
                const response = await axios.get(
                    HOST + `/users/${chiaveRef.current.value}`
                );
                const data = (await response.data) as User;
                if (data !== null) {
                    localStorage.setItem(
                        "codeJustifies",
                        data.codiceMeccanografico
                    );
                    navigate("/rto");
                } else {
                    setIsValid(false);
                }
            }
        }
    };

    return (
        <>
            <Header />
            <div className="container" style={{ textAlign: "center" }}>
                <br />
                <div className="card-wrapper">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title h3">
                                Conferma la tua presenza alla RTO del giorno
                            </h3>
                        </div>
                    </div>
                </div>
                <form
                    style={{ background: "rgba(0, 0, 0, 0.05)" }}
                    onSubmit={submitHandler}
                    id="validateMe"
                >
                    <br />
                    <h5 className="h6">
                        Inserisci il tuo codice meccanografico
                    </h5>
                    <br />
                    <div className="row">
                        <div className="col-4"></div>
                        <div className="form-group col-md-4">
                            <label htmlFor="chiaveWeb">
                                Codice Meccanografico
                            </label>
                            <input
                                ref={chiaveRef}
                                onChange={(
                                    e: ChangeEvent<HTMLInputElement>
                                ) => {
                                    setIsValid(e.target.value.length === 8);
                                }}
                                type="text"
                                className={`form-control ${
                                    !isValid
                                        ? "is-invalid"
                                        : "just-validate-success-field"
                                }`}
                                id="chiaveWeb"
                                aria-label="chiaveWeb"
                                required
                            />
                            {!isValid && (
                                <div className="form-feedback just-validate-error-label">
                                    Codice meccanografico non valido
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="row">
                        <div className="form-group col text-center">
                            <button
                                id="buttonSubmitChiaveVerbale"
                                type="submit"
                                className="btn btn-primary"
                            >
                                Conferma
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Login;
