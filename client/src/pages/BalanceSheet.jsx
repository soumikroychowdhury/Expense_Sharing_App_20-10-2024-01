import React from 'react';
import axios from 'axios';

const BalanceSheet = () => {
  const downloadCSV = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('/api/expenses/balance-sheet', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob', // Important for file download
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'balance_sheet.csv');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      alert('Failed to download balance sheet');
    }
  };

  return (
    <div>
      <h2>Balance Sheet</h2>
      <button onClick={downloadCSV}>Download CSV</button>
    </div>
  );
};

export default BalanceSheet;
