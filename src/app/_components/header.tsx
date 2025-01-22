'use client'

import {useEffect, useState} from "react";

const Header = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    // 현재 시간 가졍오기
    const updateTime = () => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString();
      const formattedTime = now.toLocaleTimeString(); // 지역 시간 형식으로 변환
      setTime(formattedTime);
      setDate(formattedDate);
    };

    updateTime(); // 처음 렌더링 시 시간 설정

    const interval = setInterval(updateTime, 1000); // 1초마다 시간 업데이트

    return () => clearInterval(interval); // 컴포넌트가 언마운될 때 interval 정리
  }, [])
  return (
    <div className='flex items-center justify-between h-20 mx-auto bg-main'>
      <div className='ms-2 w-1/6 text-center'>
        <p className='text-white'>POS</p>
      </div>
      <div className='me-2 w-5/6'>
        <div className='flex items-center gap-4'>
          <p className='text-slate-400'>영업일자</p>
          <p className='text-slate-400'>{date}</p>
        </div>
        <div className='flex items-center gap-4'>
          <p className='text-slate-400'>현재시간</p>
          <p className='text-slate-400'>{time}</p>
        </div>
      </div>
    </div>
  )
}

export default Header;
