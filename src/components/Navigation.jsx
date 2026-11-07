import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Icon } from "./Interface";

const links = [
  { to: "/", label: "Results", icon: "results" },
  { to: "/Standings", label: "Standings", icon: "standings" },
  { to: "/Schedule", label: "Schedule", icon: "schedule" },
  { to: "/Drivers", label: "Drivers", icon: "drivers" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <aside className="sidebar">
        <Link to="/" className="brand" aria-label="F1DV home">
          <img src="/helmet.svg" alt="Racing helmet" width="36" height="36" />
          <span>F1DV</span>
        </Link>
        <button
          className="mobile-menu Burger"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav
          id="main-nav"
          className={`main-nav ${open ? "is-open" : ""}`}
          aria-label="Main navigation"
        >
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `nav-link${isActive ? " is-active" : ""}`
              }
              onClick={() => setOpen(false)}
            >
              <Icon name={link.icon} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
