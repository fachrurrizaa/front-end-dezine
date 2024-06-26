"use client";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import { signOut, useSession } from "next-auth/react";
import logo from "/public/assets/dezine.svg";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="flex justify-between items-center p-5 px-32">
      <Link href="/">
        <Image src={logo} width={160} height={0} alt={"logo"} />
      </Link>
      <nav>
        <ul className="flex justify-between">
          <li className="font-medium text-base text-[#004f4f] inline-block py-0 px-5 transition-all ease-in-out cursor-pointer hover:font-bold">
            <Link href="/">Home</Link>
          </li>
          <li className="font-medium text-base text-[#004f4f] inline-block py-0 px-5 transition-all ease-in-out cursor-pointer hover:font-bold">
            <Link href="/category-page">Categories</Link>
          </li>
          <li className="font-medium text-base text-[#004f4f] inline-block py-0 px-5 transition-all ease-in-out cursor-pointer hover:font-bold">
            <Link href="/pricing">Pricing</Link>
          </li>
          <li className="font-medium text-base text-[#004f4f] inline-block py-0 px-5 transition-all ease-in-out cursor-pointer hover:font-bold">
            <Link href="/study-case">Study Case</Link>
          </li>
        </ul>
      </nav>
      <div>
        {session ? (
          <div className="flex items-center gap-10">
            <p className="font-medium text-base text-[#004f4f]">
              Hello, {session?.user?.name}
            </p>
            <div className="flex-none gap-2">
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full">
                    <img
                      alt="User Avatar"
                      src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-6 gap-1 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-auto"
                >
                  <li>
                    <a className="p-0">
                      <p className="text-bold-600 p-2">{session?.user?.name}</p>
                    </a>
                  </li>
                  <li>
                    <a className="p-0 pr-1">
                      <p className="text-bold-600 p-2">{session?.user?.email}</p>
                      <span
                        className={`badge ml-2 h-6 ${
                          session?.user?.subscriptions
                            ? "bg-yellow-500 text-white"
                            : "bg-gray-400 text-white"
                        }`}
                      >
                        {session?.user?.subscriptions ? "Premium" : "Free"}
                      </span>
                    </a>
                  </li>
                  <li>
                    <a className="p-2">Settings</a>
                  </li>
                  <li
                    className="bg-red-500 rounded-lg p-2 text-white items-center"
                    onClick={() => signOut()}
                  >
                    <a>Logout</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Link href="/login" className="font-medium text-base">
              <Button
                className={
                  "font-medium text-base text-[#004f4f] bg-slate-200 h-10 min-h-0 px-6 hover:bg-slate-300 mr-2"
                }
                content={"Sign in"}
              />
            </Link>
            <Link href="/register" className="font-medium text-base">
              <Button
                className={
                  "font-medium text-base text-white h-10 min-h-0 px-6 bg-[#028d94] hover:bg-[#02b2bb]"
                }
                content={"Sign Up"}
              />
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
