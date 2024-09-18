import Link from "next/link";
import React from "react";
import Menu from "./Menu";
import { SearchBox } from "./SearchBox";
import { Lilita_One } from "next/font/google";
import { MenuIcon } from "lucide-react";
import Image from "next/image";

const logoFont = Lilita_One({
  subsets: ["latin"],
  weight: ["400"],
});

const Header = () => {
  return (
    <header className="w-full md:px-[5%] bg-base-300">
      <nav>
        <div className="navbar justify-between items-center ">
          <div>
            <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
              <MenuIcon />
            </label>
          </div>
          <Link
            href="/"
            className={` ${logoFont.className} flex ml-5 text-2xl btn btn-ghost`}
          >
            <Image
              src="/headerlogo.png"
              className=""
              width={80}
              height={80}
              alt=""
            />
          </Link>

          <Menu />
        </div>
      </nav>
    </header>
  );
};

export default Header;
