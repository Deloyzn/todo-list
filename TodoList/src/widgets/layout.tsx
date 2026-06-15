import { Outlet } from "react-router-dom";
import { Header } from "./header/Header";

export function Layout() {
  return (
    <div className="div-container">
      <header><Header /></header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}