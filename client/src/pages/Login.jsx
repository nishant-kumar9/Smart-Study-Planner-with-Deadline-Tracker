import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { setStoredUser } from "../services/userStorage";
import { API_URL } from "../config/api";
import useDocumentTitle from "../hooks/useDocumentTitle";

function Login() {
  useDocumentTitle("Login");

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
      const res = await axios.post(`${API_URL}/auth/login`, form);
      localStorage.setItem("token", res.data.token);
      if (res.data.user) {
        setStoredUser(res.data.user);
      }
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <div className="auth-info">
          <h2>Welcome back</h2>
          <p>Continue planning your study sessions and deadline goals.</p>

          <div className="auth-points">
            <span>Organize tasks by priority</span>
            <span>Track pending and completed progress</span>
            <span>Stay focused with deadline clarity</span>
          </div>
        </div>

        <form
          className="auth-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <h3>Sign in</h3>
          <p>Access your planner dashboard.</p>

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
          />

          <div className="password-wrapper">
            <input
              type={show ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
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

          <button className="auth-cta" type="submit">
            Login
          </button>

          <p className="bottom-text">
            Do not have an account? <span onClick={() => navigate("/register")}>Register</span>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Login;