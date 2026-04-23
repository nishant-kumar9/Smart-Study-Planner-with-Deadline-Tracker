import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { API_URL } from "../config/api";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [strength, setStrength] = useState("Enter password");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");

    if (name === "password") checkStrength(value);
  };

  const checkStrength = (password) => {
    if (!password) return setStrength("Enter password");
    if (password.length < 6) return setStrength("Weak");
    if (/[A-Z]/.test(password) && /\d/.test(password))
      return setStrength("Strong");
    return setStrength("Medium");
  };

  const handleRegister = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const strongPassword = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (!emailRegex.test(form.email)) {
      return setError("Enter a valid email");
    }

    if (!strongPassword.test(form.password)) {
      return setError("Password must include uppercase & number");
    }

    try {
      await axios.post(`${API_URL}/auth/register`, form);
      navigate("/");
    } catch {
      setError("Registration failed");
    }
  };

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <div className="auth-info">
          <h2>Create your account</h2>
          <p>Build a disciplined routine with your personalized study planner.</p>

          <div className="auth-points">
            <span>Set study tasks with deadlines</span>
            <span>Visualize completion and pending work</span>
            <span>Keep daily momentum with clear planning</span>
          </div>
        </div>

        <form
          className="auth-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <h3>Sign up</h3>
          <p>Create your planner workspace.</p>

          <input
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
          />
          <input
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
              onChange={handleChange}
              value={form.password}
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

          <div className="password-rules">
            At least 6 characters, one uppercase letter, and one number.
          </div>
          <div className="strength">Password strength: {strength}</div>

          <p className="error-text">{error}</p>

          <button className="auth-cta" type="submit">
            Register
          </button>

          <p className="bottom-text">
            Already have an account? <span onClick={() => navigate("/")}>Login</span>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Register;