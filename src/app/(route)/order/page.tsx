'use client';

import Header from "@/app/_components/header";
import Navigation from "@/app/_components/navigation";
import {useRouter, useSearchParams} from "next/navigation";

const Order = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const storetablepkey = searchParams.get('storetablepkey');
  console.log(storetablepkey);
  return (
    <div>
      <Header/>
      <Navigation/>
      <div className='border-solid border-2 border-slate-400 h-[calc(100vh-10rem)] flex flex-start m-3 rounded-sm'>
        <div className='border-solid border-2 border-slate-400 flex-[4]'>
          <div className='border-solid border-2 border-slate-400 w-full h-3/6'>주문내역</div>
          <div className='border-solid border-2 border-slate-400 w-full h-3/6'>주문가격정보</div>
        </div>
        <div className='border-solid border-2 border-slate-400 flex-[6] flex flex-wrap'>
          <div className='border-solid border-2 border-slate-400 w-full h-1/6'>메뉴 카테고리</div>
          <div className='border-solid border-2 border-slate-400 w-full h-4/6'>메뉴 목록</div>
          <div className='border-solid border-2 border-slate-400 w-full h-1/6'>메뉴 주문/결제 버튼</div>
        </div>
      </div>
    </div>
  )
}

export default Order
