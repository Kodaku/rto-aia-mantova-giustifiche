import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import Header from "../UI/Header";
import {
    addJustificationToRTO,
    fetchRTOs,
    getRTO,
} from "../../store/rtosActions";
import { fetchUsers, getUser } from "../../store/usersActions";
import { Button, Modal, Toast } from "react-bootstrap";
import { BsCheckCircle } from "react-icons/bs";
import "./RTOHome.css";
import { RTO, RTOJustification } from "../../types";

const RTOHome = () => {
    const dispatch = useAppDispatch();
    const [currentDay, setCurrentDay] = useState<string>("");
    const rtos = useAppSelector((state) => state.rtos.rtos);
    const user = useAppSelector((state) => state.users.currentUser);
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const [showToast, setShowToast] = useState(false);
    const [selectedRTO, setSelectedRTO] = useState<RTO>({
        date: "",
        description: "",
        users: [],
        justifications: [],
    });
    const [selectedOption, setSelectedOption] = useState("");
    const [textAreaValue, setTextAreaValue] = useState(""); // State to store text area value

    const getSeason = () => {
        const currentDay = new Date();
        currentDay.setDate(currentDay.getDate());
        let seasonYears = [];
        if (currentDay.getMonth() >= 6 && currentDay.getMonth() <= 11) {
            seasonYears.push(currentDay.getFullYear());
            seasonYears.push(currentDay.getFullYear() + 1);
        } else if (currentDay.getMonth() >= 0 && currentDay.getMonth() < 6) {
            seasonYears.push(currentDay.getFullYear() - 1);
            seasonYears.push(currentDay.getFullYear());
        }
        return seasonYears;
    };

    const isRTOInSeason = (rto: RTO) => {
        const seasonYears = getSeason();
        const rtoDate = getDate(rto.date);
        if (rtoDate.getMonth() >= 6 && rtoDate.getMonth() <= 11) {
            return rtoDate.getFullYear() === seasonYears[0];
        } else if (rtoDate.getMonth() >= 0 && rtoDate.getMonth() <= 5) {
            return rtoDate.getFullYear() === seasonYears[1];
        }
    };

    const getRTOsOfSeason = () => {
        return rtos.filter((rto) => isRTOInSeason(rto));
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedRTO({
            date: "",
            description: "",
            users: [],
            justifications: [],
        });
        setTextAreaValue("");
    };

    const handleSave = () => {
        // Handle submit logic here
        console.log("Submitted:", textAreaValue);
        console.log(selectedOption);

        const justification: RTOJustification = {
            motivation: selectedOption,
            motivation_description: textAreaValue,
            user: user,
        };
        if (
            localStorage.getItem("tokenJustifies") &&
            localStorage.getItem("tokenJustifies") !== null
        ) {
            dispatch(
                addJustificationToRTO(
                    selectedRTO.date,
                    justification,
                    localStorage.getItem("tokenJustifies")!
                )
            );
            setShowToast(true);
            setTimeout(() => setShowToast(false), 5000);
        }

        handleCloseModal();
    };

    const handleActionClick = (rto: RTO) => {
        setSelectedRTO(rto);
        setShowModal(true);
    };

    const getDate = (dateString: string) => {
        const [datePart, timePart] = dateString.split("T");
        const [day, month, year] = datePart.split("-");
        const [hour, minute, second] = timePart.split(":");
        const formattedDateString = `${month}-${day}-${year} ${hour}:${minute}:${second}`;
        return new Date(formattedDateString);
    };

    const checkDateAfter = (startDate: Date, date: Date) => {
        const targetTime = date.getTime();
        const startTime = startDate.getTime();

        return targetTime >= startTime;
    };

    const checkDateBefore = (startDate: Date, date: Date) => {
        const targetTime = date.getTime();
        const startTime = startDate.getTime();

        return targetTime < startTime;
    };

    const getNextRTOs = () => {
        const seasonsRTOs = getRTOsOfSeason();
        if (currentDay.length > 0) {
            const currentRTOs = seasonsRTOs.filter((rto) => {
                const rtoDate = getDate(rto.date);
                const today = getDate(currentDay);
                if (checkDateAfter(today, rtoDate)) {
                    return true;
                }
                return false;
            });
            return currentRTOs;
        }
        return null;
    };

    const getPreviousRTOs = () => {
        const seasonsRTOs = getRTOsOfSeason();
        if (currentDay.length > 0) {
            const currentRTOs = seasonsRTOs.filter((rto) => {
                const rtoDate = getDate(rto.date);
                const today = getDate(currentDay);
                if (checkDateBefore(today, rtoDate)) {
                    return true;
                }
                return false;
            });
            return currentRTOs;
        }
        return null;
    };

    const isUserJustifiedToRTO = (currentRTO: RTO) => {
        let justified = false;
        currentRTO.justifications.forEach((justification) => {
            if (
                justification.user.mechanographicCode ===
                user.mechanographicCode
            ) {
                justified = true;
            }
        });
        return justified;
    };

    const getRTOJustificationOfUser = (currentRTO: RTO) => {
        let motivation: string = "";
        let motivationDescription: string = "";
        currentRTO.justifications.forEach((justification) => {
            if (
                justification.user.mechanographicCode ===
                user.mechanographicCode
            ) {
                motivation = justification.motivation;
                motivationDescription = justification.motivation_description;
            }
        });
        return {
            motivation: motivation.length > 0 ? motivation : "INGIUSTIFICATO",
            motivationDescription:
                motivationDescription.length > 0
                    ? motivationDescription
                    : "Nessuna",
        };
    };

    useEffect(() => {
        if (
            localStorage.getItem("tokenJustifies") !== null &&
            localStorage.getItem("codeJustifies") !== null
        ) {
            dispatch(fetchUsers());
            dispatch(getUser(localStorage.getItem("codeJustifies")!));
            dispatch(fetchRTOs(localStorage.getItem("tokenJustifies")!));
            const today = new Date();
            const month = (today.getMonth() + 1).toString();
            const hour = today.getHours().toString();
            const minute = today.getMinutes().toString();
            const day =
                today.getDate().toString().padStart(2, "0") +
                "-" +
                month.padStart(2, "0") +
                "-" +
                today.getFullYear() +
                "T" +
                hour.padStart(2, "0") +
                ":" +
                minute.padStart(2, "0") +
                ":00";
            setCurrentDay(day);
            dispatch(getRTO(day, localStorage.getItem("tokenJustifies")!));
        }
    }, [dispatch]);

    return (
        <>
            <Header />
            <br />
            <br />
            <div className="d-flex justify-content-center">
                <h1>
                    RTO Della Stagione {getSeason()[0] + "/" + getSeason()[1]}
                </h1>
            </div>
            <br />
            <div className="d-flex justify-content-center">
                <div style={{ width: "70%" }}>
                    <table className="table table-bordered table-striped table-hover">
                        <thead className="table-primary">
                            <tr>
                                <th>Data</th>
                                <th>Descrizione</th>
                                <th>Giustifica</th>
                                <th>Motivo Giustifica</th>
                                <th>Descrizione Motivo</th>
                            </tr>
                        </thead>

                        <tbody>
                            {getPreviousRTOs() !== null &&
                                getPreviousRTOs()!
                                    .sort((a, b) => {
                                        return (
                                            getDate(a.date).getTime() -
                                            getDate(b.date).getTime()
                                        );
                                    })
                                    .map((rto) => (
                                        <tr key={rto.date}>
                                            <td>
                                                {getDate(
                                                    rto.date
                                                ).toLocaleDateString()}{" "}
                                                ore{" "}
                                                {getDate(rto.date)
                                                    .getHours()
                                                    .toString()
                                                    .padStart(2, "0")}
                                                :
                                                {getDate(rto.date)
                                                    .getMinutes()
                                                    .toString()
                                                    .padStart(2, "0")}
                                            </td>
                                            <td>{rto.description}</td>
                                            <td>
                                                <Button
                                                    disabled
                                                    variant={
                                                        isUserJustifiedToRTO(
                                                            rto
                                                        )
                                                            ? "success"
                                                            : "danger"
                                                    }
                                                    onClick={() =>
                                                        handleActionClick(rto)
                                                    }
                                                >
                                                    Giustifica
                                                </Button>
                                            </td>
                                            <td>
                                                {
                                                    getRTOJustificationOfUser(
                                                        rto
                                                    ).motivation
                                                }
                                            </td>
                                            <td>
                                                {
                                                    getRTOJustificationOfUser(
                                                        rto
                                                    ).motivationDescription
                                                }
                                            </td>
                                        </tr>
                                    ))}
                            {getNextRTOs() !== null &&
                                getNextRTOs()!
                                    .sort(
                                        (a, b) =>
                                            getDate(a.date).getTime() -
                                            getDate(b.date).getTime()
                                    )
                                    .map((rto) => (
                                        <tr key={rto.date}>
                                            <td>
                                                {getDate(
                                                    rto.date
                                                ).toLocaleDateString()}{" "}
                                                ore{" "}
                                                {getDate(rto.date)
                                                    .getHours()
                                                    .toString()
                                                    .padStart(2, "0")}
                                                :
                                                {getDate(rto.date)
                                                    .getMinutes()
                                                    .toString()
                                                    .padStart(2, "0")}
                                            </td>
                                            <td>{rto.description}</td>
                                            <td>
                                                <Button
                                                    variant={
                                                        isUserJustifiedToRTO(
                                                            rto
                                                        )
                                                            ? "success"
                                                            : "primary"
                                                    }
                                                    disabled={isUserJustifiedToRTO(
                                                        rto
                                                    )}
                                                    onClick={() =>
                                                        handleActionClick(rto)
                                                    }
                                                >
                                                    Giustifica
                                                </Button>
                                            </td>
                                            <td>
                                                {isUserJustifiedToRTO(rto)
                                                    ? getRTOJustificationOfUser(
                                                          rto
                                                      ).motivation
                                                    : ""}
                                            </td>
                                            <td>
                                                {isUserJustifiedToRTO(rto)
                                                    ? getRTOJustificationOfUser(
                                                          rto
                                                      ).motivationDescription
                                                    : ""}
                                            </td>
                                        </tr>
                                    ))}
                        </tbody>
                    </table>

                    <Modal
                        show={showModal}
                        onHide={handleCloseModal}
                        size="lg"
                        // centered
                    >
                        <Modal.Header closeButton>
                            {selectedRTO.date.length > 0 && (
                                <Modal.Title>
                                    Giustifica RTO del{" "}
                                    {getDate(
                                        selectedRTO.date
                                    ).toLocaleDateString()}{" "}
                                    ore{" "}
                                    {getDate(selectedRTO.date)
                                        .getHours()
                                        .toString()
                                        .padStart(2, "0")}
                                    :
                                    {getDate(selectedRTO.date)
                                        .getMinutes()
                                        .toString()
                                        .padStart(2, "0")}
                                </Modal.Title>
                            )}
                        </Modal.Header>
                        <Modal.Body>
                            <br />
                            <div className="form-group">
                                <div className="select-wrapper">
                                    <label htmlFor="defaultSelect">
                                        Motivo Assenza
                                    </label>
                                    <select
                                        id="defaultSelect"
                                        value={selectedOption}
                                        onChange={(e) =>
                                            setSelectedOption(e.target.value)
                                        }
                                        required
                                    >
                                        <option value="">
                                            Seleziona un motivo
                                        </option>
                                        <option value="WEEKEND">WEEKEND</option>
                                        <option value="FAMILIARI">
                                            FAMILIARI
                                        </option>
                                        <option value="STUDIO">STUDIO</option>
                                        <option value="LAVORO">LAVORO</option>
                                        <option value="MALATTIA">
                                            MALATTIA
                                        </option>
                                        <option value="INCARICO AIA">
                                            INCARICO AIA
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div className="textarea-container">
                                <textarea
                                    value={textAreaValue}
                                    onChange={(e) =>
                                        setTextAreaValue(e.target.value)
                                    }
                                    className="form-control"
                                    placeholder="Approfondisci motivo..."
                                    rows={5}
                                ></textarea>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                onClick={handleCloseModal}
                            >
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleSave}>
                                Submit
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Toast
                        show={showToast}
                        onClose={() => setShowToast(false)}
                        className="position-fixed top-0 end-0 m-3"
                        autohide
                        delay={5000}
                        bg="success"
                    >
                        <Toast.Header closeButton={false}>
                            <BsCheckCircle className="me-2" />
                            <strong className="me-auto">Success</strong>
                        </Toast.Header>
                        <Toast.Body style={{ color: "white" }}>
                            Giustifica processata correttamente
                        </Toast.Body>
                    </Toast>
                </div>
            </div>
        </>
    );
};

export default RTOHome;
