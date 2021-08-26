import React, { useMemo, useEffect, useState, useContext } from 'react';
import { useTable } from 'react-table';
import axios from 'axios';
import styles from './PersonalInfo.module.scss';
import { tokenContext } from '../../../App';
const PersonalInfo = () => {
  const { token } = useContext(tokenContext);

  const [personalDetails, setPersonalDetails] = useState({});
  const data = useMemo(() => [personalDetails], [personalDetails]);
  const columns = useMemo(
    () =>
      Object.keys(personalDetails).map((key) => {
        return { Header: key, accessor: key };
      }),
    [personalDetails]
  );

  useEffect(() => {
    // fetch user details
    (async () => {
      const response = await axios.post(
        'https://private-052d6-testapi4528.apiary-mock.com/authenticate',
        { token }
      );
      console.log(response);
      setPersonalDetails(response.data[0].personalDetails);
    })();
  }, [token]);

  const tableInstance = useTable({ columns, data });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <table className={styles.personalInfo} {...getTableProps()}>
      <thead>
        {
          // Loop over the header rows
          headerGroups.map((headerGroup) => (
            // Apply the header row props
            <tr {...headerGroup.getHeaderGroupProps()}>
              {
                // Loop over the headers in each row
                headerGroup.headers.map((column) => (
                  // Apply the header cell props
                  <th {...column.getHeaderProps()}>
                    {
                      // Render the header
                      column.render('Header')
                    }
                  </th>
                ))
              }
            </tr>
          ))
        }
      </thead>
      {/* Apply the table body props */}
      <tbody {...getTableBodyProps()}>
        {
          // Loop over the table rows
          rows.map((row) => {
            // Prepare the row for display
            prepareRow(row);
            return (
              // Apply the row props
              <tr {...row.getRowProps()}>
                {
                  // Loop over the rows cells
                  row.cells.map((cell) => {
                    // Apply the cell props
                    return (
                      <td {...cell.getCellProps()}>
                        {
                          // Render the cell contents
                          cell.render('Cell')
                        }
                      </td>
                    );
                  })
                }
              </tr>
            );
          })
        }
      </tbody>
    </table>
  );
};

export default PersonalInfo;
