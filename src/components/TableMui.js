import React, {useEffect} from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
//import getData from "../controllers/getData";
import teeTimes from "../data/teeTimes.json"
import dayjs from "dayjs";
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';


const jsonRows = teeTimes;


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "course_name",
    numeric: false,
    disablePadding: true,
    label: "Course",
  },
  {
    id: "time",
    numeric: true,
    disablePadding: false,
    label: "Time",
  },
  {
    id: "green_fee",
    numeric: true,
    disablePadding: false,
    label: "Green Fee",
  },
  {
    id: "cart_fee",
    numeric: true,
    disablePadding: false,
    label: "Cart Fee",
  },
  {
    id: "total_fee",
    numeric: true,
    disablePadding: false,
    label: "Total",
  },
  
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={ "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{fontWeight: 600}}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [date, setDate] = React.useState(null);
  //TODO use state for api req
  const [rows, setRows] = React.useState([]);

  useEffect(() => {
      /* const fetchData = async()=>{
          const data = await getData();
          console.log(data)
          setRows(data)
      } */

      //TODO call server api to get this data
      //fetchData().catch(console.error)
      setRows(jsonRows)
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDateChange = (newValue)=>{
    const filteredRows = jsonRows.filter(row=>{
        const time = row.time;
        return dayjs(newValue).isSame(time, 'day')
    })
        console.log('filteredRows', filteredRows)
        setRows(filteredRows);
        setDate(newValue);
      
  }

  

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: "100%", margin: "auto" }}>
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Tee Times
      </Typography>
      <div style={{margin: '15px 0px'}}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        
        renderInput={(props) => <TextField {...props} />}
        label="DateTimePicker"
        value={date}
        onChange={handleDateChange}
      />
    </LocalizationProvider>
      </div>
      
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  if(!row.green_fee){
                      console.log('green', row)

                  }
                  const convertToDollar = (int)=>{
                    var formatter = new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      
                        // These options are needed to round to whole numbers if that's what you want.
                        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
                        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
                      });

                      return int ? formatter.format(int) : "?"
                  }
                

                  const totalFee = convertToDollar(row.green_fee + row.cart_fee)
                  //const groupSizes = row.allowed_group_sizes.join(",")
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.uuid}
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="5px"
                      >
                        {row.course_name}
                      </TableCell>
                      <TableCell align="right">{dayjs(row.time).format('MM/DD/YY hh:mma')}</TableCell>
                      <TableCell align="right">{convertToDollar(row.green_fee)}</TableCell>
                      <TableCell align="right">{convertToDollar(row.cart_fee)}</TableCell>
                      <TableCell align="right">{totalFee}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
