import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // clear error while typing
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back 👋</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <div className="password-wrapper">
          <input
            type={show ? "text" : "password"}
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="password-input"
          />

          <button
            type="button"
            className="eye-btn"
            onClick={() => setShow(!show)}
          >
            {show ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <p className="error-text">{error}</p>

        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>

        <p className="bottom-text">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")}>Register</span>
        </p>
      </div>
    </div>
  );
}

export default Login;