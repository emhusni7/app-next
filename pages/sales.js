import {
    Box, 
    TextField, 
    Button
  } from '@mui/material';
  
  import React, { useEffect, useState } from 'react';
  import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
  import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
  import {CustomizedProgressBars} from '../src/components/Layout/loader';
  import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
  import MUIDataTable from "mui-datatables";
  import LocalPrintshopRoundedIcon from '@mui/icons-material/LocalPrintshopRounded';
  import { useAppContext } from '../src/models/withAuthorization';
  import PublishIcon from '@mui/icons-material/Publish';
  import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
  import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
  import ViewPdf from './viewerPdf';
  import dayjs from 'dayjs';
  

  function GridSale({page, rowPage, onprint, onMsg}){
    const [tbpage, setPage] = useState(page);
    const [rowpages, setRowPage] = useState(rowPage);
    const [tot, setTotal] = useState(0)
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
   
    const { isAuthenticated, user} = useAppContext();
    const userObj = user;

    const getApiSales = async (strQuery, page) => {
      setLoading(true);
      setData([]);
      setTimeout( async () => {
        const res = await fetch('/api/sales',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              'query': strQuery,
              'page': tbpage,
              'rowpage': rowpages
          })
        });
        const newData = await res.json();
        const rec_data = newData.data.map((item) => {
          return {...item, 'so_date': dayjs(item.so_date).format("DD/MM/YYYY")}
        })
       
       setTotal(newData.total);
       setData(rec_data);
       setLoading(false);
      },1000);
    }

    // triger search
    const customFilter = async (searchQuery, page) => {
      let strQuery = ``
      const params = userObj.so_state.map(x => `'${x}'`);
      const newparams = params.join(",");
      strQuery = ` WHERE coalesce(so.state,'') in (${newparams}) and (so.okl like '%${searchQuery}%' or c.name like '%${searchQuery}%')`
      await getApiSales(strQuery, page);
  }
  
  const updateStatus = async (rowIndex ,id, from_state, to_state, updateValue) => {
    await setTimeout( async () => {
      const res = await fetch('/api/sales',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'updateState': true,
            'id': id,
            'from_state': from_state,
            'to_state': to_state,
        })
      });
      const result = await res.json();
      if (result.changedRows){
        updateValue(to_state);
        let items = [...data];
        let item = {
          ...items[rowIndex],
          action:to_state,
          state: to_state
        }
        items[rowIndex] = item;
        setData(items);
        onMsg('success','Success', 'Success');
      } else{
        onMsg('error','Error','Error');
      }
      
  });
}

  useEffect(() => {
    if (rowpages){
      customFilter('',page);
    }
    () => {}},[ rowpages, tbpage, page])

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
         name: "okl",
         label: "No. OKL",
         options: {
          filter: false,
          sort: false,
         }
        },
        {
         name: "name",
         label: "Name",
         options: {
          filter: false,
          sort: false,
         }
        },
        {
         name: "address",
         label: "Address",
         options: {
          filter: false,
          sort: false,
         }
        },
        {
         name: "so_date",
         label: "SO Date",
         options: {
          filter: false,
          sort: false,
         }
        },
        {
            name: "nopoc",
            label: "No. POC",
            options: {
             filter: false,
             sort: false,
            },
        },
        {
          name: "ketlain",
          label: "Keterangan Lain",
          options: {
           filter: false,
           sort: false,
          },
        },
        {
          name: "action",
          label: "State",
          options:{
            filter: false,
            sort: false,
            setCellHeaderProps: () => ({ align: 'center' }),
            customBodyRender: (value, tableMeta, updateState) => {
              if (userObj.so_approval_akses){
                let from_state, to_state = "";
                if(value == "publish"){
                  from_state = "publish";
                  to_state = "done";
                } else{
                  from_state = "";
                  to_state = "publish";
                }
                if ( userObj.so_approval_akses.to_publish && (!value || value == 'cancel')){
                  return (
                    <Button label="Publish" onClick={(e) => updateStatus(tableMeta.rowIndex ,tableMeta.tableData[tableMeta.rowIndex].okl, from_state, to_state, updateState)}>
                      <PublishIcon label="Publish"></PublishIcon>
                    </Button>)
                } else if(userObj.so_approval_akses.to_done && value == "publish") {
                  return (
                    <Button label="Done" onClick={(e) => updateStatus(tableMeta.rowIndex ,tableMeta.tableData[tableMeta.rowIndex].okl, from_state, to_state, updateState)}>
                      <PublishedWithChangesIcon label="Done"></PublishedWithChangesIcon>
                    </Button>)
                }

                if (userObj.so_approval_akses.to_cancel_publish && value == "publish"){
                  return (<Button sx={{'color':'red'}} label="Cancel" onClick={(e) => updateStatus(tableMeta.rowIndex ,tableMeta.tableData[tableMeta.rowIndex].okl, 'publish', 'cancel', updateState)}>
                        <CancelOutlinedIcon label="Cancel"></CancelOutlinedIcon>
                      </Button>)
                }

                if (userObj.so_approval_akses.to_cancel_done && value == "done"){
                  return (<Button sx={{'color':'red'}} label="Cancel" onClick={(e) => updateStatus(tableMeta.rowIndex ,tableMeta.tableData[tableMeta.rowIndex].okl, 'done', 'cancel', updateState)}>
                            <CancelOutlinedIcon label="Cancel"></CancelOutlinedIcon>
                        </Button>)
                }

              }
              
              
            }
          }
        },
        {
          name: "action",
          label: "Action",
          options: {
            filter: false,
            sort: false,
            setCellHeaderProps: () => ({ align: 'left' }),
            customBodyRender: (value, tableMeta, updateState) => {
              return (
              <Button onClick={(e) => onprint(tableMeta.tableData[tableMeta.rowIndex].okl)}>
                <LocalPrintshopRoundedIcon sx={{'color': 'black'}}></LocalPrintshopRoundedIcon>
              </Button>)
            }
          }
        }

       ];

    
    const options = {
      selectableRows: 'none',
      count: tot,
      page: tbpage,
      serverSide: true,
      rowsPerPage: rowpages,
      filter: false,
      download: false,
      print: false,
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
              setPage(0);
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
            title={"Sales Contract"} 
            data={data} 
            columns={columns} 
            options={options} 
            />
          </LocalizationProvider>
          
      </Box> )
  }

export default function SalesApp({createNotif})  {
  const [print, setPrint] = useState(false);
  const [id, setId] = useState("");
  
  const printSales = (newId) => {
    setPrint(true);
    setId(newId);
  }

  const backMenu = () => {
    setId("");
    setPrint(false);
  }

  if (!print){
    return (<GridSale 
              page={0} 
              rowPage={10} 
              onprint={printSales}
              onMsg={createNotif}
              >
              </GridSale>
            )
  } else{
    return (<ViewPdf id={id} report_type="sales_contract" onBack={backMenu} />)
  }

}


