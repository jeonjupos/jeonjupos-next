'use client'

import {useState} from "react";
import {postLogin} from "@/app/_api/auth";
import {useRouter} from "next/navigation";

const Login = () => {
  const router = useRouter();

  const [mid, setMid] = useState('');
  const [mpassword, setMpassword] = useState('');

  const onClickLogin = async () => {
    try {
      const { data } = await postLogin({mid, mpassword});
      const accessToken = data.body.accesstoken;
      localStorage.setItem('accessToken', accessToken);
      router.replace("/store-table");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <div>
        <p>아이디</p>
        <input onChange={(e) => setMid(e.target.value)} value={mid} />
        <p>비밀번호</p>
        <input onChange={(e) => setMpassword(e.target.value)} value={mpassword} />
      </div>
      <div>
        <button onClick={onClickLogin}>로그인</button>
      </div>
    </div>
  )
}
export default Login;
