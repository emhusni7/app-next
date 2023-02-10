import {
    Box, 
    TextField, 
    Button,
    MenuItem
  } from '@mui/material';
  import dayjs from 'dayjs';
  import React, { useEffect, useState } from 'react';
  import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
  import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
  import {CustomizedProgressBars} from '../src/components/Layout/loader';
  import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
  import { purchaseObj } from './api/pos';
  import styles from "../styles/apr.module.css";
  import MUIDataTable from "mui-datatables";
  import FormControl from '@mui/material';
  import { format } from 'date-fns';
  import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
  import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
  import LocalPrintshopRoundedIcon from '@mui/icons-material/LocalPrintshopRounded';
  import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
  import { useAppContext } from '../src/models/withAuthorization';
  import ViewPdf from './viewerPdf';


 function GridPO({page, total, onprint, onMsg}){
    
    const [tbpage, setPage] = useState(page);
    const [tot, setTot] = useState(total);
    const [rowpages, setRowPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [dateFilter, setDate] = useState(null);
    const [dateFilterTo, setDateTo] = useState(null);
    const [appState, setApp] = useState(null);

    const { isAuthenticated, user} = useAppContext();
    const userObj = user;

    const getApiPos = async (strQuery, page) => {
      setLoading(true);
      setData([]);
      setTimeout( async () => {
        const res = await fetch('/api/pos',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              'appSearch': true,
              'searchQuery': strQuery,
              'page': tbpage,
              'rowpage': rowpages
          })
        });
        const newData = await res.json();
        console.log(newData);
        // set Format date JS
        const rec_data = newData.data.map((item) => {
          return {...item, 'date': dayjs(item.date).format("DD-MM-YYYY")}
        })
        
        setTot(newData.total[0].total);
        setData(rec_data);
        setLoading(false);
      },1000);

    }

    // triger search
    const customFilter = async (searchQuery) => {
      let strQuery = ``
        if (!userObj.state){
          strQuery = ` WHERE oms.aprov = 0 `
        } else {
          const params = userObj.state.map(x => `'${x}'`);
          const newparams = params.join(",");
          strQuery = ` WHERE oms.state in (${newparams})`
        }

      if (searchQuery){
        strQuery += ` and (oms.oms like '%${searchQuery}%' or s.sub like '%${searchQuery}%' or s.name like '%${searchQuery}%') `
      }

      if (appState){
        strQuery += ` and oms.state = '${appState}'`
      }

      if(dateFilter) {
        const dateF = format(dateFilter.$d,"yyyy-MM-dd");
        strQuery += ` and DATE(oms.date) >= '${dateF}'`
      }

      if(dateFilterTo){
        const dateTo = format(dateFilterTo.$d,"yyyy-MM-dd");
        strQuery += ` and DATE(oms.date) <= '${dateTo}'`
      }

      await getApiPos(strQuery, page);
  }
  
  const updateStatePos = async (rowIndex ,id, state, updateValue) => {

    await setTimeout( async () => {
      const res = await fetch('/api/pos',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'updateState': true,
            'id': id,
            'state': state,
            'user': userObj.user_approve
        })
      });
      const res2 = await res.json();
      if (!res2.error){
        updateValue(res2.state);
        let items = [...data];
        let item = {
          ...items[rowIndex],
          action: res2.state,
          state: res2.state
        }
        items[rowIndex] = item;
        setData(items);
        onMsg('success','Data has been Update', 'Success')
      } else{
        onMsg('Error',res2.error.message, 'Error')
      }
  });
}

  useEffect(() => {
    if (rowpages){
      customFilter();
    }
    () => {}},[rowpages, tbpage, page])

    // https://codesandbox.io/s/github/gregnb/mui-datatables
    
    const CustomSearchRender = (props) => {
      return ( 
        <div>
          <TextField 
            label="Search"
            placeholder={'Search PO / Supplier'}
            size="small"
            type="search"
            variant='standard'
            value={props.searchText}
            style={{ width: '75%'}}
            onChange={(e) => {
              if (!e.target.value){
                setApp(null);
                setDate(null);
                setPage(0);
                props.onClick('');
              }
              props.onSearch(e.target.value);
            }}/>
            <Button >
             <SearchOutlinedIcon sx={{ mt: 2}} onClick={(e) => {props.onClick(props.searchText)}}></SearchOutlinedIcon>
            </Button>
            
          </div>
          )
    }

     const columns = [
        {
         name: "oms",
         label: "No.PO",
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
          display: true,
          filterType: 'custom',
          filterOptions: {
            fullWidth: true,
            logic: (location, filters, row) => {
              if (filters.length) return !filters.includes(location);
              return false;
            },
            display: (filterList, onChange, index, type) => {
              return (
                <>
                <DesktopDatePicker
                  id="from_date"
                  name="from_date"
                  label="From Date"
                  inputFormat="DD/MM/YYYY"
                  value={dateFilter}
                  style={{ width: '100%'}}
                  onChange={(val) => {
                    setDate(val);
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
                  value={dateFilterTo}
                  style={{ width: '100%'}}
                  onChange={(val) => {
                    setDateTo(val);
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
         name: "supplier",
         label: "Supplier",
         options: {
          filter: false,
          sort: false,
         }
        },
        {
         name: "cur",
         label: "Currency",
         options: {
          filter: false,
          sort: false,
         }
        },
        {
            name: "val",
            label: "Total",
            options: {
            setCellHeaderProps: () => ({ align: 'right' }),
            setCellProps: () => ({
                align: "right",
              }),
             filter: false,
             sort: false,
             customBodyRender: (value, tableMeta, updateValue) => {
              return value.toLocaleString("en-US", {minimumFractionDigits: 2})
             }
            },
           },
          {
            name: "action",
            label: "Action",
            options:{
              filter: false,
              sort: false,
              setCellHeaderProps: () => ({ align: 'left' }),
              customBodyRender: (value, tableMeta, updateValue) => {
                if (userObj.po_approval_akses){
                    return (
                      <div>
                        { 
                        // akses to approval
                        
                          userObj.po_approval_akses.to_approval && (value == "none" || value == 'cancel') ?
                            (<Button title='To Approval'>
                            <CheckOutlinedIcon variant="contained" title="To Approval" onClick={() => {
                              updateStatePos(tableMeta.rowIndex, tableMeta.rowData[0], 'to_approve', updateValue);
                            }}>
                            </CheckOutlinedIcon>
                          </Button>): ("")
                        } 
                        {
                          // akses approved
                          userObj.po_approval_akses.approved && value == 'to_approve' ? 
                          (<Button title='Approved'>
                          <DoneAllRoundedIcon variant="contained" title="Approved" onClick={() => {
                            updateStatePos(tableMeta.rowIndex, tableMeta.rowData[0], 'approved', updateValue);
                          }}>
                          </DoneAllRoundedIcon>
                        </Button>): ("")
                        }
                        {
                          // akses cancel
                          userObj.po_approval_akses.cancel_approval && value == "to_approve" ?
                          (<Button  title='Cancel'>
                          <CancelOutlinedIcon sx={{'color':'red'}} variant="contained" title="Cancel" onClick={() => {
                            updateStatePos(tableMeta.rowIndex, tableMeta.rowData[0], 'cancel', updateValue);
                          }}>
                          </CancelOutlinedIcon>
                        </Button>): ("")
                        }
                        {
                          // akses cancel
                          userObj.po_approval_akses.cancel_approved && value == "approved" ?
                          (<Button  title='Cancel'>
                          <CancelOutlinedIcon sx={{'color':'red'}} variant="contained" title="Cancel" onClick={() => {
                            updateStatePos(tableMeta.rowIndex, tableMeta.rowData[0], 'cancel', updateValue);
                          }}>
                          </CancelOutlinedIcon>
                        </Button>): ("")
                        }
                        
                          <Button onClick={(e) => onprint(tableMeta.tableData[tableMeta.rowIndex][0])}>
                            <LocalPrintshopRoundedIcon sx={{'color': 'black'}}></LocalPrintshopRoundedIcon>
                          </Button>
                      </div>
                    );
                  }
                else {
                  return ("");
                }
              }
            }
          },
          {
            name: "state",
            label: "State",
            options: {
              display: true,
              filterType: 'custom',
              customBodyRender: (value, tableMeta, updateValue) => {
                if (value === 'none'){
                  return (<div className={styles.state_new}>New</div>)
                } else if ( value === 'to_approve'){
                  return (<div className={styles.state_apr}>To Approve</div>)
                } else if (value === 'cancel'){
                  return (<div className={styles.state_cancel}>Cancel</div>)
                } else {
                  return (<div className={styles.state_apr}>Approved</div>)
                }
              },
              filterOptions: {
                fullWidth: true,
                display: (filterList, index ) => {  
                  const optionValues = ['to_approve','approve']
                  return (
                    <TextField
                      select
                      value={appState}
                      label="State"
                      size="small"
                      onChange={ (event) => {
                        setApp(event.target.value);
                      }}
                    >
                      {optionValues.map(item => (
                        <MenuItem key={item} value={item}>
                          {item == 'to_approve' ? 'To Approve' : 'Approve'}
                        </MenuItem>
                      ))}
                    </TextField>
                  );
              }
            }
            }
          }
       ];

    
    const options = {
      selectableRows: 'none',
      count: tot,
      page: tbpage,
      // filterType: "multiselect",
      serverSide: true,
      rowsPerPage: rowpages,
      onChangeRowsPerPage: (numberOfRows) => {
        setRowPage(numberOfRows);
      },
      onChangePage: (currentPage) => {
        setPage(currentPage);
      },
      // Calling the applyNewFilters parameter applies the selected filters to the table 
      customFilterDialogFooter: (currentFilterList, applyNewFilters) => {
        return (
          <div style={{ marginTop: '40px' }}>
            <Button variant="contained" onClick={() => {
              customFilter()
            } }>Search</Button>
            <Button variant="outlined" sx={{ marginLeft: '4px'}} onClick={() => {
              setApp(null);
              setDate(null);
              setDateTo(null);
              setPage(0);
              customFilter();
            } }>Clear</Button>
          </div>
        );
      },
      searchPlaceholder: 'Type PO/Supplier  to Search',
      textLabels: {
        body: {
            noMatch: loading ?
                <CustomizedProgressBars /> :
                'SORRY_THERE_IS_NO_MATCHING_DATA_TO_DISPLAY'
        }
      },
      confirmFilters: true,
      customSearchRender: (searchText, handleSearch, hideSearch, options) => {
        return (
          <CustomSearchRender
            searchText={searchText? searchText : ''}
            onSearch={handleSearch}
            onHide={hideSearch}
            options={options}
            onClick={customFilter}
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
            title={"PO Approval"} 
            data={data} 
            columns={columns} 
            options={options} 
            />
          </LocalizationProvider>
          
      </Box> )
  }

export default function POForm({createNotif}){
  const [print, setPrint] = useState(false);
  const [id, setId] = useState("");
  const printPO = (newId) => {
    setPrint(true);
    setId(newId);
  }
  const backMenu = () => {
    setId("");
    setPrint(false);
  }

  if (!print){
    return (<GridPO page={0} total={10} onprint={printPO} onMsg={createNotif}></GridPO>)
  } else{
    return (<ViewPdf id={id} report_type="pos_approval" onBack={backMenu} />)
  }
}

// export async function getServerSideProps(props){
//     return { props: { 
//         page: 0,
//         total: 10, 
//       }
//     }
//   }
