import { useState } from "react";

type AccountMode = "register" | "login" | "loggedIn";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5195";

async function postAuth(path: "register" | "login", body: object) {
  const response = await fetch(`${API_BASE_URL}/api/Auth/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to ${path}`);
  }

  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

export function AccountPanel() {
  const [mode, setMode] = useState<AccountMode>("register");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedInName, setLoggedInName] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    try {
      await postAuth("register", { email, username, password });
      setLoggedInName(username || email);
      setMode("loggedIn");
      setPassword("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    try {
      const result = await postAuth("login", { email, password });
      const responseName =
        result && typeof result === "object" && "username" in result
          ? String(result.username)
          : "";

      setLoggedInName(responseName || email);
      setMode("loggedIn");
      setPassword("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    setLoggedInName("");
    setMode("login");
    setStatus("");
  };

  if (mode === "loggedIn") {
    return (
      <section className="account-panel account-panel-logged-in">
        <div className="account-identity">
          <h2>You are logged in as</h2>
          <p>{loggedInName}</p>
        </div>
        <div className="account-logout-area">
          <button className="account-submit" type="button" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </section>
    );
  }

  if (mode === "login") {
    return (
      <section className="account-panel">
        <form className="account-form account-form-login" onSubmit={handleLogin}>
          <h2>Log In</h2>
          <label className="account-field">
            <span>Email or Username</span>
            <input
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label className="account-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          <button className="account-submit" type="submit" disabled={isSubmitting}>
            Log In
          </button>
          {status && <p className="account-status">{status}</p>}
          <p className="account-switch">
            Don't have a profile?
            <button type="button" onClick={() => setMode("register")}>
              Register
            </button>
          </p>
        </form>
      </section>
    );
  }

  return (
    <section className="account-panel">
      <form className="account-form" onSubmit={handleRegister}>
        <h2>Register</h2>
        <label className="account-field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label className="account-field">
          <span>Username</span>
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label className="account-field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
          />
        </label>
        <button className="account-submit" type="submit" disabled={isSubmitting}>
          Register
        </button>
        {status && <p className="account-status">{status}</p>}
        <p className="account-switch">
          Already have a profile?
          <button type="button" onClick={() => setMode("login")}>
            Log In
          </button>
        </p>
      </form>
    </section>
  );
}
