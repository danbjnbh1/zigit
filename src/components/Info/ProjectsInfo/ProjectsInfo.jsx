import React, { useEffect, useState, useMemo, useContext } from 'react';
import axios from 'axios';
import { useTable, useSortBy } from 'react-table';
import styles from './ProjectsInfo.module.scss';
import { tokenContext } from '../../../App';

const ProjectsInfo = () => {
  const { token } = useContext(tokenContext);
  const [projects, setProjects] = useState([{}]);
  const averageScore = useMemo(
    // calculate the average score
    () =>
      projects.reduce((sum, project) => {
        return sum + project.score;
      }, 0) / projects.length,
    [projects]
  );
  const onDeadLine = useMemo(
    //calculate the percentage of projects that stood in Deadline:
    () =>
      (projects.reduce((num, project) => {
        return project.madeDadeline === 'true' ? num + 1 : num;
      }, 0) /
        projects.length) *
      100,
    [projects]
  );
  const columns = useMemo(
    () =>
      Object.keys(projects[0]).map((key) => {
        return { Header: key, accessor: key };
      }),
    [projects]
  );
  const data = useMemo(() => projects, [projects]);

  const getRowProps = (row) => {
    let rowColor;
    if (row.original.score > 90) {
      rowColor = 'green';
    } else if (row.original.score < 70) {
      rowColor = 'red';
    }
    return {
      style: {
        background: rowColor,
      },
    };
  };

  const tableInstance = useTable({ columns, data }, useSortBy);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  useEffect(() => {
    (async () => {
      // fetch all the projects
      let { data } = await axios.get(
        'https://private-052d6-testapi4528.apiary-mock.com/info',
        {
          headers: {
            Authorization: `Berear ${token}`,
          },
        }
      );
      data = data.map((project) => {
        // converts all the booleans to Strings
        return {
          ...project,
          madeDadeline: project.madeDadeline.toString(),
        };
      });
      setProjects(data);
    })();
  }, [token]);
  return (
    <>
      <p>Average score: {averageScore}</p>
      <p>Percentage of projects that stood in Deadline: {onDeadLine}</p>

      <table className={styles.projectsInfo} {...getTableProps()}>
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
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render('Header')}
                      {/* Add a sort direction indicator */}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? ' 🔽'
                            : ' 🔼'
                          : ''}
                      </span>
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
                <tr {...row.getRowProps(getRowProps(row))}>
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
    </>
  );
};

export default ProjectsInfo;
