import { NavLink, type NavLinkProps } from "react-router-dom";

type CustomNavLinkProps = NavLinkProps & {
  children: React.ReactNode;
};

const baseLinkStyle = "block py-2 px-3 rounded md:p-0 transition-colors duration-200";

const getLinkClassName = ({ isActive }: { isActive: boolean }) =>
  `${baseLinkStyle} ${
    isActive
      ? "text-blue-600 dark:text-blue-400 font-bold"
      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
  }`;

export default function CustomNavLink({ children, to, onClick, ...props }: CustomNavLinkProps) {
  return (
    <li>
      <NavLink to={to} className={getLinkClassName} onClick={onClick} {...props}>
        {children}
      </NavLink>
    </li>
  );
}