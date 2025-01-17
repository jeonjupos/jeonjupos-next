'use client';

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/_components/header";

// index 페이지
const Home = () => {
  const router = useRouter();

  useEffect(() => {
    console.log('ㅎㅇ');
  }, []);

  return (
    <div>
      <Header/>
      <button onClick={() => router.push("/order")}>클릭</button>
    </div>
  )
}

export default Home

