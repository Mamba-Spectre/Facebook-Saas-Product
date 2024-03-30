"use client"
import Image from "next/image";
import styles from "./page.module.css";
import AuthForm from "@/components/Login/login";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const interval = setInterval(() => {
      debugger;
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
<div>
<AuthForm />
</div>
  );
}
