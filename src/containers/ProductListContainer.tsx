'use client';
import { useState, useMemo, useCallback } from "react";
import Image from 'next/image';
import style from './ProductList.module.scss'
import axios from "axios";
import { downloadJson } from '@/utils/download-hepler'
// @ts-ignore
export const ProductListContainer = ({ products }) => {
  const [activeDate, setActiveDate] = useState("All");
  const [cart, setCart] = useState([]);
  const dateList = useMemo(() => {
    // @ts-ignore
    const createdAtList: string[] = products.map((p) => {
      return p.createdAt
    });
    return ["All", ...Array.from(new Set(createdAtList))] || ["All"];
  }, [products]);

  const onDateClick = (date: string) => {
    setActiveDate(date);
  }

  const onAddToCartBtnClick = (product: any) => {
    // if(product.isAlreadyInSheet) {
    //   axios.post('/api/set-store-product', {
    //     ids: [product._id],
    //     action: false
    //   });
    //   return
    // }
    // @ts-ignore
    if(cart.find((p) => p._id === product._id)) {
      alert('The Same id Already in cart');
      return;
    }
    // @ts-ignore
    if(cart.find((p) => p.name === product.name)) {
      alert('The Same name Already in cart');
      return;
    }
    // @ts-ignore
    setCart([...cart, product]);
  }

  const removeItemFromCart = (product: any) => {
    // @ts-ignore
    setCart(cart.filter((p) => p._id !== product._id));
  }

  const onExportClick = useCallback(() => {
    // @ts-ignore
    const ids = cart.map((p) => p._id);
    axios.post('/api/set-store-product', {
      ids,
      action: true
    })
    .then(() => {
      console.log('success');
      const cartJson = JSON.stringify(cart);
      downloadJson(cartJson, 'cart.json');
    })
    .then(() => {
      console.log('success');
      setCart([]);
    }).catch((error) => {
      console.log({error});
    })

  },[cart]);

  return <div>123</div>


  return (
    <div className="flex min-h-screen flex-col items-center justify-between">
      <div className="fixed h-40 bg-slate-300 w-full py-2 px-4">
        <div className="flex justify-between">
          <div>actives: {activeDate}</div>
          <div>cart Number: {cart.length}</div>
          <button onClick={onExportClick}>Export</button>
        </div>
        {/* @ts-ignore */}
        {cart.map((product) => <img onClick={() => removeItemFromCart(product)} className="cursor-pointer inline-block" key={product._id} src={product.previewImg} width={30} height={30} />)}
      </div>
      <div className="flex w-full mt-40">
        {dateList.map(date => <div key={date} onClick={() => onDateClick(date)} className="cursor-pointer p-4 rounded-md text-red-400" data-active={date === activeDate}>{date}</div>)}
      </div>
      <div className="grid grid-cols-6 gap-4">
        {/* @ts-ignore */}
        {products.map(product => 
        {
          // const isButtonDisabled = product.isAlreadyInSheet || cart.some((p) => p._id === product._id)
          // @ts-ignore
          const isInCart = cart.some(({_id}) => _id === product._id);
          const ctaText = product.isAlreadyInSheet ? "Is In Sheet" : isInCart ? "In Cart" : "Add To Cart";
          return (
          <div 
            className={style.productCard}
            key={product._id} 
            data-active={product.createdAt === activeDate || activeDate === "All"}
            data-is-already-in-sheet={product.isAlreadyInSheet}
          >
            <a className="cursor-pointer" href={product.link} target="_blank">
              <img 
                loading="lazy"
                src={product.previewImg} 
                alt={product.name} 
                width={200} 
                height={200} />
            </a>
            <div className="text-xs">
              <p>{product.name}</p>
              <p>{product.brand}</p>
              <p>{product.createdAt}</p>
            </div>
            <button 
              onClick={()=> onAddToCartBtnClick(product)}
              // disabled={isButtonDisabled}
              className="px-2 py-1 border-2 rounded-md border-black mt-2"
            >
              {ctaText}
            </button>
          </div>
          )})}
      </div>
    </div>
  )
}
