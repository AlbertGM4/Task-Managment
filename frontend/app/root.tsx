import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "./tailwind.css";
//import styles from "./styles/global.css";
import Nav from "./components/nav"; // Importamos el componente de navegación


import type { LinksFunction } from "@remix-run/node";
import { TaskProvider } from "./contexts/taskContext";


export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  /* {
    rel: "stylesheet",
    href: styles,
  }, */
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <TaskProvider>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body>
          <Nav />
          {children}
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </TaskProvider>
  );
}

export default function App() {
  return <Outlet />;
}
