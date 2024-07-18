'use client';
import { useMemo } from 'react';
import CommitCard from '@/src/components/CommitCard';
import type { Product } from '@/types';
import Link from 'next/link';

type CommitListContainerPropsType = {
  groupedProducts: Record<string, Product[]>;
};

const CommitListContainer = (props: CommitListContainerPropsType) => {
  const { groupedProducts } = props;
  const groupedProductsToArr = useMemo(() => Object.entries(groupedProducts), [groupedProducts]);
    console.log({groupedProductsToArr})
  return (
    <div className='my-4 p-4'>
      <Link href="/" className='text-lg font-black'>{'> Back Home'}</Link>
      <div className="flex flex-col-reverse mt-4">
        {groupedProductsToArr.map(([date, products]) => (
            <CommitCard key={date} date={date} products={products} />
        ))}
      </div>
    </div>
  );
};

export default CommitListContainer;
