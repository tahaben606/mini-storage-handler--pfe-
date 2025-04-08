import { useState } from "react";
import './login.css';

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
        name: name,
        email: email,
        password: password
    };

    try {
        const response = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error('Erreur lors de l\'inscription');
        }

        const data = await response.json();
        alert(`Inscription réussie : ${data.message}`);
    } catch (error) {
        alert(`Erreur : ${error.message}`);
    }
};

  return (
    <div className="container-login">
      <div className="login-box-login">
        <h2 className="login-title-login">Sign Up</h2>
        <form className="login-form-login" onSubmit={handleSubmit}>
          <div className="input-group-login">
            <label htmlFor="name" className="label-text-login">Name</label>
            <input
              id="name"
              type="text"
              className="input-field-login"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <h5 className="forgot-link-login">You have an account?</h5>
          <a href="login" className="forgot-link-login-button">Login</a>
          <button type="submit" className="login-button-login">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
