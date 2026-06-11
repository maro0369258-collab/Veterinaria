import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { a as auth, b as api } from "./router-BTF12xBW.js";
import "@tanstack/react-query";
import "socket.io-client";
function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    password: "",
    telefono: ""
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    if (auth.token) navigate({
      to: "/admin"
    });
  }, [navigate]);
  function set(k, v) {
    setForm((s) => ({
      ...s,
      [k]: v
    }));
  }
  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const body = mode === "login" ? {
        correo: form.correo,
        password: form.password
      } : form;
      const res = await api(`/api/auth/${mode === "login" ? "login" : "register"}`, {
        method: "POST",
        body: JSON.stringify(body)
      });
      auth.set(res.token, res.user);
      if (res.user?.rol === "admin") navigate({
        to: "/admin"
      });
      else if (res.user?.rol === "ganadero") navigate({
        to: "/ganadero"
      });
      else navigate({
        to: "/user"
      });
    } catch (err) {
      setError(translateError(err));
    } finally {
      setLoading(false);
    }
  }
  function translateError(err) {
    if (err instanceof Error) {
      const m = err.message || "";
      if (/Failed to fetch|NetworkError|network/i.test(m)) return "Error de red. Revisa tu conexión.";
      if (/401|Unauthorized/i.test(m)) return "No autorizado. Revisa tus credenciales.";
      if (/404|Not Found/i.test(m)) return "Recurso no encontrado.";
      if (/password/i.test(m) && /incorrect|invalid/i.test(m)) return "Contraseña incorrecta.";
      return m || "Error al procesar la solicitud.";
    }
    return "Error al procesar la solicitud.";
  }
  return /* @__PURE__ */ jsx("main", { className: "min-h-screen flex items-center justify-center px-4 py-10", children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-4xl", children: /* @__PURE__ */ jsxs("div", { className: "md:grid md:grid-cols-2 gap-8 items-center", children: [
    /* @__PURE__ */ jsxs("aside", { className: "hidden md:flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold", children: "Veterinaria Adler" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-1", children: "Mascotas, ganado y todo lo de tu vet" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4", children: [
        /* @__PURE__ */ jsx("img", { src: "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=0e7f3d2b6c8f8f0f3a2b6f6a2b6e9b0a", alt: "Perro", className: "rounded-lg shadow-lg w-full h-40 object-cover" }),
        /* @__PURE__ */ jsx("img", { src: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=9b4a6d1c7b9f1d3e2a5b6c7d8e9f0a1b", alt: "Gato", className: "rounded-lg shadow-lg w-full h-40 object-cover" }),
        /* @__PURE__ */ jsx("img", { src: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=3b8f6d1e2e7b9a6c4d5f6a8b9c0d1e2f", alt: "Ganado", className: "rounded-lg shadow-lg w-full h-40 object-cover" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center mb-6 md:hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-3xl shadow-lg shadow-primary/20", children: "🐾" }),
        /* @__PURE__ */ jsx("h1", { className: "text-4xl mt-4 font-bold", children: "Veterinaria Adler" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-1", children: "Mascotas, ganado y todo lo de tu vet" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "vet-card p-6", children: [
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2 p-1 rounded-full bg-muted mb-5", children: ["login", "register"].map((m) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setMode(m), className: "vet-tab", "data-active": mode === m, children: m === "login" ? "Iniciar sesión" : "Registrarse" }, m)) }),
        /* @__PURE__ */ jsxs("form", { onSubmit, className: "space-y-4", children: [
          mode === "register" && /* @__PURE__ */ jsx(Field, { label: "Nombre", icon: IconUser, children: /* @__PURE__ */ jsx("input", { className: "vet-input", value: form.nombre, onChange: (e) => set("nombre", e.target.value), required: true }) }),
          /* @__PURE__ */ jsx(Field, { label: "Correo", icon: IconMail, children: /* @__PURE__ */ jsx("input", { type: "email", className: "vet-input", value: form.correo, onChange: (e) => set("correo", e.target.value), required: true }) }),
          /* @__PURE__ */ jsx(Field, { label: "Contraseña", icon: IconLock, children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx("input", { type: showPassword ? "text" : "password", className: "vet-input pr-10", value: form.password, onChange: (e) => set("password", e.target.value), required: true }),
            /* @__PURE__ */ jsx("button", { type: "button", "aria-label": showPassword ? "Ocultar contraseña" : "Mostrar contraseña", className: "absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground", onClick: () => setShowPassword((s) => !s), children: showPassword ? "Ocultar" : "Mostrar" })
          ] }) }),
          mode === "register" && /* @__PURE__ */ jsx(Field, { label: "Teléfono", icon: IconPhone, children: /* @__PURE__ */ jsx("input", { className: "vet-input", value: form.telefono, onChange: (e) => set("telefono", e.target.value) }) }),
          error && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", children: error }),
          /* @__PURE__ */ jsx("button", { type: "submit", disabled: loading, className: "vet-btn vet-btn-primary w-full", children: loading ? "…" : mode === "login" ? "Entrar" : "Crear cuenta" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground text-center mt-5", children: [
        "¿Ya tienes sesión? ",
        /* @__PURE__ */ jsx(Link, { to: "/admin", className: "underline", children: "Ir al panel" })
      ] })
    ] })
  ] }) }) });
}
function Field({
  label,
  children,
  icon
}) {
  return /* @__PURE__ */ jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsx("span", { className: "block text-sm font-semibold mb-1.5", children: label }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      icon && /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: icon }),
      /* @__PURE__ */ jsx("div", { className: "flex-1", children })
    ] })
  ] });
}
const IconUser = /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": true, children: [
  /* @__PURE__ */ jsx("path", { d: "M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }),
  /* @__PURE__ */ jsx("path", { d: "M20 21v-1c0-2.761-4.03-5-8-5s-8 2.239-8 5v1", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })
] });
const IconMail = /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": true, children: [
  /* @__PURE__ */ jsx("path", { d: "M3 8.5v7A2.5 2.5 0 0 0 5.5 18h13a2.5 2.5 0 0 0 2.5-2.5v-7", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }),
  /* @__PURE__ */ jsx("path", { d: "M21 6.5a2.5 2.5 0 0 0-2.5-2.5h-13A2.5 2.5 0 0 0 3 6.5v.5l9 6 9-6v-.5z", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })
] });
const IconLock = /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": true, children: [
  /* @__PURE__ */ jsx("rect", { x: "3", y: "11", width: "18", height: "10", rx: "2", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }),
  /* @__PURE__ */ jsx("path", { d: "M7 11V8a5 5 0 0 1 10 0v3", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })
] });
const IconPhone = /* @__PURE__ */ jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12 1.21.37 2.39.73 3.5a2 2 0 0 1-.45 2.11L8.09 10.91a16 16 0 0 0 6 6l1.58-1.3a2 2 0 0 1 2.11-.45c1.11.36 2.29.61 3.5.73A2 2 0 0 1 22 16.92z", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round", strokeLinejoin: "round" }) });
export {
  AuthPage as component
};
