import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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
      await axios.post("http://localhost:5000/api/auth/register", form);
      navigate("/");
    } catch {
      setError("Registration failed");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create Account 🚀</h2>

        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />

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

        <div className="password-rules">
          • At least 6 characters <br />
          • One uppercase letter <br />
          • One number
        </div>

        <div className="strength">Strength: {strength}</div>

        <p className="error-text">{error}</p>

        <button className="register-btn" onClick={handleRegister}>
          Register
        </button>

        <p className="bottom-text">
          Already have an account?{" "}
          <span onClick={() => navigate("/")}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default Register;