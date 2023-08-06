import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/login/Login";
import RTOHome from "./components/rto/RTOHome";
import { ToastContainer } from "react-bootstrap";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/rto" element={<RTOHome />} />
            </Routes>
            <ToastContainer />
        </>
    );
}

export default App;
