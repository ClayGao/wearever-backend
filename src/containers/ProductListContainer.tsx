/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client';
import { useState, useMemo, useCallback, useEffect } from "react";
import style from './ProductList.module.scss'
import axios from "axios";
import type { Product } from '@/types';
// @ts-ignore
export const ProductListContainer:React.FC<{products: Product[]}> = ({ products }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const dateList = useMemo(() => {
      // @ts-ignore
    const createdAtList: string[] = products.map(({createdAt}) => createdAt)
    return ['All', ...Array.from(new Set(createdAtList))].slice(0,30) || ["All"];
  }, [products]);
  const [activeDate, setActiveDate] = useState(dateList[1]);

  const uniqueProducts = useMemo(() => {
    const uniqueMap = new Map();
    
    products.forEach((product) => {
      if (!uniqueMap.has(product.name)) {
        uniqueMap.set(product.name, product);
      }
    });
    
    return Array.from(uniqueMap.values());
  }, [products]);

  const onDateClick = (date: string) => {
    setActiveDate(date);
  }

  const onAddToCartBtnClick = (product: Product) => {
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

  const removeItemFromCart = (product: Product) => {
    // @ts-ignore
    setCart(cart.filter((p) => p._id !== product._id));
  }

  const onExportClick = useCallback(() => {
    if(isLoading) {
      return;
    }
    setIsLoading(true);
    // @ts-ignore
    const ids = cart.map((p) => p._id);
    Promise.all([
      axios.post('/api/set-store-product', {
        ids,
        action: true
      }),
      axios.post('/api/set-commits-product', {
        cart
      })
    ])
    .then(() => {
      console.log('success');
      setCart([]);
    }).catch((error) => {
      console.log({error});
    }).finally(() => {
      setIsLoading(false);
    })

  },[cart, isLoading]);

  if(!isOpen) {
    return <input type="password" onChange={() => setIsOpen(true)} />
  }

  return (
    <div className="flex min-h-screen flex-col items-center overflow-hidden w-full relative">
      <div className={`bg-white flex flex-col w-full py-2 px-4 border-2 border-gray-800 top-0 ${activeDate === "All" ? "fixed" : "mb-2"}`}>
        <div className="flex justify-between">
          <div>SUM: {cart.length}</div>
          <button onClick={onExportClick}>送出</button>
        </div>
        <div className="flex flex-wrap">
          {/* @ts-ignore */}
          {cart.map((product) => <img onClick={() => removeItemFromCart(product)} className="cursor-pointer inline-block" key={product._id} src={product.previewImg} width={35} />)}
        </div>
        <div className="flex w-full overflow-x-auto gap-1 py-2">
          {dateList.map(date => <div key={date} onClick={() => onDateClick(date)} className={style.dateSelector} data-active={date === activeDate}>{date}</div>)}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {/* @ts-ignore */}
        {uniqueProducts.map(product => 
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
                    height={200} 
                  />
                </a>
                <div className="text-xs px-1 lg:px-2">
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
