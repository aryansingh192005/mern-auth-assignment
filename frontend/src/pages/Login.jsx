import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await api.post("/auth/login", form);

      localStorage.setItem(
        "accessToken",
        res.data.accessToken
      );

      navigate("/dashboard");

    } catch (err) {

      alert(err.response?.data?.message || "Login Failed");

    }

  };

  return (

    <div className="container">

      <div className="card">

        <h2>Login</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button>Login</button>

        </form>

        <p>
          New User?
          <Link to="/register"> Register</Link>
        </p>

      </div>

    </div>

  );

}

export default Login;