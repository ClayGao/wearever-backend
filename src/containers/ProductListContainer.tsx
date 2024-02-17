'use client';
import { useState, useMemo, useEffect } from "react";
import Image from 'next/image';
import style from './ProductList.module.scss'

// @ts-ignore
export const ProductListContainer = ({ products }) => {
  const [activeDate, setActiveDate] = useState("");
  const dateList = useMemo(() => {
    // @ts-ignore
    const createdAtList: string[] = products.map((p) => {
      return p.createdAt
    });
    return Array.from(new Set(createdAtList)) || [];
  }, [products]);

  useEffect(() => {
    if (dateList.length > 0) {
      setActiveDate(dateList[0]);
    }
  }, [dateList]);

  const onDateClick = (date: string) => {
    setActiveDate(date);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-between">
      active: {activeDate}
      <div className="flex w-full">
        {dateList.map(date => <div key={date} onClick={() => onDateClick(date)} className="cursor-pointer p-4 rounded-md text-red-400" data-active={date === activeDate}>{date}</div>)}
      </div>
      <div className="grid grid-cols-6 gap-4">
        {/* @ts-ignore */}
        {products.map(product => (
          <div 
            className={style.productCard}
            key={product.link} 
            data-active={product.createdAt === activeDate}
            data-is-already-in-sheet={product.isAlreadyInSheet}
          >
            <img 
              loading="lazy"
              src={product.previewImg} 
              alt={product.name} 
              width={200} 
              height={200} />
            <div className="text-xs">
              <p>{product.name}</p>
              <p>{product.brand}</p>
              <p>{product.createdAt}</p>
            </div>
          </div>
          ))}
      </div>
    </div>
  )
}
