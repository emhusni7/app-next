import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import {useRef} from "react";


function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export default function Autosync(props) {
  
  const {onChange, name, getListData, label = "name", id = "id", showName,defaultValue,disabled,required,value,noOption="No Option"} = props;
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;
  const [loadingApi, setLoadingApi] = React.useState(false)
  const [filters, setFilters] = React.useState(null);
  let timeOut = useRef(null);

  const getData = async(filters) => {
    setLoadingApi(true);
    const data = await getListData(filters);
    setLoadingApi(false);
    if (data){
      setOptions([...data]);
    }
  }

  React.useEffect(() => {
    let active = true;
    if (!loading) {
      return undefined;
    }
    getData();
  }, []);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  React.useEffect(() => {
    if (filters !== null) {
        if (timeOut.current !== null)
            clearTimeout(timeOut.current);
        timeOut.current = setTimeout(() => getData(filters), 500);
      }
  }, [filters]);

  return (
    <Autocomplete
      id={name}
      name={name}
      sx={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option.title === value.title}
      getOptionLabel={(option) => option.title}
      options={options}
      onChange={(e,   value) => onChange(value)}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          name={name}
          required={required}
          size="small"
          onChange={(e) => setFilters(e.target.value)}
          label={label}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}

// Top films as rated by IMDb users. http://www.imdb.com/chart/top

