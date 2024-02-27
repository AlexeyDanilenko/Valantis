import React, { useState, useEffect } from 'react';
import Products from './components/Products';
import Pagination from './components/Pagination';
import Filter from './components/Filter';
import md5 from 'md5';

const API_URL = 'http://api.valantis.store:40000/';

function getAuthHeader() {
  const timestamp = new Date().toISOString().split('-').join('').slice(0, 8);
  const password = 'Valantis';
  return md5(`${password}_${timestamp}`);
}

async function fetchAPI(method, params) {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('X-Auth', getAuthHeader());

  const body = JSON.stringify({ action: method, params });

  const response = await fetch(API_URL, {
    method: 'POST',
    headers,
    body,
  });

  if (response.ok) {
    const data = await response.json();
    return data.result;
  } else {
    const error = await response.text();
    console.error(`Ошибка API: ${error}`);
    throw new Error(error);
  }
}

async function getProducts(offset = 0, limit = 50, filterParams = {}) {
  const idsTotal = await fetchAPI('get_ids', { ...filterParams });
  const idsTotalQuantity = idsTotal.length;
  const ids = await fetchAPI('get_ids', { offset, limit, ...filterParams });
  const items = await fetchAPI('get_items', { ids });

  // Убираем дубликаты
  const uniqueItems = items.reduce((acc, item) => {
    if (!acc.find((i) => i.id === item.id)) {
      acc.push(item);
    }
    return acc;
  }, []);

  return {
    products: uniqueItems,
    total: idsTotalQuantity,
  };
}


function App() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterParams, setFilterParams] = useState({});
  const [fields, setFields] = useState([]);

  useEffect(() => {
    setFields(["brand", "price", "product"]);
  }, []); // Empty dependency array ensures it runs once on mount

  useEffect(() => {
    async function fetchData() {
      const offset = (currentPage - 1) * 50;
      const { products: items, total } = await getProducts(offset, 50, filterParams);
      setProducts(items);
      setTotal(total);
    }

    fetchData();
  }, [currentPage, filterParams]);

  async function filterProducts(selectedField, fieldValue) {
    let filteredItems = [];
    
    if (selectedField === 'price') {
      const newValue = parseInt(fieldValue);
      const filteredIds = await fetchAPI('filter', { "price": newValue });
      console.log(filteredIds);
      filteredItems = await fetchAPI('get_items', { "ids": filteredIds });
      console.log(filteredItems);
    }
    if (selectedField === 'brand') {
      const newValue = fieldValue.toString();
      const filteredIds = await fetchAPI('filter', { "brand": newValue });
      console.log(filteredIds);
      filteredItems = await fetchAPI('get_items', { "ids": filteredIds });
      console.log(filteredItems);
    }
    if (selectedField === 'product') {
      const newValue = fieldValue.toString();
      const filteredIds = await fetchAPI('filter', { "product": newValue });
      console.log(filteredIds);
      filteredItems = await fetchAPI('get_items', { "ids": filteredIds });
      console.log(filteredItems);
    }
  
    // Убираем дубликаты
    const uniqueFilteredItems = filteredItems.reduce((bbb, item) => {
      if (!bbb.find((i) => i.id === item.id)) {
        bbb.push(item);
      }
      return bbb;
    }, []);
  
    const filteredQuantity =  uniqueFilteredItems.length;
  
    setProducts(uniqueFilteredItems);
    setCurrentPage(1);
    setTotal(uniqueFilteredItems.length);

    return {
      products: uniqueFilteredItems,
      total: filteredQuantity,
    };
  }
  

  function handlePageChange(pageNumber) {
    setCurrentPage(pageNumber);
  }

  function handleFilterChange(selectedField, fieldValue) {
    console.log('click');
    filterProducts(selectedField, fieldValue);
  }

  return (
    <div className=' p-8'>
      <h1 className=' text-3xl my-8 text-center font-bold'>Каталог товаров</h1>
      <div className='flex flex-wrap'>
        <Filter fields={fields} onFilterChange={handleFilterChange} />
        <Products products={products} />
      </div>
      <p>Всего товаров {total}</p>
      <Pagination
        currentPage={currentPage}
        totalItems={total}
        itemsPerPage={50}
        onChange={handlePageChange}
      />
    </div>
  );
}

export default App;
