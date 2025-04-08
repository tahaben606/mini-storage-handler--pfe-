import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './login.css';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // hook to redirect

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      alert("Login successful!");

      // ✅ Redirect to home page
      navigate("/");
    } catch (err) {
      // ❌ Set error message clearly
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="container-login">
      <div className="login-box-login">
        <h2 className="login-title-login">Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form className="login-form-login" onSubmit={handleSubmit}>
          <div className="input-group-login">
            <label htmlFor="email" className="label-text-login">Email</label>
            <input
              id="email"
              type="email"
              className="input-field-login"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group-login">
            <label htmlFor="password" className="label-text-login">Password</label>
            <input
              id="password"
              type="password"
              className="input-field-login"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button-login">Login</button>
        </form>
      </div>
    </div>
  );
}
