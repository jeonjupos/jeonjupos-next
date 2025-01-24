'use client'

import Header from "@/app/_components/header";
import Navigation from "@/app/_components/navigation";
import {useEffect, useState} from "react";
import {getStoreTable} from "@/app/_api/store-table";
import {useRouter} from "next/navigation";

const StoreTable = () => {
  const router = useRouter();

  const [storeTableList, setStoreTableList] = useState([]);

  useEffect(() => {
    fetchStoreTable();
  }, [])

  const fetchStoreTable = async () => {
    try {
      const { data } = await getStoreTable();
      console.log(data);
      setStoreTableList(data.body.storetableset);
    } catch (err) {
      if (err.response.status === 401) {
        router.replace("/login");
      }
      console.log(err.response);
    }
  }

  const onClickStoreTable = async (e) => {
    console.log(e);
    router.push(`/order?storetablepkey=${e.storetablepkey}`);
  }
  return (
    <div>
      <Header/>
      <Navigation/>
      <div className='border-solid border-2 border-slate-400 h-[calc(100vh-10rem)] flex flex-wrap flex-start m-3 rounded-sm'>
        {storeTableList.map((storeTable, idx) => {
          return (
            <div key={idx} className='m-2 w-60 h-48 flex flex-col rounded-sm border-solid border-2 border-slate-400' onClick={() => onClickStoreTable(storeTable)}>
              {storeTable.diningyn === 'N' && (
                <div className='h-full'>
                  <div className='h-2/6 flex justify-between items-center rounded-sm'>
                    <p className='text-4xl font-extrabold ms-2 text-orange-400'>{storeTable.tablenumber}</p>
                    <p className='me-2 text-white'>{storeTable.regdate}</p>
                  </div>
                  <div className='h-2/6 flex items-center justify-center'>
                    <p className='text-center text-4xl text-gray-400'>+</p>
                  </div>
                </div>
              )}
              {storeTable.diningyn === 'Y' > 0 && (
                <div className='h-full'>
                  <div className='h-1/6 flex justify-between items-center bg-purple-950 rounded-sm'>
                    <p className='text-4xl font-extrabold ms-2 text-orange-400'>{storeTable.tablenumber}</p>
                    <p className='me-2 text-white'>{storeTable.regdate}</p>
                  </div>
                  <div className='h-4/6 overflow-y-auto'>
                    {
                      storeTable.orderlist.map((order, idx) => {
                        return (
                          <div key={idx} className='flex justify-between items-center'>
                            <p className='ms-2'>{order.foodname}</p>
                            <p className='me-2'>{order.ordercount}</p>
                          </div>
                        )
                      })
                    }
                  </div>
                  <div className='h-1/6 flex justify-end items-center bg-main rounded-sm'>
                    <p className='me-2 text-white'>{storeTable.totalorderprice.toLocaleString()}원</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
        {/*<button onClick={() => router.push("/order")}>클릭</button>*/}
      </div>
    </div>
  )
}
export default StoreTable;
