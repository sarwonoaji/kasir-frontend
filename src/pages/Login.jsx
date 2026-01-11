import { useState } from "react";
import api from "../lib/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch {
      alert("Login gagal");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Login Kasir</h2>

      <input
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
      /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      /><br />

      <button onClick={submit}>Login</button>
    </div>
  );
}
