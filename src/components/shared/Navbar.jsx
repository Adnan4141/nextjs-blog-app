"use client";
import { AiOutlineSearch } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { BiSun } from "react-icons/bi";
import { Input } from "../ui/input";
import { MdDarkMode } from "react-icons/md";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import Image from "next/image";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const user = session?.user;
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { pathname: "/", label: "Home"},
    { pathname: "/about", label: "About" },
    { pathname: "/projects", label: "Projects" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key && e.key == "Enter") {
      router.push(`/search?searchTerm=${searchTerm}`);
    }
  };

  const handleSearchButton = (e) => {
    router.push(`/search?searchTerm=${searchTerm}`);
  };

  return (
    <nav
      className={`py-4 sticky top-0 z-50 w-full  ${
        scrolled ? " bg-white dark:bg-gray-900  " : " dark:bg-gray-900"
      } shadow  flex justify-around items-center`}
    >
      <div className="flex items-center font-bold dark:text-white text-2xl">
        <h2 className="bg-gradient-to-r text  font-bold px-2 py-1 text-white via-purple-500   rounded from-indigo-500 to-pink-500">
          Adnan's
        </h2>
        <span>Blog</span>
      </div>

      <div className="flex w-fit md:w-1/5 items-center rounded-full text-white transition duration-300 md:border  md:rounded-full shadow border-gray-400 focus-within:ring-3  group">
        <Input
          type="text"
          className={
            "hidden text-black shadow-none border-none  focus-visible:ring-0 md:block rounded-r-none"
          }
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search here ..."
          onKeyPress={handleKeyDown}
        />
        <button
          name="search"
          type="button"
          onClick={handleSearchButton}
          className="md:px-4 md:py-2 py-2 px-2 block rounded-full cursor-pointer text-xl  bg-gray-500 md:rounded-l-none "
        >
          <AiOutlineSearch />
        </button>
      </div>

      <ul
        className={`flex bg-gray-200  dark:bg-[#333446] md:dark:bg-transparent  md:min-h-0 justify-center py-5 md:py-0 px-5 md:px-0 
           w-full md:w-fit md:bg-transparent
            flex-col md:flex-row absolute  md:static 
            transition-all duration-300 ease-in-out
            md:gap-5
         ${
           isOpen
             ? "top-16 text-center py-20 gap-10 min-h-48 bg-gray-200  dark:text-white"
             : "-top-96"
         }
        
        `}
      >
        {links.map((link, idx) => (
          <li
            className={`${
              pathname == link.pathname && "dark:text-blue-500  text-blue-600"
            } hover:text-gray-400 text-lg text-center`}
            key={idx}
          >
            <Link href={link.pathname} onClick={() => setIsOpen(false)}>
              {link.label}
            </Link>
          </li>
        ))}

        {user ? (
          <>
            <li
              className={` md:hidden hover:text-gray-400 text-lg text-center`}
              key={"dashboard"}
            >
              <Link href={"/dashboard?tab=profile"} onClick={() => setIsOpen(false)}>
                 Profile
              </Link>
            </li>

            <div className="w-full md:hidden flex justify-center cursor-pointer">
              <Image
                className="rounded-full "
                src={user?.image}
                alt={user?.name}
                width={45}
                height={45}
              />
            </div>
          </>
        ) : (
          <Link href={"/login"} onClick={() => setIsOpen(false)}>
            <Button
              className={
                "dark:border md:hidden bg-blue-800 text-white dark:bg-transparent hover:bg-blue-800 cursor-pointer dark:border-blue-700 "
              }
              variant={"outline"}
            >
              Login
            </Button>
          </Link>
        )}
      </ul>

      <div className="flex items-center gap-5">
        <div className="">
          <button
            onClick={() => setTheme(theme == "dark" ? "light" : "dark")}
            className="text-2xl p-2 cursor-pointer rounded-full bg-gray-200 dark:bg-[#1F2937] dark:text-white"
          >
            {theme == "dark" ? <MdDarkMode /> : <BiSun />}
          </button>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="flex items-center select-none gap-2 cursor-pointer">
                  <Image
                    src={user?.image}
                    alt="User avatar"
                    className="rounded-full  hidden md:block "
                    width={38}
                    height={38}
                  />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-48 mt-2 z-50 bg-white text-black dark:bg-gray-800 dark:text-white shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
                <DropdownMenuLabel className="px-3 py-2  text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                  Dashboard
                </DropdownMenuLabel>

                <DropdownMenuItem
                  onClick={() => router.push("/dashboard?tab=profile")}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => console.log("Go to settings")}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-t border-gray-200 dark:border-gray-600 my-1" />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="px-3 py-4 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 dark:text-red-400 cursor-pointer"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href={"/login"}>
              <Button
                className={
                  "dark:border-2  dark:text-white border-blue-600 border-2 text-center py-1 text-blue-900 hover:text-white hidden md:block hover:bg-blue-700 cursor-pointer dark:border-blue-700 "
                }
                variant={"outline"}
              >
                Login
              </Button>
            </Link>
          )}

          <button
            className="cursor-pointer md:hidden"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            {!isOpen ? (
              <GiHamburgerMenu size={25} />
            ) : (
              <AiOutlineClose size={25} />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
