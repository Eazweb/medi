"use client";

import useLayoutService from "@/lib/hooks/useLayout";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";

const Sidebar = () => {
  const { toggleDrawer, theme } = useLayoutService();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: categories, error } = useSWR("/api/products/categories");

  if (error) return error.message;
  if (!categories) return "Loading...";

  return (
    <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
      <div className="flex justify-between items-center px-[5%]">
        <Link href="/" onClick={toggleDrawer}>
          <Image
            src={theme === "dark" ? "/whitelogo.png" : "/blacklogo.png"}
            width={80}
            height={80}
            alt="Logo"
          />
        </Link>
      </div>

      <li>
        <h2 className="text-xl">Shop By Department</h2>
      </li>
      {/* {categories.map((category: string) => (
        <li key={category}>
          <Link href={`/search?category=${category}`} onClick={toggleDrawer}>
            {category}
          </Link>
        </li>
      ))} */}
      <li>Belt</li>
    </ul>
  );
};

export default Sidebar;
