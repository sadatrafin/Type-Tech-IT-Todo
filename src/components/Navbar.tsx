"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import Container from "./Container";

interface NavLinkItem {
  path: string;
  label: string;
}

const navLinks: NavLinkItem[] = [
  { path: "/", label: "Todo App" },
  { path: "/Server-Site-Fetch", label: "Server Site Fetch" },
  { path: "/Client-Site-Fetch", label: "Client Site Fetch" },
];

const Header: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const pathname = usePathname();

  const menuItems = (
    <>
      {navLinks.map((link) => {
        const isActive = pathname === link.path;
        return (
          <li key={link.path}>
            <Link
              href={link.path}
              className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </>
  );

  return (
    <header className="py-3 bg-white sticky top-0 left-0 w-full z-50 shadow">
      <Container>
        <nav className="flex justify-start md:justify-center items-center">
          <ul className="hidden md:flex gap-5 p-2">
            {menuItems}
          </ul>

          <button
            onClick={() => setOpen((prev) => !prev)}
            className="md:hidden text-2xl cursor-pointer text-slate-500 hover:text-indigo-600 transition-colors"
            aria-label="Toggle Menu"
            aria-expanded={open}
          >
            <Menu />
          </button>
        </nav>

        {open && (
          <div className="md:hidden mt-4 pb-2 border-t border-gray-200">
            <ul className="text-center space-y-4 pt-4 flex flex-col items-center">
              {menuItems}
            </ul>
          </div>
        )}
      </Container>
    </header>
  );
};

export default Header;
