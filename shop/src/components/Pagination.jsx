import React from 'react';

function Pagination({ currentPage, totalItems, itemsPerPage, onChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleClick = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages && pageNumber !== currentPage) {
      onChange(pageNumber);
    }
  };

  const renderPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li key={i} >
          <a
            href="#"
            onClick={() => handleClick(i)}
            className={i === currentPage ? 'text-blue-900' : 'text-blue-400'}>
            {i}
          </a>
        </li>
      );
    }

    return pages;
  };

  return (
    <div className=" m-auto py-8 pagination">
      <ul className='flex flex-wrap justify-center gap-5 text-lg font-bold'>
        <li className="prev">
          <a href="#" onClick={() => handleClick(currentPage - 1)}>
            &lt;
          </a>
        </li>
        {renderPages()}
        <li className="next">
          <a href="#" onClick={() => handleClick(currentPage + 1)}>
            &gt;
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Pagination;
