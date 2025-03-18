'use client'

import {useEffect, useState} from "react";
import {postLogin, postTokenLogin} from "@/app/_api/auth";
import {useRouter} from "next/navigation";

const Login = () => {
  const router = useRouter();

  const [mid, setMid] = useState(localStorage.getItem("mid"));
  const [mpassword, setMpassword] = useState('');
  const [midSaved, setMidSaved] = useState<boolean>(false);

  useEffect(() => {
    tokenLogin();

    return () => {}
  }, [])

  const tokenLogin = async () => {
    try {
      await postTokenLogin();
      router.replace("/store-table");
    } catch (err) {
    }
  }

  const onClickLogin = async () => {
    try {
      const { data } = await postLogin({mid, mpassword});
      const { rescode, message, body } = data;
      if (rescode === '0000') {
        const accessToken = body.accesstoken;
        if (midSaved) {
          localStorage.setItem('mid', mid);
        } else {
          localStorage.removeItem('mid');
        }
        localStorage.setItem('accessToken', accessToken);
        router.replace("/store-table");
      } else {
        alert(message);
      }
    } catch (err) {
    }
  }

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='w-[400px] h-[200px] border-solid border-2 border-slate-400 rounded-md bg-white'>
        <div className='h-2/6 flex items-center justify-center'>
          <p className='text-2xl font-medium'>전주손칼국수 POS</p>
        </div>
        <form className='h-3/6 flex gap-4 p-2'>
          <div className='w-4/6 h-full flex flex-col gap-3'>
            <input
              placeholder={'아이디'}
              onChange={(e) => setMid(e.target.value)}
              value={mid}
              className='w-full h-3/6 ps-2 rounded-md bg-gray-200'
              required={true}
            />
            <input
              placeholder={'비밀번호'}
              type={'password'}
              onChange={(e) => setMpassword(e.target.value)}
              value={mpassword}
              className='w-full h-3/6 ps-2 rounded-md bg-gray-200'
              required={true}
            />
          </div>
          <div className='w-2/6'>
            <button type='submit' className='w-full h-full bg-main text-white rounded-md' onClick={onClickLogin}>로그인
            </button>
          </div>
        </form>
        <div className='h-1/6 flex gap-4 p-2'>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" checked={midSaved} onChange={() => {setMidSaved(!midSaved)}} />
            <span className="text-gray-400">아이디 저장</span>
          </label>
        </div>
      </div>
    </div>
  )
}
export default Login;
