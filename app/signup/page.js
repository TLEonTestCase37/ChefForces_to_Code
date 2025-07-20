"use client";
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { motion } from "framer-motion";
import Link from "next/link";
import { auth } from "@/firebase/firebaseConfig";
import { EyeOff,Eye,Code } from "lucide-react";
import { useRouter } from "next/navigation";

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleSignIn = async () => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = result.user;
      console.log("Sign-up Successfull");
      router.push("/dashboard");
    } catch (err) {
      console.log(err.message);
      window.alert(err.message);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-slate-800/60 backdrop-blur-md border border-slate-600 w-[90%] max-w-md p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-6"
      >
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
            <Code className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white">ChefForces toCode</h1>
        </div>

        <p className="text-gray-300 text-center text-lg">
          Please Enter your Credentials
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignIn();
          }}
          className="flex flex-col gap-4 w-full"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-slate-700/50 text-white placeholder-gray-400 h-12 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition border border-slate-600"
          />

          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-slate-700/50 text-white placeholder-gray-400 h-12 rounded-xl px-4 pr-12 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition border border-slate-600"
            />
            <div
              className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-blue-400 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </div>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold h-12 rounded-xl transition hover:from-blue-600 hover:to-cyan-500 shadow-md"
          >
            Sign Up
          </button>
        </form>

        <div className="text-gray-300 flex flex-col sm:flex-row justify-center items-center gap-2 w-full text-sm">
          <span>Already have an account?</span>
          <Link
            href="/login"
            className="text-blue-400 hover:underline font-medium"
          >
            Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
