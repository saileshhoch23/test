import React from 'react';
import { Pagination } from 'react-bootstrap';
import './pagination.css';

const PaginationComponent = ({ totalPages, handlePaginationClick, pageSizeOptions, pageSize, handlePageSizeChange, page }) => {
  const renderPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {

        pageNumbers.push(
          <Pagination.Item key={i} active={i-1 === page} onClick={() => handlePaginationClick(i - 1)}>
            {i}  
          </Pagination.Item>
        );
      }
    } else {
      const startPage = Math.max(1, page - 2);
      const endPage = Math.min(totalPages, startPage + 4);
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <Pagination.Item key={i} active={i-1 === page } onClick={() => handlePaginationClick(i - 1)}>
            {i}
          </Pagination.Item>
        );
      }
    }
    return pageNumbers;
  };

  return (
    <div className='d-flex align-items-center pagination-box'>
      <Pagination>
        <Pagination.Prev onClick={() => handlePaginationClick(page - 1)} disabled={page === 1} />
        {page > 3 && <Pagination.Ellipsis />}
        {renderPageNumbers()}
        {totalPages > 5 && page < totalPages - 2 && <Pagination.Ellipsis />}
        <Pagination.Next onClick={() => handlePaginationClick(page + 1)} disabled={page === totalPages} />
      </Pagination>
      <div>
        <span>Page: </span>
        <select value={pageSize} onChange={(e) => handlePageSizeChange(e.target.value)}>
          {pageSizeOptions.map((size, index) => (
            <option key={index} value={size}>{size}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PaginationComponent;
