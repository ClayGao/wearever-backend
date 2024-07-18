
import type { Product } from '@/types';
import { downloadJson } from '@/utils/download-hepler' 

 const CommitCard: React.FC<{ date: string; products: Product[] }> = ({ date, products }) => {
  const onDownloadClick = () => {
    downloadJson(JSON.stringify(products), `products-${date}.json`);
  }
  return (
    <div key={date} className="rounded-sm border-1 p-4 space-y-2 border-2 border-gray-600">
      <h3 className="font-bold text-2xl">{date}</h3>
      <p className="text-sm">SUM: {products.length}</p>
      <div className='flex flex-wrap'>
        {products.map((product, index) => (
          <div key={index} className="border-1 rounded-sm basis-[33%] lg:basis-[10%]">
            <a href={product.link} target='_blank'>
              <img src={product.previewImg} alt={product.name} className='w-full' />
            </a>
            <p className='text-sm'>{product.name}</p>
            <p className='text-sm'>{product.brand}</p>
            <p className='text-xs'>created at: {product.createdAt}</p>
          </div>
        ))}
      </div>
      <button onClick={onDownloadClick} className="rounded-sm border-2 border-gray-600 py-1 px-4">Download JSON File</button>
    </div>
  );
}

export default CommitCard;