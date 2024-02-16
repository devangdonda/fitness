"use client"
import Image from "next/image";
import styles from "./page.module.css";
import HomeBanner1 from "@/components/homeBanner1/HomeBanner1";
import HomeBanner2 from "@/components/homeBanner2/HomeBanner2";

export default function Home() {
  return (
    <>
      <HomeBanner1 />
      <HomeBanner2 />
    </>
  );
}
