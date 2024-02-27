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


async function getProducts(offset = 0, selectedField = '', fieldValue = '') {

  if (selectedField === '' || fieldValue === '') {
    const allIds = await fetchAPI('get_ids', { "offset": 0 });
    let uniqueIds = [...new Set(allIds)];
    let limit = offset + 50;
    const ids = uniqueIds.slice(offset, limit);
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
      total: uniqueIds.length,
    };
  }

  if (selectedField === 'price') {
    const newValue = parseInt(fieldValue);
    const filteredIds = await fetchAPI('filter', { "price": newValue });
    let uniqueFilteredIds = [...new Set(filteredIds)];
    let limit = offset + 50;
    const ids = uniqueFilteredIds.slice(offset, limit);
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
      total: uniqueFilteredIds.length,
    };
  }
  if (selectedField === 'brand') {
    const newValue = fieldValue.toString();
    const filteredIds = await fetchAPI('filter', { "brand": newValue });
    let uniqueFilteredIds = [...new Set(filteredIds)];
    let limit = offset + 50;
    const ids = uniqueFilteredIds.slice(offset, limit);
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
      total: uniqueFilteredIds.length,
    };
  }
  if (selectedField === 'product') {
    const newValue = fieldValue.toString();
    const filteredIds = await fetchAPI('filter', { "product": newValue });
    let uniqueFilteredIds = [...new Set(filteredIds)];
    let limit = offset + 50;
    const ids = uniqueFilteredIds.slice(offset, limit);
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
      total: uniqueFilteredIds.length,
    };
  }

}

function App() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const fields = ["brand", "price", "product"];

  useEffect(() => {
    async function fetchData() {
      const offset = (currentPage - 1) * 50;
      const { products: items, total } = await getProducts(offset, filter, filterValue);
      setProducts(items);
      setTotal(total);
    }

    fetchData();
  }, [currentPage, filter, filterValue]);


  function handlePageChange(pageNumber) {
    setCurrentPage(pageNumber);
  }

  function handleFilterChange(selectedField, fieldValue) {
    console.log('Фильтр применен');
    setFilter(selectedField);
    setFilterValue(fieldValue);
    setCurrentPage(1);
  }

  function handleClearFilter() {
    console.log('Фильтры сброшены');
    setFilter('');
    setFilterValue('');
    setCurrentPage(1);
  }

  return (
    <div className=' p-8'>
      <h1 className=' text-3xl my-8 text-center font-bold'>Каталог товаров</h1>
      <div className='flex flex-wrap'>
        <Filter fields={fields} onFilterChange={handleFilterChange} clearFilter={handleClearFilter} />
        <Products products={products} />
      </div>
      <p className=' text-center'>Всего товаров <strong>{total}</strong></p>
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
