import { useAppSelector } from "../../hooks/redux-hooks";
import "./Header.css";

const Header = () => {
    const user = useAppSelector((state) => state.users.currentUser);
    return (
        <div className="it-header-center-wrapper it-big-header">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-5">
                        <div className="it-header-center-content-wrapper">
                            <div className="it-brand-wrapper">
                                <a href="#">
                                    <img
                                        src="logoAIAMantova.png"
                                        alt="logo"
                                        className="it-brand-logo"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-7">
                        <div
                            className="it-header-center-content-wrapper"
                            style={{ textAlign: "center" }}
                        >
                            <div className="it-brand-wrapper">
                                <a href="#">
                                    <div className="it-brand-text">
                                        <div className="it-brand-title">
                                            {user.name + " " + user.surname}
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
