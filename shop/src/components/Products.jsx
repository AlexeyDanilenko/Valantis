import React from 'react';

function Products({ products }) {
  return (
    <div className='w-9/12 flex gap-5 flex-wrap mb-8'>
      {products.map((product) => (
        <div
          className=' p-5 border border-solid border-slate-800 rounded-lg w-[32%]'
          key={product.id}>
          <div className=" text-gray-500 product-id text-sm"><strong>ID:</strong> {product.id}</div>
          <div className=" text-indigo-800 font-bold text-lg mb-2 product-name">{product.product}</div>
          <div className="product-price"><strong>Цена:</strong> {product.price}</div>
          <div className="product-brand"><strong>Бренд:</strong> {product.brand}</div>
        </div>
      ))}
    </div>
  );
}

export default Products;