'use client';

import Header from "@/app/_components/header";
import Navigation from "@/app/_components/navigation";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {getFoodCategoryList, getFoodList} from "@/app/_api/food";
import {firstOrder, getOrderFoodList, getOrderInfo, reOrder} from "@/app/_api/order";

const Order = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storetablepkey = searchParams.get('storetablepkey');

  const [foodCategoryList, setFoodCategoryList] = useState([]);
  const [foodList, setFoodList] = useState([]);
  const [orderInfo, setOrderInfo] = useState(null);
  const [orderFoodList, setOrderFoodList] = useState([]);
  const [newOrderFoodList, setNewOrderFoodList] = useState([]);
  const [totalOrderCount, setTotalOrderCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [onClickFoodPkey, setOnClickFoodPkey] = useState<{ foodpkey: number, flag: 'ord' | 'new'}>({ foodpkey: 0, flag: 'ord' });

  useEffect(() => {
    fetchFoodCategoryList();
    fetchOrderInfo();
  }, [])
  /**
   * 메뉴 카테고리 조회
   */
  const fetchFoodCategoryList = async () => {
    try {
      const { data } = await getFoodCategoryList();
      setFoodCategoryList(data.body.foodcategorylist);
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
    const findOrderFood = newOrderFoodList.find((orderFood) => orderFood.foodpkey === food.foodpkey)
    if (findOrderFood !== undefined) {
      findOrderFood.ordercount = findOrderFood.ordercount + 1;
      findOrderFood.totalprice = findOrderFood.saleprice * findOrderFood.ordercount;
      setNewOrderFoodList([...newOrderFoodList]);
    } else {
      setNewOrderFoodList([...newOrderFoodList, {orderfoodpkey: 0, foodpkey: food.foodpkey, foodname: `new${food.foodname}`, saleprice: food.saleprice, ordercount: 1, totalprice: food.saleprice}]);
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

  const onClickOrderFood = (foodpkey: number) => {
    setOnClickFoodPkey({ foodpkey: foodpkey, flag: 'ord' });
  }

  const onClickNewOrderFood = (foodpkey: number) => {
    setOnClickFoodPkey({ foodpkey: foodpkey, flag: 'new' });
  }

  const raiseOrderCount = () => {
    console.log('111 : ', onClickFoodPkey);
    if (onClickFoodPkey.flag === 'ord') {
      const findOrderFood = orderFoodList.find((orderFood) => orderFood.foodpkey === onClickFoodPkey.foodpkey);
      if (findOrderFood !== undefined) {
        findOrderFood.ordercount = findOrderFood.ordercount + 1;
        setOrderFoodList([...orderFoodList]);
      }
    } else {
      const findOrderFood = newOrderFoodList.find((orderFood) => orderFood.foodpkey === onClickFoodPkey.foodpkey);
      console.log('22222 : ', findOrderFood)
      if (findOrderFood !== undefined) {
        findOrderFood.ordercount = findOrderFood.ordercount + 1;
        setNewOrderFoodList([...newOrderFoodList]);
      }
    }
  }

  const lowerOrderCount = () => {
    if (onClickFoodPkey.flag === 'ord') {
      const findOrderFood = orderFoodList.find((orderFood) => orderFood.foodpkey === onClickFoodPkey.foodpkey);
      if (findOrderFood !== undefined) {
        if (findOrderFood.ordercount > 0) {
          findOrderFood.ordercount = findOrderFood.ordercount - 1;
          setOrderFoodList([...orderFoodList]);
        }
      }
    } else {
      const findOrderFood = newOrderFoodList.find((orderFood) => orderFood.foodpkey === onClickFoodPkey.foodpkey);
      if (findOrderFood !== undefined) {
        if (findOrderFood.ordercount > 0) {
          findOrderFood.ordercount = findOrderFood.ordercount - 1;
          setNewOrderFoodList([...newOrderFoodList]);
        }
      }
    }
  }

  /**
   * 결제 클릭
   */
  const onClickPay = async () => {

  }

  return (
    <div>
      <Header/>
      <Navigation/>
      <div className='border-solid border-2 border-slate-400 h-[calc(100vh-10rem)] flex flex-start m-3 rounded-sm'>
        <div className='border-solid border-2 border-slate-400 flex-[4]'>
          {/* 주문내역 */}
          <div className='border-solid border-2 border-slate-400 w-full h-3/6 flex flex-col justify-between '>
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
                    <tr key={idx} onClick={() => {onClickOrderFood(order.foodpkey)}}>
                      <td className='text-center'>{order.foodname}</td>
                      <td className='text-center'>{order.saleprice.toLocaleString()}</td>
                      <td className='text-center'>{order.ordercount}</td>
                      <td className='text-center'>{order.totalprice.toLocaleString()}</td>
                    </tr>
                  )
                })}
                {newOrderFoodList.map((order, idx) => {
                  return (
                    <tr key={idx} className='bg-gray-300' onClick={() => {onClickNewOrderFood(order.foodpkey)}}>
                      <td className='text-center'>{order.foodname}</td>
                      <td className='text-center'>{order.saleprice.toLocaleString()}</td>
                      <td className='text-center'>{order.ordercount}</td>
                      <td className='text-center'>{order.totalprice.toLocaleString()}</td>
                    </tr>
                  )
                })}
                </tbody>
              </table>
            </div>
            <div className='w-full'>
              <table className='table=fixed border-collapse border border-gray-400 w-full'>
                <thead>
                  <tr  className='bg-gray-400'>
                    <th className='w-[40%] text-align'>합계</th>
                    <th className='w-[20%]'></th>
                    <th className='w-[20%]'>{totalOrderCount}</th>
                    <th className='w-[20%]'>{totalPrice.toLocaleString()}원</th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
          {/* 결제정보 */}
          <div className='border-solid border-2 border-slate-400 w-full h-3/6'>
            <div className='w-full h-1/6 flex gap-2'>
              {/*<button className='w-[25%] m-1 rounded-md border-solid border-2 border-slate-400'>전체취소</button>*/}
              {/*<button className='w-[25%] m-1 rounded-md border-solid border-2 border-slate-400'>선택취소</button>*/}
              <button className='w-[25%] m-1 rounded-md border-solid border-2 border-slate-400' onClick={raiseOrderCount}>+</button>
              <button className='w-[25%] m-1 rounded-md border-solid border-2 border-slate-400' onClick={lowerOrderCount}>-</button>
            </div>
            <div className='flex flex-center w-full  h-5/6'>
              <div className='border-solid border-2 border-slate-400 flex-[1] p-5'>
                <div className='flex items-center justify-between h-1/6'>
                  <p className='flex-[3]'>결제정보</p>
                </div>
                <div className='flex items-center justify-between h-1/6'>
                  <p className='flex-[3]'>합계 금액</p>
                  <p className='flex-[7] text-right'>0</p>
                </div>
                <div className='flex items-center justify-between h-1/6'>
                  <p className='flex-[3]'>할인 금액</p>
                  <p className='flex-[7] text-right'>0</p>
                </div>
                <div className='flex items-center justify-between h-1/6'>
                  <p className='flex-[3]'>받을 금액</p>
                  <p className='flex-[7] text-right'>0</p>
                </div>
                <div className='flex items-center justify-between h-1/6'>
                  <p className='flex-[3]'>받은 금액</p>
                  <p className='flex-[7] text-right'>0</p>
                </div>
              </div>
              <div className='border-solid border-2 border-slate-400 flex-[1]'></div>
            </div>
          </div>
        </div>
        <div className='border-solid border-2 border-slate-400 flex-[6] flex flex-wrap'>
          <div className='border-solid border-2 border-slate-400 w-full h-1/6 flex items-center justify-start py-2'>
            {foodCategoryList.map((foodCategory, idx) => {
              return (
                <button
                  key={idx}
                  className='border-solid border-2 border-slate-400 w-28 h-full ms-2 text-xl font-bold'
                  onClick={() => onClickFoodCategory(foodCategory.foodcategorypkey)}
                >{foodCategory.foodcategoryname}</button>
              )
            })}
          </div>
          <div className='border-solid border-2 border-slate-400 w-full h-4/6 flex flex-wrap content-start items-start'>
            {foodList.map((food, idx) => {
              return (
                <div
                  key={idx}
                  className='border-solid border-2 border-slate-400 m-2 w-[9.48rem] h-20 flex flex-col justify-between p-1'
                  onClick={() => onClickFood(food)}
                >
                <p className='text-base font-bold ps-2'>{food.foodname}</p>
                  <p className='ps-2'>{food.saleprice.toLocaleString()}원</p>
                </div>
              )
            })}
          </div>
          <div className='border-solid border-2 border-slate-400 w-full h-1/6 flex items-center justify-start py-2'>
            <button className='border-solid border-2 border-slate-400 w-36 h-full ms-2 text-xl font-bold' onClick={() => onClickOrder()}>주문</button>
            <button className='border-solid border-2 border-slate-400 w-36 h-full ms-2 text-xl font-bold'>결제</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Order
