import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, useRouter, Link, Outlet, HeadContent, Scripts, createFileRoute, useNavigate, lazyRouteComponent, createRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
const appCss = "/assets/styles-DId7l8SG.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$4 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Veterinaria Adler — Panel de administración" },
      { name: "description", content: "Mascotas, ganado y todo lo de tu vet." },
      { property: "og:title", content: "Veterinaria Adler" },
      { property: "og:description", content: "Mascotas, ganado y todo lo de tu vet." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$4.useRouteContext();
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(Outlet, {}) });
}
const API_URL = "http://localhost:4000"?.replace(/\/$/, "") || "http://localhost:4000";
const TOKEN_KEY = "vet.token";
const USER_KEY = "vet.user";
const auth = {
  get token() {
    return typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY);
  },
  get user() {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  set(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};
async function api(path, init = {}) {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  const t = auth.token;
  if (t) headers.set("Authorization", `Bearer ${t}`);
  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(data && data.error || res.statusText);
  return data;
}
const Route$3 = createFileRoute("/user")({ component: UserPage });
function UserPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  useEffect(() => {
    const u = auth.user;
    if (!u) {
      navigate({ to: "/" });
      return;
    }
    setUser(u);
  }, [navigate]);
  const load = useCallback(async () => {
    setPedidos(await api("/api/pedidos").catch(() => []));
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    const socket = io("http://localhost:4000");
    socket.on("connect", () => {
      socket.emit("join", `user:${auth.user?.id}`);
      for (const p of pedidos) socket.emit("join", `pedido:${p.id}`);
    });
    socket.on("payment:update", (d) => {
      load();
    });
    return () => {
      socket.disconnect();
    };
  }, [load, pedidos]);
  if (!user) return null;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen p-6 max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "Panel de cliente" }),
      /* @__PURE__ */ jsxs("div", { className: "text-sm", children: [
        user.nombre,
        " · ",
        user.correo
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "vet-card p-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-semibold mb-3", children: "Mis pedidos" }),
      pedidos.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "No tienes pedidos." }) : /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: pedidos.map((p) => /* @__PURE__ */ jsxs("li", { className: "p-3 border rounded", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            "Pedido #",
            p.id,
            " — ",
            p.creado_en
          ] }),
          /* @__PURE__ */ jsx("div", { className: "capitalize", children: p.estado })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-sm text-muted-foreground", children: [
          "Total: $",
          Number(p.total).toFixed(2)
        ] })
      ] }, p.id)) })
    ] })
  ] });
}
const Route$2 = createFileRoute("/ganadero")({ component: GanaderoPage });
function GanaderoPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [list, setList] = useState([]);
  useEffect(() => {
    const u = auth.user;
    if (!u) {
      navigate({ to: "/" });
      return;
    }
    setUser(u);
  }, [navigate]);
  const load = useCallback(async () => {
    setList(await api("/api/ganado").catch(() => []));
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    const socket = io("http://localhost:4000");
    socket.on("connect", () => {
      socket.emit("join", "ganadero");
    });
    socket.on("ganado:update", () => {
      load();
    });
    return () => {
      socket.emit("leave", "ganadero");
      socket.disconnect();
    };
  }, [load]);
  if (!user) return null;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen p-6 max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "Panel Ganadero" }),
      /* @__PURE__ */ jsx("div", { className: "text-sm", children: user.nombre })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "vet-card p-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-semibold mb-3", children: "Ganado" }),
      list.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "No hay ganado registrado." }) : /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: list.map((g) => /* @__PURE__ */ jsxs("li", { className: "p-3 border rounded flex justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "font-semibold", children: [
            g.arete,
            " — ",
            g.tipo,
            " (",
            g.especie,
            ")"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-sm text-muted-foreground", children: [
            "Corral: ",
            g.corral || "—",
            " · Peso: ",
            g.peso || "—"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: g.ganadero_nombre })
      ] }, g.id)) })
    ] })
  ] });
}
const $$splitComponentImporter$1 = () => import("./admin-CAevZPzN.js");
const Route$1 = createFileRoute("/admin")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-DFHv_jPl.js");
const Route = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const UserRoute = Route$3.update({
  id: "/user",
  path: "/user",
  getParentRoute: () => Route$4
});
const GanaderoRoute = Route$2.update({
  id: "/ganadero",
  path: "/ganadero",
  getParentRoute: () => Route$4
});
const AdminRoute = Route$1.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$4
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$4
});
const rootRouteChildren = {
  IndexRoute,
  AdminRoute,
  GanaderoRoute,
  UserRoute
};
const routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  auth as a,
  api as b,
  router as r
};
