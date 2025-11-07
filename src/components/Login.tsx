import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true); 
    console.log("Submitting login for:", import.meta.env.VITE_API_URL);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      login({ ...data?.user, token: data?.token });

      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="container m-5 text-white">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-5 primary-bck shadow-sm rounded-5">
            <h3 className="mb-3 text-center extraBold font-size-30px text-white">
              Join to Save & Revisit Your AI-Powered Summaries
            </h3>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="my-3">
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading} // <- DISABLED WHILE LOADING
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading} // <- DISABLED WHILE LOADING
                />
              </div>

              <button
                type="submit"
                className="btn primary-button bck-light-dark w-100"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                ) : null}
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
