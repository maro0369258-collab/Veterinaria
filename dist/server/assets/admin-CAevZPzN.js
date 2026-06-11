import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import { a as auth, b as api } from "./router-BTF12xBW.js";
import "@tanstack/react-query";
const TABS = [{
  id: "resumen",
  label: "Resumen"
}, {
  id: "usuarios",
  label: "Usuarios"
}, {
  id: "mascotas",
  label: "Mascotas"
}, {
  id: "citas",
  label: "Citas"
}, {
  id: "pedidos",
  label: "Pedidos"
}, {
  id: "ganado",
  label: "Ganado"
}, {
  id: "inventario",
  label: "Inventario"
}];
function AdminPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("resumen");
  const [resumen, setResumen] = useState(null);
  useEffect(() => {
    const u = auth.user;
    if (!u) {
      navigate({
        to: "/"
      });
      return;
    }
    setUser(u);
  }, [navigate]);
  const loadResumen = useCallback(async () => {
    try {
      setResumen(await api("/api/resumen"));
    } catch {
    }
  }, []);
  useEffect(() => {
    loadResumen();
  }, [loadResumen]);
  useEffect(() => {
    const socket = io("http://localhost:4000");
    socket.on("connect", () => {
      socket.emit("join", "admin");
    });
    socket.on("payment:update", (data) => {
      loadResumen();
    });
    return () => {
      socket.emit("leave", "admin");
      socket.disconnect();
    };
  }, [loadResumen]);
  function logout() {
    auth.clear();
    navigate({
      to: "/"
    });
  }
  if (!user) return null;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxs("header", { className: "px-6 py-5 flex items-center justify-between max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-xl", children: "🐾" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Veterinaria Adler" }),
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold leading-tight", children: "Panel de administración" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsx("p", { className: "font-semibold leading-tight", children: user.nombre }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground capitalize", children: user.rol })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: logout, className: "vet-btn vet-btn-ghost", children: "Salir" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("main", { className: "px-6 pb-12 max-w-7xl mx-auto space-y-5", children: [
      /* @__PURE__ */ jsx(StatGrid, { r: resumen }),
      /* @__PURE__ */ jsx("nav", { className: "flex flex-wrap gap-2", children: TABS.map((t) => /* @__PURE__ */ jsx("button", { className: "vet-tab", "data-active": tab === t.id, onClick: () => setTab(t.id), children: t.label }, t.id)) }),
      tab === "resumen" && /* @__PURE__ */ jsx(ResumenTab, { r: resumen }),
      tab === "usuarios" && /* @__PURE__ */ jsx(UsuariosTab, { onChange: loadResumen }),
      tab === "mascotas" && /* @__PURE__ */ jsx(MascotasTab, { onChange: loadResumen }),
      tab === "citas" && /* @__PURE__ */ jsx(CitasTab, { onChange: loadResumen }),
      tab === "pedidos" && /* @__PURE__ */ jsx(PedidosTab, {}),
      tab === "ganado" && /* @__PURE__ */ jsx(GanadoTab, {}),
      tab === "inventario" && /* @__PURE__ */ jsx(InventarioTab, { onChange: loadResumen })
    ] })
  ] });
}
function StatGrid({
  r
}) {
  const items = [{
    icon: "👥",
    label: "Usuarios",
    value: r?.usuarios ?? 0
  }, {
    icon: "🐾",
    label: "Mascotas",
    value: r?.mascotas ?? 0
  }, {
    icon: "📅",
    label: "Citas",
    value: r?.citas ?? 0
  }, {
    icon: "🧾",
    label: "Pedidos pendientes",
    value: r?.pedidos_pendientes ?? 0
  }, {
    icon: "📦",
    label: "Productos",
    value: r?.productos ?? 0
  }];
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4", children: items.map((i) => /* @__PURE__ */ jsxs("div", { className: "vet-card px-4 py-4 flex items-center gap-3", children: [
    /* @__PURE__ */ jsx("span", { className: "text-2xl", children: i.icon }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold leading-none", children: i.value }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: i.label })
    ] })
  ] }, i.label)) });
}
function ResumenTab({
  r
}) {
  return /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-5", children: [
    /* @__PURE__ */ jsx(Section, { title: "Alertas de inventario", children: !r || r.alertas_inventario.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Todo el stock está en orden." }) : /* @__PURE__ */ jsx("ul", { className: "text-sm space-y-1", children: r.alertas_inventario.map((a) => /* @__PURE__ */ jsxs("li", { children: [
      /* @__PURE__ */ jsx("strong", { children: a.nombre }),
      " — stock ",
      a.stock,
      " (mín ",
      a.stock_min,
      ")"
    ] }, a.id)) }) }),
    /* @__PURE__ */ jsx(Section, { title: "Cirugías programadas", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "No hay cirugías programadas." }) })
  ] });
}
function UsuariosTab({
  onChange
}) {
  const [list, setList] = useState([]);
  const [f, setF] = useState({
    nombre: "",
    correo: "",
    password: "",
    telefono: "",
    rol: "user"
  });
  const load = useCallback(async () => setList(await api("/api/usuarios").catch(() => [])), []);
  useEffect(() => {
    load();
  }, [load]);
  async function create(e) {
    e.preventDefault();
    await api("/api/usuarios", {
      method: "POST",
      body: JSON.stringify(f)
    });
    setF({
      nombre: "",
      correo: "",
      password: "",
      telefono: "",
      rol: "user"
    });
    load();
    onChange();
  }
  async function del(id) {
    if (!confirm("¿Eliminar usuario?")) return;
    await api(`/api/usuarios/${id}`, {
      method: "DELETE"
    });
    load();
    onChange();
  }
  return /* @__PURE__ */ jsxs(Section, { title: "Crear usuario", children: [
    /* @__PURE__ */ jsxs("form", { onSubmit: create, className: "grid md:grid-cols-5 gap-3 mb-4", children: [
      /* @__PURE__ */ jsx("input", { className: "vet-input", placeholder: "Nombre", value: f.nombre, onChange: (e) => setF({
        ...f,
        nombre: e.target.value
      }), required: true }),
      /* @__PURE__ */ jsx("input", { className: "vet-input", placeholder: "Correo", value: f.correo, onChange: (e) => setF({
        ...f,
        correo: e.target.value
      }), required: true }),
      /* @__PURE__ */ jsx("input", { className: "vet-input", placeholder: "Contraseña", type: "password", value: f.password, onChange: (e) => setF({
        ...f,
        password: e.target.value
      }), required: true }),
      /* @__PURE__ */ jsx("input", { className: "vet-input", placeholder: "Teléfono", value: f.telefono, onChange: (e) => setF({
        ...f,
        telefono: e.target.value
      }) }),
      /* @__PURE__ */ jsxs("select", { className: "vet-input", value: f.rol, onChange: (e) => setF({
        ...f,
        rol: e.target.value
      }), children: [
        /* @__PURE__ */ jsx("option", { value: "user", children: "Usuario" }),
        /* @__PURE__ */ jsx("option", { value: "admin", children: "Admin" }),
        /* @__PURE__ */ jsx("option", { value: "ganadero", children: "Ganadero" })
      ] }),
      /* @__PURE__ */ jsx("button", { className: "vet-btn vet-btn-primary md:col-span-1", children: "+ Crear" })
    ] }),
    /* @__PURE__ */ jsx(Table, { cols: ["Nombre", "Correo", "Rol", "Tel", ""], children: list.map((u) => /* @__PURE__ */ jsxs("tr", { className: "border-t border-border/60", children: [
      /* @__PURE__ */ jsx("td", { className: "py-3 font-semibold", children: u.nombre }),
      /* @__PURE__ */ jsx("td", { children: u.correo }),
      /* @__PURE__ */ jsx("td", { className: "capitalize", children: u.rol }),
      /* @__PURE__ */ jsx("td", { children: u.telefono || "—" }),
      /* @__PURE__ */ jsx("td", { className: "text-right", children: /* @__PURE__ */ jsx("button", { className: "vet-link-danger", onClick: () => del(u.id), children: "Eliminar" }) })
    ] }, u.id)) })
  ] });
}
function MascotasTab({
  onChange
}) {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({
    nombre: "",
    especie: "",
    especie_otro: "",
    raza: "",
    edad: ""
  });
  const load = useCallback(async () => setList(await api("/api/mascotas").catch(() => [])), []);
  useEffect(() => {
    load();
  }, [load]);
  async function create(e) {
    e.preventDefault();
    const especieFinal = f.especie === "Otro" ? f.especie_otro || "Otro" : f.especie;
    await api("/api/mascotas", {
      method: "POST",
      body: JSON.stringify({
        ...f,
        especie: especieFinal,
        edad: f.edad ? f.edad : null
      })
    });
    setF({
      nombre: "",
      especie: "",
      raza: "",
      edad: ""
    });
    setOpen(false);
    load();
    onChange();
  }
  async function del(id) {
    if (!confirm("¿Eliminar?")) return;
    await api(`/api/mascotas/${id}`, {
      method: "DELETE"
    });
    load();
    onChange();
  }
  return /* @__PURE__ */ jsxs(Section, { title: `Mascotas registradas (${list.length})`, action: /* @__PURE__ */ jsx("button", { className: "vet-btn vet-btn-primary", onClick: () => setOpen((v) => !v), children: "+ Registrar mascota" }), children: [
    open && /* @__PURE__ */ jsxs("form", { onSubmit: create, className: "grid md:grid-cols-4 gap-3 mb-4", children: [
      /* @__PURE__ */ jsx("input", { className: "vet-input", placeholder: "Nombre", value: f.nombre, onChange: (e) => setF({
        ...f,
        nombre: e.target.value
      }), required: true }),
      /* @__PURE__ */ jsxs("select", { className: "vet-input", value: f.especie, onChange: (e) => setF({
        ...f,
        especie: e.target.value
      }), required: true, children: [
        /* @__PURE__ */ jsx("option", { value: "", children: "— Especie —" }),
        /* @__PURE__ */ jsx("option", { value: "Perro", children: "Perro" }),
        /* @__PURE__ */ jsx("option", { value: "Gato", children: "Gato" }),
        /* @__PURE__ */ jsx("option", { value: "Bovino", children: "Bovino" }),
        /* @__PURE__ */ jsx("option", { value: "Otro", children: "Otro" })
      ] }),
      f.especie === "Otro" && /* @__PURE__ */ jsx("input", { className: "vet-input", placeholder: "Especie (otra)", value: f.especie_otro, onChange: (e) => setF({
        ...f,
        especie_otro: e.target.value
      }), required: true }),
      /* @__PURE__ */ jsx("input", { className: "vet-input", placeholder: "Raza", value: f.raza, onChange: (e) => setF({
        ...f,
        raza: e.target.value
      }) }),
      /* @__PURE__ */ jsx("input", { className: "vet-input", placeholder: "Edad (ej. '2 años' o '6 meses')", type: "text", value: f.edad, onChange: (e) => setF({
        ...f,
        edad: e.target.value
      }) }),
      /* @__PURE__ */ jsx("button", { className: "vet-btn vet-btn-primary", children: "Guardar" })
    ] }),
    list.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Sin mascotas." }) : /* @__PURE__ */ jsx(Table, { cols: ["Nombre", "Especie", "Raza", "Edad", "Dueño", ""], children: list.map((m) => /* @__PURE__ */ jsxs("tr", { className: "border-t border-border/60", children: [
      /* @__PURE__ */ jsx("td", { className: "py-3 font-semibold", children: m.nombre }),
      /* @__PURE__ */ jsx("td", { children: m.especie }),
      /* @__PURE__ */ jsx("td", { children: m.raza || "—" }),
      /* @__PURE__ */ jsx("td", { children: m.edad ?? "—" }),
      /* @__PURE__ */ jsx("td", { children: m.dueno_nombre }),
      /* @__PURE__ */ jsx("td", { className: "text-right", children: /* @__PURE__ */ jsx("button", { className: "vet-link-danger", onClick: () => del(m.id), children: "Eliminar" }) })
    ] }, m.id)) })
  ] });
}
function CitasTab({
  onChange
}) {
  const [list, setList] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [f, setF] = useState({
    cliente_id: "",
    mascota_id: "",
    fecha: "",
    hora: "",
    motivo: ""
  });
  const load = useCallback(async () => {
    setList(await api("/api/citas").catch(() => []));
    setMascotas(await api("/api/mascotas").catch(() => []));
    setClientes(await api("/api/usuarios").catch(() => []));
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  async function create(e) {
    e.preventDefault();
    await api("/api/citas", {
      method: "POST",
      body: JSON.stringify({
        ...f,
        cliente_id: Number(f.cliente_id),
        mascota_id: Number(f.mascota_id)
      })
    });
    setF({
      cliente_id: "",
      mascota_id: "",
      fecha: "",
      hora: "",
      motivo: ""
    });
    load();
    onChange();
  }
  async function setEstado(id, estado) {
    await api(`/api/citas/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        estado
      })
    });
    load();
  }
  return /* @__PURE__ */ jsxs(Section, { title: "Agendar cita", children: [
    /* @__PURE__ */ jsxs("form", { onSubmit: create, className: "grid md:grid-cols-5 gap-3 mb-4", children: [
      /* @__PURE__ */ jsxs("select", { className: "vet-input", value: f.cliente_id, onChange: (e) => setF({
        ...f,
        cliente_id: e.target.value
      }), required: true, children: [
        /* @__PURE__ */ jsx("option", { value: "", children: "— Cliente —" }),
        clientes.map((c) => /* @__PURE__ */ jsx("option", { value: c.id, children: c.nombre }, c.id))
      ] }),
      /* @__PURE__ */ jsxs("select", { className: "vet-input", value: f.mascota_id, onChange: (e) => setF({
        ...f,
        mascota_id: e.target.value
      }), required: true, children: [
        /* @__PURE__ */ jsx("option", { value: "", children: "— Mascota —" }),
        mascotas.map((m) => /* @__PURE__ */ jsx("option", { value: m.id, children: m.nombre }, m.id))
      ] }),
      /* @__PURE__ */ jsx("input", { className: "vet-input", type: "date", value: f.fecha, onChange: (e) => setF({
        ...f,
        fecha: e.target.value
      }), required: true }),
      /* @__PURE__ */ jsx("input", { className: "vet-input", type: "time", value: f.hora, onChange: (e) => setF({
        ...f,
        hora: e.target.value
      }), required: true }),
      /* @__PURE__ */ jsx("input", { className: "vet-input", placeholder: "Motivo", value: f.motivo, onChange: (e) => setF({
        ...f,
        motivo: e.target.value
      }), required: true }),
      /* @__PURE__ */ jsx("button", { className: "vet-btn vet-btn-primary", children: "+ Agendar" })
    ] }),
    list.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Sin citas." }) : /* @__PURE__ */ jsx(Table, { cols: ["Fecha", "Cliente", "Mascota", "Motivo", "Estado"], children: list.map((c) => /* @__PURE__ */ jsxs("tr", { className: "border-t border-border/60", children: [
      /* @__PURE__ */ jsxs("td", { className: "py-3", children: [
        c.fecha,
        " ",
        c.hora
      ] }),
      /* @__PURE__ */ jsx("td", { children: c.cliente_nombre }),
      /* @__PURE__ */ jsx("td", { children: c.mascota_nombre }),
      /* @__PURE__ */ jsx("td", { children: c.motivo }),
      /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("select", { className: "vet-input", value: c.estado, onChange: (e) => setEstado(c.id, e.target.value), children: [
        /* @__PURE__ */ jsx("option", { value: "pendiente", children: "pendiente" }),
        /* @__PURE__ */ jsx("option", { value: "confirmada", children: "confirmada" }),
        /* @__PURE__ */ jsx("option", { value: "realizada", children: "realizada" }),
        /* @__PURE__ */ jsx("option", { value: "cancelada", children: "cancelada" })
      ] }) })
    ] }, c.id)) })
  ] });
}
function PedidosTab() {
  const [list, setList] = useState([]);
  const load = useCallback(async () => setList(await api("/api/pedidos").catch(() => [])), []);
  useEffect(() => {
    load();
  }, [load]);
  const total = list.reduce((s, p) => s + Number(p.total), 0);
  const sinTicket = list.filter((p) => !p.ticket_enviado).length;
  async function enviarTicket(id) {
    await api(`/api/pedidos/${id}/ticket`, {
      method: "PATCH"
    });
    load();
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "vet-card px-5 py-4 flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Ventas totales" }),
        /* @__PURE__ */ jsxs("p", { className: "text-2xl font-bold text-primary", children: [
          "$",
          total.toFixed(0)
        ] })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
        list.length,
        " pedidos · ",
        sinTicket,
        " sin ticket enviado"
      ] })
    ] }),
    /* @__PURE__ */ jsx(Section, { title: "Pedidos", children: list.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground text-center py-6", children: "Aún no hay pedidos." }) : /* @__PURE__ */ jsx(Table, { cols: ["Fecha", "Cliente", "Total", "Estado", "Ticket"], children: list.map((p) => /* @__PURE__ */ jsxs("tr", { className: "border-t border-border/60", children: [
      /* @__PURE__ */ jsx("td", { className: "py-3", children: p.creado_en }),
      /* @__PURE__ */ jsx("td", { children: p.cliente_nombre }),
      /* @__PURE__ */ jsxs("td", { children: [
        "$",
        Number(p.total).toFixed(2)
      ] }),
      /* @__PURE__ */ jsx("td", { children: p.estado }),
      /* @__PURE__ */ jsx("td", { children: p.ticket_enviado ? "✓ enviado" : /* @__PURE__ */ jsx("button", { className: "vet-btn vet-btn-ghost", onClick: () => enviarTicket(p.id), children: "Enviar" }) })
    ] }, p.id)) }) })
  ] });
}
function GanadoTab() {
  const [list, setList] = useState([]);
  const [f, setF] = useState({
    arete: "",
    tipo: "",
    especie: "",
    corral: "",
    sexo: "M",
    peso: ""
  });
  const load = useCallback(async () => setList(await api("/api/ganado").catch(() => [])), []);
  useEffect(() => {
    load();
  }, [load]);
  async function create(e) {
    e.preventDefault();
    await api("/api/ganado", {
      method: "POST",
      body: JSON.stringify({
        ...f,
        peso: f.peso ? Number(f.peso) : null
      })
    });
    setF({
      arete: "",
      tipo: "",
      especie: "",
      corral: "",
      sexo: "M",
      peso: ""
    });
    load();
  }
  async function del(id) {
    if (!confirm("¿Eliminar?")) return;
    await api(`/api/ganado/${id}`, {
      method: "DELETE"
    });
    load();
  }
  return /* @__PURE__ */ jsxs(Section, { title: `Ganado registrado (${list.length})`, children: [
    /* @__PURE__ */ jsxs("form", { onSubmit: create, className: "grid md:grid-cols-7 gap-3 mb-4", children: [
      /* @__PURE__ */ jsx("input", { className: "vet-input", placeholder: "Arete", value: f.arete, onChange: (e) => setF({
        ...f,
        arete: e.target.value
      }), required: true }),
      /* @__PURE__ */ jsx("input", { className: "vet-input", placeholder: "Tipo", value: f.tipo, onChange: (e) => setF({
        ...f,
        tipo: e.target.value
      }), required: true }),
      /* @__PURE__ */ jsx("input", { className: "vet-input", placeholder: "Especie", value: f.especie, onChange: (e) => setF({
        ...f,
        especie: e.target.value
      }), required: true }),
      /* @__PURE__ */ jsx("input", { className: "vet-input", placeholder: "Corral", value: f.corral, onChange: (e) => setF({
        ...f,
        corral: e.target.value
      }) }),
      /* @__PURE__ */ jsxs("select", { className: "vet-input", value: f.sexo, onChange: (e) => setF({
        ...f,
        sexo: e.target.value
      }), children: [
        /* @__PURE__ */ jsx("option", { value: "M", children: "M" }),
        /* @__PURE__ */ jsx("option", { value: "H", children: "H" })
      ] }),
      /* @__PURE__ */ jsx("input", { className: "vet-input", placeholder: "Peso (kg)", type: "number", value: f.peso, onChange: (e) => setF({
        ...f,
        peso: e.target.value
      }) }),
      /* @__PURE__ */ jsx("button", { className: "vet-btn vet-btn-primary", children: "+ Agregar" })
    ] }),
    list.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Sin registros." }) : /* @__PURE__ */ jsx(Table, { cols: ["Arete", "Tipo", "Especie", "Corral", "Sexo", "Peso", "Ganadero", ""], children: list.map((g) => /* @__PURE__ */ jsxs("tr", { className: "border-t border-border/60", children: [
      /* @__PURE__ */ jsx("td", { className: "py-3 font-semibold", children: g.arete }),
      /* @__PURE__ */ jsx("td", { children: g.tipo }),
      /* @__PURE__ */ jsx("td", { children: g.especie }),
      /* @__PURE__ */ jsx("td", { children: g.corral || "—" }),
      /* @__PURE__ */ jsx("td", { children: g.sexo }),
      /* @__PURE__ */ jsx("td", { children: g.peso ?? "—" }),
      /* @__PURE__ */ jsx("td", { children: g.ganadero_nombre }),
      /* @__PURE__ */ jsx("td", { className: "text-right", children: /* @__PURE__ */ jsx("button", { className: "vet-link-danger", onClick: () => del(g.id), children: "Eliminar" }) })
    ] }, g.id)) })
  ] });
}
function InventarioTab({
  onChange
}) {
  const [list, setList] = useState([]);
  const [f, setF] = useState({
    nombre: "",
    categoria: "",
    stock: "0",
    unidad: "pza",
    precio: "0",
    stock_min: "1"
  });
  const load = useCallback(async () => setList(await api("/api/productos").catch(() => [])), []);
  useEffect(() => {
    load();
  }, [load]);
  async function create(e) {
    e.preventDefault();
    await api("/api/productos", {
      method: "POST",
      body: JSON.stringify({
        nombre: f.nombre,
        categoria: f.categoria,
        unidad: f.unidad,
        stock: Number(f.stock),
        precio: Number(f.precio),
        stock_min: Number(f.stock_min)
      })
    });
    setF({
      nombre: "",
      categoria: "",
      stock: "0",
      unidad: "pza",
      precio: "0",
      stock_min: "1"
    });
    load();
    onChange();
  }
  async function updateStock(id, stock) {
    await api(`/api/productos/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        stock
      })
    });
    load();
    onChange();
  }
  async function del(id) {
    if (!confirm("¿Eliminar?")) return;
    await api(`/api/productos/${id}`, {
      method: "DELETE"
    });
    load();
    onChange();
  }
  return /* @__PURE__ */ jsxs(Section, { title: "Inventario de la veterinaria", children: [
    /* @__PURE__ */ jsxs("form", { onSubmit: create, className: "grid md:grid-cols-6 gap-3 mb-4", children: [
      /* @__PURE__ */ jsx("input", { className: "vet-input", placeholder: "Producto", value: f.nombre, onChange: (e) => setF({
        ...f,
        nombre: e.target.value
      }), required: true }),
      /* @__PURE__ */ jsx("input", { className: "vet-input", placeholder: "Categoría", value: f.categoria, onChange: (e) => setF({
        ...f,
        categoria: e.target.value
      }) }),
      /* @__PURE__ */ jsx("input", { className: "vet-input", placeholder: "0", type: "number", value: f.stock, onChange: (e) => setF({
        ...f,
        stock: e.target.value
      }) }),
      /* @__PURE__ */ jsx("input", { className: "vet-input", placeholder: "pza", value: f.unidad, onChange: (e) => setF({
        ...f,
        unidad: e.target.value
      }) }),
      /* @__PURE__ */ jsx("input", { className: "vet-input", placeholder: "0", type: "number", value: f.precio, onChange: (e) => setF({
        ...f,
        precio: e.target.value
      }) }),
      /* @__PURE__ */ jsx("input", { className: "vet-input", placeholder: "1", type: "number", value: f.stock_min, onChange: (e) => setF({
        ...f,
        stock_min: e.target.value
      }) }),
      /* @__PURE__ */ jsx("button", { className: "vet-btn vet-btn-primary md:col-span-1", children: "+ Agregar producto" })
    ] }),
    /* @__PURE__ */ jsx(Table, { cols: ["Producto", "Categoría", "Stock", "", "Precio", ""], children: list.map((p) => /* @__PURE__ */ jsxs("tr", { className: "border-t border-border/60", children: [
      /* @__PURE__ */ jsx("td", { className: "py-3 font-semibold", children: p.nombre }),
      /* @__PURE__ */ jsx("td", { children: p.categoria || "—" }),
      /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("input", { className: "vet-input !w-20 !py-1", type: "number", defaultValue: p.stock, onBlur: (e) => updateStock(p.id, Number(e.target.value)) }) }),
      /* @__PURE__ */ jsx("td", { className: "text-muted-foreground", children: p.unidad }),
      /* @__PURE__ */ jsxs("td", { children: [
        "$",
        Number(p.precio).toFixed(0)
      ] }),
      /* @__PURE__ */ jsx("td", { className: "text-right", children: /* @__PURE__ */ jsx("button", { className: "vet-link-danger", onClick: () => del(p.id), children: "Eliminar" }) })
    ] }, p.id)) })
  ] });
}
function Section({
  title,
  action,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { className: "vet-card p-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold", children: title }),
      action
    ] }),
    children
  ] });
}
function Table({
  cols,
  children
}) {
  return /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
    /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { className: "text-left text-muted-foreground", children: cols.map((c, i) => /* @__PURE__ */ jsx("th", { className: "font-semibold pb-2", children: c }, i)) }) }),
    /* @__PURE__ */ jsx("tbody", { children })
  ] }) });
}
export {
  AdminPage as component
};
