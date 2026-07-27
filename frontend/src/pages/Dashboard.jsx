import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Dashboard() {

  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const token = localStorage.getItem("accessToken");

        const res = await api.get("/auth/dashboard");

        setMessage(res.data.message);

      } catch (err) {

        alert("Unauthorized");

        navigate("/login");

      }

    };

    fetchDashboard();

  }, []);

  const logout = async () => {

    await api.post("/auth/logout");

    localStorage.removeItem("accessToken");

    navigate("/login");

  };

  return (

    <div className="container">

      <div className="card">

        <h1>{message}</h1>

        <h3>Protected Dashboard</h3>

        <button onClick={logout}>
          Logout
        </button>

      </div>

    </div>

  );

}

export default Dashboard;