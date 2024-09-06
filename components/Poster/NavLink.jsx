import React from "react";
import Link from "next/link";
function NavLink({ title, href }) {
  return (
    <Link
      className="text-md text-gray-800 md:px-4 md:pt-3 md:pb-4 pb-1
     items-center justify-center flex cursor-pointer  hover:text-black smooth"
      href={href}
    >
      {title}
    </Link>
  );
}

export default NavLink;
