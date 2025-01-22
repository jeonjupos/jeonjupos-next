'use client';

import Image from "next/image";
import {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/_components/header";
import {postTokenLogin} from "@/app/_api/auth";

// index(로그인) 페이지
const Home = () => {
  const router = useRouter();

  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    tokenLogin();
  }, []);

  const tokenLogin = async () => {
    try {
      const { data } = await postTokenLogin();
      const { rescode, message, body } = data;
      if (rescode === '0000') {
        // 검증 성공 시 매장 테이블 페이지로 이동
        router.replace("/store-table");
      } else {
        // 검증 실패 시 로그인 페이지로 이동
        router.replace("/login");
      }
    } catch (err) {
      // 검증 실패 시 로그인 페이지로 이동
      router.replace("/login");
    }
  }

  const onClickLogin = () => {
    router.replace("/order");
  }

  return (
    <div>
      <Header/>
      <button onClick={() => onClickLogin()}>로그인</button>
    </div>
  )
}

export default Home

