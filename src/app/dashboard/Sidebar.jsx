"use client";
import { AiOutlineComment } from "react-icons/ai";
import { IoIosCreate } from "react-icons/io";
import { BiUserCircle } from "react-icons/bi";
import { CgFileDocument } from "react-icons/cg";
import { AiOutlineClose } from "react-icons/ai";

import { use, useEffect, useState } from "react";
import { Home, Settings, User, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";

const navItems = [
  {
    label: "Overview",
    href: "/dashboard?tab=overview",
    icon: Home,
    adminOnly: true,
  },
  { label: "Users", href: "/dashboard?tab=users", icon: User, adminOnly: true },
  {
    label: "Comments",
    href: "/dashboard?tab=comments",
    icon: AiOutlineComment,
    adminOnly: true,
  },
  {
    label: "Posts",
    href: "/dashboard?tab=posts",
    icon: CgFileDocument,
    adminOnly: true,
  },
  {
    label: "Create-post",
    href: "/dashboard?tab=create-post",
    icon: IoIosCreate,
    adminOnly: true,
  },
  { label: "Profile", href: "/dashboard?tab=profile", icon: BiUserCircle },
  { label: "Settings", href: "/dashboard?tab=settings", icon: Settings },
];

export default function Sidebar() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "profile";
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
  }, [status, session]);

  useEffect(() => {
    setCollapsed(true);
  }, [tab]);

  return (
    <aside
      className={`min-h-screen z-40 fixed    ${
        collapsed ? "w-20" : "w-64"
      } bg-white dark:bg-gray-900 border-r dark:border-gray-700 shadow-sm p-4  flex flex-col transition-all duration-300`}
    >
      {/* Toggle Button */}
      <button
        className="mb-6 text-gray-600 cursor-pointer dark:text-gray-300 focus:outline-none"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <Menu className="w-5 h-5 mx-auto" />
        ) : (
          <AiOutlineClose className="w-5 h-5 mx-auto" />
        )}
      </button>

      {/* Sidebar Title */}
      {/* {!collapsed && (
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Dashboard</h2>
      )} */}

      {/* Navigation */}
      <nav className="space-y-1 flex-1">
        {navItems
          .filter((item) => !item?.adminOnly || session?.user?.isAdmin)
          .map(({ label, href, icon: Icon }) => {
            const hrefTab = href.split("tab=")[1];
            const isActive = tab == hrefTab;

            return (
              <Link key={href} href={href}>
                <div
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-gray-100 text-blue-600 dark:bg-gray-800 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0 transition-all duration-300" />

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                    }`}
                  >
                    <span className="text-sm whitespace-nowrap">{label}</span>
                  </div>
                </div>
              </Link>
            );
          })}
      </nav>
    </aside>
  );
}
