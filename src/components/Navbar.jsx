import { useState } from "react";

import { close, logo, menu } from "../assets";
import { navLinks } from "../constants";
import { Link, useMatch, useResolvedPath, useLocation } from "react-router-dom";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

const Navbar = () => {
  const path = useLocation().pathname.substring(1);
  const [active, setActive] = useState(path && path != "" ? path : "home");
  const [toggle, setToggle] = useState(false);
  const [nav, setNav] = useState(false);
  function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });

    return (
      <li className={isActive ? "active" : ""}>
        <Link to={to} {...props}>
          {children}
        </Link>
      </li>
    );
  }
  const handleNav = () => {
    setNav(!nav);
  };

  return (
    <div className="navbar flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-white">
      {/* Logo */}
      <Link to={"/"}>
        <img src={logo} alt="hoobank" className="w-[124px] h-[32px]" />
      </Link>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex">
        {navLinks.map((item, index) => {
          const resolvedPath = useResolvedPath(`${item.id}`);
          const isActive = useMatch({ path: resolvedPath.pathname, end: true });
          return (
            <li
              key={item.id}
              className={`p-4 cursor-pointer  ${
                isActive ? "text-white" : "text-dimWhite"
              } ${index === navLinks.length - 1 ? "mr-0" : "mr-10"}`}
              onClick={() => setActive(nav.id)}
            >
              <ul>
                <li className={isActive ? "active" : ""}>
                  <Link to={item.id}>{item.title}</Link>
                </li>
              </ul>
            </li>
          );
        })}
      </ul>

      {/* Mobile Navigation Icon */}
      <div onClick={handleNav} className="block md:hidden">
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>

      {/* Mobile Navigation Menu */}
      <ul
        className={
          nav
            ? "fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500"
            : "ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]"
        }
        style={{ zIndex: 1000 }}
      >
        {/* Mobile Logo */}
        <Link to={"/"}>
          <img
            src={logo}
            alt="hoobank"
            className="w-full text-3xl font-bold text-[#00df9a]"
          />
        </Link>

        {/* Mobile Navigation Items */}
        {navLinks.map((item, index) => {
          const resolvedPath = useResolvedPath(`${item.id}`);
          const isActive = useMatch({ path: resolvedPath.pathname, end: true });
          return (
            <li
              key={item.id}
              className={`p-4 border-b rounded-xl  duration-300 ${
                isActive ? "text-white" : "text-dimWhite"
              } cursor-pointer border-gray-600`}
            >
              <ul>
                <li onClick={handleNav} className={isActive ? "active" : ""}>
                  <Link
                    style={{ display: "block", width: "auto" }}
                    to={item.id}
                  >
                    {item.title}
                  </Link>
                </li>
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Navbar;
