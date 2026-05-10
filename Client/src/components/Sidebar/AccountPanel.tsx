import { useState } from "react";

type AccountMode = "register" | "login" | "loggedIn";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5195";
const AUTH_TOKEN_STORAGE_KEY = "drunkenDragon.authToken";
const AUTH_NAME_STORAGE_KEY = "drunkenDragon.username";
const AUTH_CHANGED_EVENT = "drunkenDragon:authChanged";

type AuthResponse = {
  username: string;
  token: string;
};

function parseErrorMessage(text: string, fallback: string) {
  if (!text) return fallback;

  try {
    const error = JSON.parse(text) as unknown;

    if (error && typeof error === "object") {
      if ("errors" in error && error.errors && typeof error.errors === "object") {
        const messages = Object.values(error.errors)
          .flatMap((value) => (Array.isArray(value) ? value : [value]))
          .filter((value): value is string => typeof value === "string");

        if (messages.length > 0) {
          return messages.join(" ");
        }
      }

      if ("title" in error && typeof error.title === "string") {
        return error.title;
      }
    }
  } catch {
    return text;
  }

  return fallback;
}

async function postAuth(path: "register" | "login", body: object) {
  const response = await fetch(`${API_BASE_URL}/api/Auth/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(parseErrorMessage(text, `Failed to ${path}`));
  }

  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function getAuthResponse(result: unknown): AuthResponse | null {
  if (!result || typeof result !== "object") return null;
  if (!("username" in result) || !("token" in result)) return null;

  return {
    username: String(result.username),
    token: String(result.token),
  };
}

export function AccountPanel() {
  const [mode, setMode] = useState<AccountMode>(() =>
    localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) ? "loggedIn" : "register",
  );
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedInName, setLoggedInName] = useState(
    () => localStorage.getItem(AUTH_NAME_STORAGE_KEY) ?? "",
  );
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completeLogin = (auth: AuthResponse) => {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, auth.token);
    localStorage.setItem(AUTH_NAME_STORAGE_KEY, auth.username);
    setLoggedInName(auth.username);
    setMode("loggedIn");
    setPassword("");
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    try {
      await postAuth("register", { email, username, password });
      const result = await postAuth("login", { email, password });
      const auth = getAuthResponse(result);

      if (!auth) {
        throw new Error("Registration succeeded, but login did not return a token.");
      }

      completeLogin(auth);
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
      const auth = getAuthResponse(result);

      if (!auth) {
        throw new Error("Login did not return a token.");
      }

      completeLogin(auth);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(AUTH_NAME_STORAGE_KEY);
    setLoggedInName("");
    setMode("login");
    setStatus("");
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
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
