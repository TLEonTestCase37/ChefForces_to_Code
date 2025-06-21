"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Monoton } from "next/font/google";
import { motion } from "framer-motion";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import Link from "next/link";
const monoton = Monoton({
  subsets: ["latin"],
  weight: "400",
});
import Image from "next/image";
const Login = () => {
  const [showPassword, setShowPassword] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.push("/dashboard");
    });
    return () => unsubscribe();
  }, []);
  const handlelogin = () => {
    try {
      const result = signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      router.replace("/dashboard");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-[#0f0f0f]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-[#1A1A1A] w-[90%] max-w-md p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-6"
      >
        <h1
          className={`${monoton.className} text-[#FFA116] text-2xl text-center`}
        >
          Please Enter your Credentials
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlelogin();
          }}
          className="flex flex-col gap-4 w-full"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-[#2A2A2A] text-white placeholder-gray-400 h-12 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-[#FFA116] transition"
          />

          <div className="relative w-full">
            <input
              type={!showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-[#2A2A2A] text-white placeholder-gray-400 h-12 rounded-xl px-4 pr-12 w-full focus:outline-none focus:ring-2 focus:ring-[#FFA116] transition"
            />
            <Image
              src={showPassword ? "/eye-off.svg" : "/eye.svg"}
              alt="Toggle password visibility"
              width={24}
              height={24}
              className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-white"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-[#FFA116] text-black font-semibold h-12 rounded-xl transition hover:bg-yellow-400"
          >
            Login
          </motion.button>
        </form>
        <div className="text-white flex justify-around w-full">
          <div>Dont have an account??</div>
          <Link href={"/signup"} className="hover:underline">
            Register
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
