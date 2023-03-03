import {
    Box, 
    TextField, 
    Button,
    MenuItem
  } from '@mui/material';
  import dayjs from 'dayjs';
  import React, { useEffect, useState, useMemo, useCallback } from 'react';
  import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
  import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
  import {CustomizedProgressBars} from '../src/components/Layout/loader';
  import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
  import styles from "../styles/apr.module.css";
 
  import MUIDataTable from "mui-datatables";
  import { format } from 'date-fns';
  import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
  import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
  import LocalPrintshopRoundedIcon from '@mui/icons-material/LocalPrintshopRounded';
  import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
  import { useAppContext } from '../src/models/withAuthorization';
  import Table from '@mui/material/Table';
  import TableBody from '@mui/material/TableBody';
  import TableCell from '@mui/material/TableCell';
  import TableContainer from '@mui/material/TableContainer';
  import TableHead from '@mui/material/TableHead';
  import TableRow from '@mui/material/TableRow';
  import Paper from '@mui/material/Paper';
  import { useReducer } from 'react';
import { width } from '@mui/system';
import { stat } from 'fs';

  const initialState = {
    loading: false,
    items: [],
    filter_date_from: "",
    filter_date_to: "",
    filter_state: "",
    rowcount: 10,
    total: 0,
    page: 0,
    filter: false,
  } 

  

  const reducer = (state, action) => {
    const items = [...state.items];
    switch (action.type) {
      case 'ITEMS_REQUESTED':
        return {...state, items:[], loading: true}
      case 'ITEMS_RECEIVED':
        return {...state, loading: false, items: action.items, total: action.total }
      case 'CHANGE_ROW':
        return {...state, rowcount: action.rowcount}
      case 'CHANGE_PAGE':
        return {...state, page: action.page}
      case 'SET_APPROVED':        
        const item = {
          ...items[action.rowIndex],
          action: 'Ápproved',
          state: 'Approved'
        }
        items[action.rowIndex] = item;
        return {...state, items: items}
      case 'SET_CANCEL':
        const itemcancel = {
          ...items[action.rowIndex],
          action: 'Cancel',
          state: 'Cancel'
        }
        items[action.rowIndex] = itemcancel;
        return {...state, items: items}
      case 'FILTER_DATE_F':
        return {...state, filter_date_from: action.filter_date_from}
      case 'FILTER_DATE_T':
          return {...state, filter_date_to: action.filter_date_to}
      case 'FILTER_STATE':
        return {...state, filter_state: action.filter_state}
      case 'FILTER_TEXT':
        return {...state, filter_text: action.filter_text}
      case 'SET_FILTER':
        return {...state, filter: true}
      case 'SET_CLEAR':
        return {...state, filter_date_from: "", filter_date_to: "", filter_state: "", filter: false, filter_text: ""}
      default:
        return state;

    }
  } 

  export default function GridPRQ({createNotif}){

    const [state, dispatch] = useReducer(reducer, initialState)
    const { isAuthenticated, user} = useAppContext();
    const [strQuery, setQuery] = useState("");
    const userObj = user;

    const updateState = async(id, status, username) => {
      const res = await fetch('/api/prq',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'updateState': true,
          'id': id,
          'state': status,
          'user': username
      })
      })
      const result = await res.json();
      return result;
    }

    const getApiPrQ = async (strQuery = "", page) => {
        dispatch({type: 'ITEMS_REQUESTED'})
        setTimeout( async () => {
          const res = await fetch('/api/prq',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'appSearch': true,
                'searchQuery': strQuery,
                'page': page,
                'rowpage': state.rowcount
            })
          });
          const newData = await res.json();
          // set Format date JS
          if (newData){
            let rec_data = []; 
            newData.data.forEach(element => {
              let eldata = [];
              if (element.data){
                element.data.split("-;").forEach(item => {
                  const itemArr = item.split("-|");
                  eldata.push([
                    itemArr[0],
                    dayjs(itemArr[1]).format("DD-MM-YYYY"),
                    itemArr[2],
                    itemArr[3]
                  ])  
                })
              }
              rec_data.push({...element, 'date': dayjs(element.date).format("DD-MM-YYYY"), data: eldata})
            });
            dispatch({ type: 'ITEMS_RECEIVED' ,items: rec_data, total: newData.total})
          }
        },1000);
  
      }

      const CustomSearchRender = (props) => {
        return ( 
          <div>
            <TextField 
              label="Search"
              placeholder={'Search PRQ'}
              size="small"
              type="search"
              variant='standard'
              value={props.searchText}
              style={{ width: '75%'}}
              onChange={(e) => {
                if (!e.target.value){
                  dispatch({'type': 'SET_CLEAR'});
                  props.onSearch(e.target.value);
                  props.onClose()
                }
                props.onSearch(e.target.value)
              }}/>
              <Button >
               <SearchOutlinedIcon sx={{ mt: 2}} onClick={(e) => {
                dispatch({'type': 'FILTER_TEXT', filter_text: props.searchText})
                props.onClick()
               }}></SearchOutlinedIcon>
              </Button>
              
            </div>
            )
      }

    const customSearch = async (strQuery, page) => {
        await getApiPrQ(strQuery,page)
    }

    const filterSearch = async () => {
      customSearch(strQuery,0);
    }

    // fn callback
    function useCallBackc(callback) {
      useEffect(() => {
        callback(); // performing action after state has updated
      }, [callback]);
    }
    
    const generateStr = () => {
      let tempQuery = "";
      if (state.filter_date_from){
        tempQuery += ` and DATE(prq.date) >= '${state.filter_date_from}'`
      } 

      if (state.filter_date_to){
        tempQuery += ` and DATE(prq.date) <= '${state.filter_date_to}'`
      }
      
      if (state.filter_state === "To Approve"){
        tempQuery += `and (prq.aprov is null or prq.aprov = 0) `
      } else if (state.filter_state === "Approved"){
        tempQuery += `and prq.aprov = 1`
      }
      setQuery(tempQuery);
    }

    useMemo(() => generateStr(), [state.filter_date_from, state.filter_date_to, state.filter_state, state.filter_text])
    useMemo(() => filterSearch(), [state.page, state.rowcount]);

    // call state useEffect tes
    const cSearch = useCallback(() =>{ 
      console.log(strQuery)
      customSearch(strQuery,0);
    }, [strQuery]);

    //useMemo(() => filterSearch(), [state.filter])

    const columns = [{
        name: "prq",
        label: "No.PRQ",
        options: {
            filter: false,
            sort: true,
            }
        },
        {
            name: "date",
            label: "Date",
            options: {
                filter: true,
                sort: false,
                filterType: 'custom',
                display: true,
                filterOptions: {
                  names: [],
                  fullWidth: true,
                  logic: (location, filters, row) => {
                    // console.log(filters);
                    // console.log(row);
                    if (filters.length) return !filters.includes(location);
                    return false;
                  },
                  display: (filterList, onChange, index, column) => {
                    return (
                      <>
                      <DesktopDatePicker
                        id="from_date"
                        name="from_date"
                        label="From Date"
                        inputFormat="DD/MM/YYYY"
                        value={state.filter_date_from}
                        style={{ width: '100%'}}
                        onChange={(val) => {
                          dispatch({type: 'FILTER_DATE_F', filter_date_from: format(val.$d,"yyyy-MM-dd")})
                        //  filterList[index][0] = format(val.$d,"yyyy-MM-dd")
                        //  onChange(filterList[index], index, column);
                        }}
                        renderInput={(params) =>
                          <TextField {...params}
                            size="small"
                            id="d_date"
                            name="d_date"
                            style={{ width: '100%'}}
                            />}
                      /> - 
                      <DesktopDatePicker
                        id="to_date"
                        name="to_date"
                        label="To Date"
                        inputFormat="DD/MM/YYYY"
                        value={state.filter_date_to}
                        style={{ width: '100%'}}
                        onChange={(val) => {
                          dispatch({type: 'FILTER_DATE_T', filter_date_to: format(val.$d,"yyyy-MM-dd")})
                          // filterList[index][1] = format(val.$d,"yyyy-MM-dd")
                          // onChange(filterList[index], index, column);
                        }}
                        renderInput={(params) =>
                          <TextField {...params}
                            size="small"
                            id="d_date"
                            name="d_date"
                            style={{ width: '100%'}}
                            />}
                    />
                      </>
                    );
                  }
                }
            }
        },
        {
            name: "request",
            label: "Request by",
            options: {
                filter: false,
                sort: false
            }
        },
        {
            name: "ket",
            label: "Keterangan",
            options: {
                filter: false,
                sort: false
            }
        },
        {
            name: "statee",
            label: "Action",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                  if (value === "Approved"){
                    return (<Button  title='Cancel'>
                    <CancelOutlinedIcon sx={{'color':'red'}} variant="contained" title="Cancel" onClick={async () => {
                      const res = await updateState(tableMeta.rowData[0], 'cancel', userObj.user_approve)
                      if (res.error){
                        return createNotif('error',res.error.message, 'Error')
                      } else {
                        if (res.state === "cancel"){
                          dispatch({type: 'SET_CANCEL', rowIndex: tableMeta.rowIndex})
                          return createNotif('success', 'Data Has Been Update', 'Success')
                        }
                      }
                    }}>
                    </CancelOutlinedIcon>
                  </Button>)
                  } else if (value === "To Approve") {
                    return (<Button title='Approved'>
                  <DoneAllRoundedIcon variant="contained" title="Approved" onClick={async () => {
                    const res = await updateState(tableMeta.rowData[0], 'approved', userObj.user_approve)
                    if (res.error){
                      return createNotif('error',res.error.message, 'Error')
                    } else {
                      if (res.state === "approved"){
                        dispatch({type: 'SET_APPROVED', rowIndex: tableMeta.rowIndex})
                        return createNotif('success', 'Data Has Been Update', 'Success')
                      } 
                    }
                  }}>
                  </DoneAllRoundedIcon>
                </Button>)
                  } else {
                    return ("");
                  }
                }
            }
        },
        {
            name: "statee",
            label: "State",
            options: {
                filter: true,
                sort: false,
                filterType: 'custom',
                customBodyRender: (value, tableMeta, updateValue) => {
                  if (value === "Approved"){
                    return (<div className={`${styles.w3tag} ${styles.w3round} ${styles.w3green} ${styles.w3border}  ${styles.w3borderwhite}`}>{value}</div>)  
                  } else if (value === "To Approve") {
                    return (<div className={`${styles.w3tag} ${styles.w3round} ${styles.w3blue} ${styles.w3border}  ${styles.w3borderwhite}`}>{value}</div>)
                  } else{
                    return (<div className={`${styles.w3tag} ${styles.w3round} ${styles.w3red} ${styles.w3border}  ${styles.w3borderwhite}`}>{value}</div>)
                  }
                  
                },
                
                filterOptions: {
                  names: [],
                  fullWidth: true,
                  logic: (location, filters, row) => {
                    if (filters.length) return !filters.includes(location);
                    return false;
                  },
                  display: (filterList, onChange, index, column) => {  
                    const optionValues = ["" ,'To Approve','Approved']
                    return (
                      <TextField
                        select
                        value={state.filter_state}
                        label="State"
                        size="small"
                        onChange={ (event) => {
                          //filterList[index] = [event.target.value];
                          dispatch({type: 'FILTER_STATE', filter_state: event.target.value})
                        }}
                      >
                        {optionValues.map(item => (
                          <MenuItem key={item} value={item}>
                            {item}
                          </MenuItem>
                        ))}
                      </TextField>
                    );
                }
              }
            }
        },
        {
          name: "data",
          label: "Data",
          options: {
            filter: false,
            display: false,
          }
        }

    ]

    const options = {
        selectableRows: 'none',
        count: state.total,
        page: state.page,
        // filterType: "multiselect",
        serverSide: true,
        confirmFilters: true,
        expandableRows: true,
        expandableRowsHeader: false,
        
        expandableRowsOnClick: false,
        renderExpandableRow: (rowData, rowMeta) => {
          const colSpan = rowData.length + 1;
          return (
          <TableRow>
            <TableCell align="center" colSpan={colSpan}>
              <div align="center">
                <Table sx={{width: "50%"}} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>Nama</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Qty</TableCell>
                    <TableCell align="right">Unit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    rowData[6].map(row =>  
                    (<TableRow key={row[0]}>
                      <TableCell component="th" scope="row">
                        {row[0]}
                      </TableCell>
                      <TableCell>{row[1]}</TableCell>
                      <TableCell align="right">{parseFloat(row[2]).toLocaleString("en-US", {minimumFractionDigits: 2})}</TableCell>
                      <TableCell>{row[3]}</TableCell>
                      </TableRow>
                  ))
                  }
                </TableBody>
                </Table>
              </div>
            </TableCell>
          </TableRow>
          );
        },
        rowsPerPage: state.rowcount,
        onChangeRowsPerPage: (numberOfRows) => {
          dispatch({type: 'CHANGE_ROW', rowcount: numberOfRows})
        },
        onChangePage: (currentPage) => {
          dispatch({type: 'CHANGE_PAGE', page: currentPage})
        },
        // Calling the applyNewFilters parameter applies the selected filters to the table 
        customFilterDialogFooter: (currentFilterList, applyNewFilters) => {
          return (
            <div style={{ marginTop: '40px' }}>
              <Button variant="contained" onClick={async () => {
                applyNewFilters();
                dispatch({type: 'SET_FILTER'});
                cSearch();
                dispatch({type: 'SET_CLEAR'});
              }
              }>Apply Filters</Button>
              <Button variant="outlined" sx={{ marginLeft: '4px'}} onClick={() => {
                applyNewFilters();
                dispatch({type: 'SET_CLEAR'});
                cSearch();
            } }>Clear</Button>
            </div>
          );
        },
        searchPlaceholder: 'Type PRQ to Search',
        textLabels: {
          body: {
              noMatch: state.loading ?
                  <CustomizedProgressBars /> :
                  'SORRY_THERE_IS_NO_MATCHING_DATA_TO_DISPLAY'
          }
        },
        confirmFilters: true,
        onFilterConfirm: (filterList) => {
          //filterSearh()
          //console.dir(filterList);
        },
  
        onFilterDialogOpen: () => {
          // console.log('filter dialog opened');
        },
        onFilterDialogClose: () => {
          // console.log('filter dialog closed');
        },
        onFilterChange: (column, filterList, type) => {
          // console.log('updating filters via chip');
          
        },
        customSearchRender: (searchText, handleSearch, hideSearch, options) => {
          
         
          return (
            <CustomSearchRender
              searchText={searchText? searchText : ''}
              onSearch={handleSearch}
              onHide={hideSearch}
              options={options}
              onClose={() => {customSearch("",0)}}
              onClick={() => { 
                  customSearch(`and prq.prq like '%${searchText}%'`,0)
                }}
            />
          )}
      };

    return ( <Box
        sx=
        {
            {
                bgcolor: 'background.paper',
                boxShadow: 0,
                borderRadius: 2,
                p: 2,
                minWidth: 300,
                margin: 3,
            }
        }
      >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MUIDataTable 
            tableBodyHeight="auto"
            title={"PRQ Approval"} 
            data={state.items} 
            columns={columns} 
            options={options} 
            />
          </LocalizationProvider>
      </Box> 
    )

  }
