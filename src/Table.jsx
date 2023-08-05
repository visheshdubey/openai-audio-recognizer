import React, { useState } from "react";

const CSVTable = ({ csvText }) => {
  const [data, setData] = useState([]);

  // Parse the CSV text into an array of rows and columns
  const parseCSV = (csvText) => {
    const rows = csvText.trim().split("\n");
    const headers = rows[0].split(",");
    const data = rows.slice(1).map((row) => row.split(","));
    return { headers, data };
  };

  // Convert the parsed data into a table
  const renderTable = (headers, data) => (
    <table>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  // Update the table data when the CSV text changes
  React.useEffect(() => {
    const { headers, data } = parseCSV(csvText);
    setData({ headers, data });
  }, [csvText]);

  return (
    <div>
      {data.headers.length > 0 && data.data.length > 0 ? (
        renderTable(data.headers, data.data)
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default CSVTable;
