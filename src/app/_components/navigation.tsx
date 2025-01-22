const Navigation = () => {
  return (
    <div className='w-full h-auto flex items-center gap-4 mt-2'>
      <div className='w-1/6 flex items-center ms-3'>
        <button className='w-20 h-12 bg-main text-slate-400 font-bold'>거래내역</button>
      </div>
      <div className='w-3/6 flex items-center gap-2'>
        <button className='w-20 h-12 bg-btn_bg_1 text-gray-400 font-bold'>메뉴관리</button>
        <button className='w-20 h-12 bg-btn_bg_1 text-gray-400 font-bold'>테이블관리</button>
      </div>
      <div className='w-2/6 flex items-center gap-2 me-3'>
        <button className='w-20 h-12 border-solid border-2 border-slate-400 text-gray-500 font-bold'>포장</button>
        <button className='w-20 h-12 border-solid border-2 border-slate-400 text-gray-500 font-bold'>배달</button>
      </div>
    </div>
  )
}
export default Navigation;
