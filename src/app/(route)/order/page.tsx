'use client';

import Header from "@/app/_components/header";
import Navigation from "@/app/_components/navigation";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {getFoodCategoryList, getFoodList} from "@/app/_api/food";
import {firstOrder, getOrderFoodList, getOrderInfo, payment, reOrder} from "@/app/_api/order";

const Order = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storetablepkey = searchParams.get('storetablepkey');

  const [foodCategoryList, setFoodCategoryList] = useState([]);
  const [foodList, setFoodList] = useState([]);
  const [orderInfo, setOrderInfo] = useState(null);
  const [orderFoodList, setOrderFoodList] = useState([]);
  const [newOrderFoodList, setNewOrderFoodList] = useState([]);
  const [totalOrderCount, setTotalOrderCount] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [onClickFoodPkey, setOnClickFoodPkey] = useState<{ idx: number }>({ idx: 0 });
  const [onClickFoodCategoryPkey, setOnClickFoodCategoryPkey] = useState<number>(0);

  useEffect(() => {
    fetchFoodCategoryList();
    fetchOrderInfo();
  }, [])

  useEffect(() => {
    let totalprice: number = 0;
    let ordercount: number = 0;
    for (const orderFood of orderFoodList) {
      ordercount += orderFood.ordercount;
      totalprice += orderFood.totalprice;
    }
    setTotalPrice(totalprice);
    setTotalOrderCount(ordercount);
  }, [orderFoodList])
  /**
   * 메뉴 카테고리 조회
   */
  const fetchFoodCategoryList = async () => {
    try {
      const { data } = await getFoodCategoryList();
      setFoodCategoryList(data.body.foodcategorylist);
      if (data.body.foodcategorylist.length > 0) {
        setOnClickFoodCategoryPkey(data.body.foodcategorylist[0].foodcategorypkey);
        onClickFoodCategory(data.body.foodcategorylist[0].foodcategorypkey);
      }
    } catch (err) {
      if (err.response.status === 401) {
        router.replace("/login");
      }
    }
  }
  /**
   * 주문정보 조회
   */
  const fetchOrderInfo = async () => {
    try {
      const { data } = await getOrderInfo(storetablepkey);
      const orderinfo = data.body.orderinfo;
      if (orderinfo !== null) {
        setOrderInfo(orderinfo);
        await fetchOrderFoodList(orderinfo.orderinfopkey);
      }
    } catch (err) {
      if (err.response.status === 401) {
        router.replace("/login");
      }
    }
  }
  /**
   * 주문메뉴 조회
   * @param orderinfopkey
   */
  const fetchOrderFoodList = async (orderinfopkey: number) => {
    try {
      const { data } = await getOrderFoodList(orderinfopkey);
      setOrderFoodList(data.body.orderfoodlist);
      setTotalOrderCount(data.body.totalordercount);
      setTotalPrice(data.body.totalprice);
    } catch (err) {
      if (err.response.status === 401) {
        router.replace("/login");
      }
    }
  }
  /**
   * 메뉴 카테고리 클릭
   * @param foodcategorypkey
   */
  const onClickFoodCategory = async (foodcategorypkey: number) => {
    try {
      const { data } = await getFoodList(foodcategorypkey);
      setFoodList(data.body.foodlist);
      setOnClickFoodCategoryPkey(foodcategorypkey);
    } catch (err) {
      if (err.response.status === 401) {
        router.replace("/login");
      }
    }
  }

  /**
   * 주문할 메뉴 클릭
   * @param food
   */
  const onClickFood = async (food: any) => {
    const findOrderFood = orderFoodList.find((orderFood) => orderFood.foodpkey === food.foodpkey)
    if (findOrderFood !== undefined) {
      console.log('2');
      findOrderFood.ordercount = findOrderFood.ordercount + 1;
      findOrderFood.totalprice = findOrderFood.saleprice * findOrderFood.ordercount;
      setOrderFoodList([...orderFoodList]);
    } else {
      console.log('1');
      setOrderFoodList([...orderFoodList, {orderfoodpkey: 0, foodpkey: food.foodpkey, foodname: `new${food.foodname}`, saleprice: food.saleprice, ordercount: 1, totalprice: food.saleprice}]);
    }
  }

  /**
   * 주문 클릭
   */
  const onClickOrder = async () => {
    try {
      if (orderInfo === null) {
        // 첫 주문
        const orderfoodlist = newOrderFoodList.map((orderfood) => {
          return {foodpkey: orderfood.foodpkey, ordercount: orderfood.ordercount};
        })
        const payload = {
          storetablepkey: storetablepkey,
          ordertype: 'INSTORE',
          orderfoodlist: orderfoodlist,
        }
        const { data } = await firstOrder(payload);
        const { rescode, message, body } = data;
        if (rescode === '0000') {
          router.back();
        } else {
          alert(message);
        }
      } else {
        // 재주문
        const orderfoodlist = orderFoodList.map((orderfood) => {
          return {orderfoodpkey: orderfood.orderfoodpkey, foodpkey: orderfood.foodpkey, ordercount: orderfood.ordercount};
        })
        const neworderfoodlist = newOrderFoodList.map((orderfood) => {
          return {orderfoodpkey: orderfood.orderfoodpkey, foodpkey: orderfood.foodpkey, ordercount: orderfood.ordercount};
        })

        const BMap = neworderfoodlist.reduce((acc, item) => {
          acc[item.foodpkey] = item.ordercount;
          return acc;
        }, {});

        // 1. A 배열을 업데이트 (매칭되는 경우 ordercount 합산)
        const updatedA = orderfoodlist.map(item => ({
          ...item,
          ordercount: item.ordercount + (BMap[item.foodpkey] || 0)
        }));

        // 2. A에 없는 B의 항목을 추가
        const BOnlyItems = neworderfoodlist.filter(item => !orderfoodlist.some(a => a.foodpkey === item.foodpkey))
          .map(item => ({ orderfoodpkey: item.orderfoodpkey, foodpkey: item.foodpkey, ordercount: item.ordercount }));

        // 3. 두 배열을 합치기
        const result = [...updatedA, ...BOnlyItems];


        const payload = {
          orderinfopkey: orderInfo.orderinfopkey,
          orderfoodlist: result,
        }
        const { data } = await reOrder(payload);
        const { rescode, message, body } = data;
        if (rescode === '0000') {
          router.back();
        } else {
          alert(message);
        }
      }
    } catch (err) {
      if (err.response.status === 401) {
        router.replace("/login");
      }
    }
  }
  /**
   * 기존 메뉴 클릭
   * @param idx
   */
  const onClickOrderFood = (idx: number) => {
    setOnClickFoodPkey({ idx: idx });
  }
  /**
   * 수량 증가
   */
  const raiseOrderCount = () => {const orderFood = orderFoodList[onClickFoodPkey.idx-1];
    orderFood.ordercount = orderFood.ordercount + 1;
    orderFood.totalprice = orderFood.saleprice * orderFood.ordercount;
    setOrderFoodList([...orderFoodList]);
  }
  /**
   * 수량 감소
   */
  const lowerOrderCount = () => {
    const orderFood = orderFoodList[onClickFoodPkey.idx-1];
    if (orderFood.ordercount > 0) {
      orderFood.ordercount = orderFood.ordercount - 1;
      orderFood.totalprice = orderFood.saleprice * orderFood.ordercount;
      setOrderFoodList([...orderFoodList]);
    }
  }

  /**
   * 결제 클릭
   */
  const onClickPay = async () => {
    try {
      const payload = {
        orderinfopkey: orderInfo.orderinfopkey,
        paytype: 'CARD',
        payamount: totalPrice,
      }
      const { data } = await payment(payload);
      const { rescode, message, body } = data;
      if (rescode === '0000') {
        // 결제완료
        router.back();
      } else if (rescode === '0007') {
        // 부분결제완료
      } else {
        alert(message);
      }
    } catch (err) {
      if (err.response.status === 401) {
        router.replace("/login");
      }
    }
  }

  return (
    <div>
      <Header/>
      <Navigation/>
      <div className='border-solid border-2 border-slate-400 h-[calc(100vh-10rem)] flex flex-start m-3 rounded-sm'>
        <div className='border-solid border-2 border-slate-400 flex-[4]'>
          {/* 주문내역 */}
          <div className='w-full h-3/6 flex flex-col justify-between '>
            <div className='overflow-y-auto'>
              <table className='table-fixed border-collapse w-full'>
                <thead className='sticky top-0'>
                  <tr className='bg-gray-400'>
                    <th className='w-[40%]'>메뉴명</th>
                    <th className='w-[20%]'>단가</th>
                    <th className='w-[20%]'>수량</th>
                    <th className='w-[20%]'>금액</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-300'>
                {orderFoodList.map((order, idx) => {
                  return (
                    <tr
                      key={idx}
                      onClick={() => {onClickOrderFood(idx+1)}}
                      className={`${idx % 2 === 0 ? 'bg-gray-300' : ''} ${idx+1 === onClickFoodPkey.idx ? 'bg-gray-500 text-white' : ''}`}
                    >
                      <td className='text-center'>{order.foodname}</td>
                      <td className='text-center'>{order.saleprice.toLocaleString()}</td>
                      <td className='text-center'>{order.ordercount}</td>
                      <td className='text-center'>{order.totalprice.toLocaleString()}</td>
                    </tr>
                  )
                })}
                {/*{newOrderFoodList.map((order, idx) => {*/}
                {/*  return (*/}
                {/*    <tr key={idx} className='bg-gray-300' onClick={() => {onClickNewOrderFood(order.foodpkey)}}>*/}
                {/*      <td className='text-center'>{order.foodname}</td>*/}
                {/*      <td className='text-center'>{order.saleprice.toLocaleString()}</td>*/}
                {/*      <td className='text-center'>{order.ordercount}</td>*/}
                {/*      <td className='text-center'>{order.totalprice.toLocaleString()}</td>*/}
                {/*    </tr>*/}
                {/*  )*/}
                {/*})}*/}
                </tbody>
              </table>
            </div>
            <div className='w-full'>
              <table className='table=fixed border-collapse border border-gray-400 w-full'>
                <thead>
                  <tr  className='bg-gray-400'>
                    <th className='w-[40%] text-align'>합계</th>
                    <th className='w-[20%]'>{totalOrderCount}</th>
                    <th className='w-[20%]'>{totalPrice.toLocaleString()} 원</th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
          {/* 결제정보 */}
          <div className='border-solid border-t-2 border-slate-400 w-full h-3/6'>
            <div className='w-full h-1/6 flex gap-2'>
              {/*<button className='w-[25%] m-1 rounded-md border-solid border-2 border-slate-400'>전체취소</button>*/}
              {/*<button className='w-[25%] m-1 rounded-md border-solid border-2 border-slate-400'>선택취소</button>*/}
              <button className='w-[25%] m-1 rounded-md border-solid border-2 border-slate-400' onClick={raiseOrderCount}>+</button>
              <button className='w-[25%] m-1 rounded-md border-solid border-2 border-slate-400' onClick={lowerOrderCount}>-</button>
            </div>
            <div className='flex flex-center w-full  h-5/6'>
              <div className='border-solid border-t-2 border-r-2 border-slate-400 flex-[1] p-5'>
                <div className='flex items-center justify-between h-1/6'>
                  <p className='flex-[3]'>결제정보</p>
                </div>
                <div className='flex items-center justify-between h-1/6'>
                  <p className='w-[4rem]'>합계 금액</p>
                  <p className='text-right'>{totalPrice.toLocaleString()} 원</p>
                </div>
                <div className='flex items-center justify-between h-1/6'>
                  <p className='w-[4rem]'>할인 금액</p>
                  <p className='text-right'>0</p>
                </div>
                <div className='flex items-center justify-between h-1/6'>
                  <p className='w-[4rem]'>받을 금액</p>
                  <p className='text-right'>0</p>
                </div>
                <div className='flex items-center justify-between h-1/6'>
                  <p className='w-[4rem]'>받은 금액</p>
                  <p className='text-right'>0</p>
                </div>
              </div>
              <div className='border-solid border-t-2 border-slate-400 flex-[1]'></div>
            </div>
          </div>
        </div>
        <div className='border-solid border-2 border-slate-400 flex-[6] flex flex-wrap'>
          <div className='w-full h-1/6 flex gap-2 items-center justify-start p-2'>
            {foodCategoryList.map((foodCategory, idx) => {
              return (
                <button
                  key={idx}
                  className={`border-solid border-2 border-slate-400 w-28 h-full text-xl font-bold rounded-md ${foodCategory.foodcategorypkey === onClickFoodCategoryPkey ? 'bg-gray-400' : ''}`}
                  onClick={() => onClickFoodCategory(foodCategory.foodcategorypkey)}
                >{foodCategory.foodcategoryname}</button>
              )
            })}
          </div>
          <div className='border-solid border-t-2 border-slate-400 w-full h-4/6 p-2 flex flex-wrap gap-2 content-start items-start'>
            {foodList.map((food, idx) => {
              return (
                <div
                  key={idx}
                  className='border-solid border-2 border-slate-400 w-[calc(25%-6px)] h-20 flex flex-col justify-between p-1 rounded-md active:bg-gray-400'
                  onClick={() => onClickFood(food)}
                >
                  <p className='text-base font-bold ps-2'>{food.foodname}</p>
                  <p className='ps-2'>{food.saleprice.toLocaleString()}원</p>
                </div>
              )
            })}
          </div>
          <div className='border-solid border-t-2 border-slate-400 w-full h-1/6 flex items-center justify-start py-2'>
            <button className='border-solid border-2 border-slate-400 w-36 h-full ms-2 text-xl font-bold rounded-md' onClick={() => onClickOrder()}>주문</button>
            <button className='border-solid border-2 border-slate-400 w-36 h-full ms-2 text-xl font-bold rounded-md' onClick={() => onClickPay()}>결제</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Order
