import {
  Box, 
  InputAdornment,
  Divider, 
  TextField, 
  Grid, 
  FormHelperText,
  Button
} from '@mui/material';

import { useFormik } from 'formik';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Autosync from '../src/components/Fields/autoComplete';
import * as yup from "yup";
import { NumericFormat } from 'react-number-format';
import {CustomizedProgressBars} from '../src/components/Layout/loader';
//import {NotificationContainer, NotificationManager} from 'react-notifications';
import { numberRepo } from './api/number';


const PaymentSchema = yup.object({
    amount: yup.number("Enter Amount").required('Amount is Required'),
    po: yup.object().required('PO is Required')
});



export default function Payment({ res_data }) {
  
  const getNumber = () => {
    const res = res_data.datas.find(el => el.year == "22" && el.month == "09");
    return res_data.prefix + "/" + res.year + "/" + res.month +"/"+ res.number
  }

  var formSchema = {
    name: getNumber(),
    date: dayjs(new Date()),
  }

  const getListData = async (search) => {
    const response  = await fetch('/api/pos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        search: search
      }),
    })
    const data = await response.json();
    return data;
  }

  const formFmk = useFormik({
    initialValues: formSchema,
    validationSchema: PaymentSchema,
    onSubmit: (values, { 
      setSubmitting
     }) => {
      setTimeout(() => {
        setSubmitting(false);
        setNumber("dp","22","09");
       // NotificationManager.success('Data Has Been Saved', 'Saved');
      },1000);
    },
  });

    return (  
      <Box
          sx=
          {
              {
                  bgcolor: 'background.paper',
                  boxShadow: 1,
                  borderRadius: 2,
                  p: 2,
                  minWidth: 300,
                  margin: 3,
              }
          }
        >
          <Box sx={{color: 'text.primary', fontSize: 20, fontWeight: 'bold'   }}>Down payment</Box>
          <Divider />
          
          
          <form onSubmit={formFmk.handleSubmit}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container sx={{ padding: 2}} rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} >
              <Grid item md={4}>
                  <TextField 
                      label="Number"
                      id="name"
                      name="name"
                      value={formFmk.values.name}
                      size="small"
                      type="text"
                      InputProps={{
                        readOnly: true,
                      }}
                      style={{ width: '100%'}}
                  />
              </Grid>
              <Grid item md={4}>
                <DesktopDatePicker
                  id="date"
                  name="date"
                  label="Date"
                  inputFormat="DD/MM/YYYY"
                  value={formFmk.values.date}
                  onChange={(val) => {
                    formFmk.setFieldValue("date", val, true)
                    const name = getNumber();
                    formFmk.setFieldValue("name", name, true)
                  }}
                  error={formFmk.touched.date && Boolean(formFmk.errors.date)}
                  helperText={formFmk.touched.date && formFmk.errors.date}
                  renderInput={(params) =>
                    <TextField {...params}
                      size="small"
                      id="d_date"
                      name="d_date"
                      style={{ width: '100%'}}
                      />}
                />
              
              </Grid>
                <Grid item md={4}>
                  <Autosync 
                      id="po" 
                      name="po" 
                      label="PO Number"
                      onChange={(value) => {
                        if (!!value){
                          formFmk.setFieldValue("supplier", value.name, true);
                          formFmk.setFieldValue("po", value, true);
                          formFmk.setFieldValue("amount", value.val, true);
                          formFmk.setFieldValue("amount_str", value.val, true);
                          formFmk.setFieldValue("currency", value.cur, true);
                        } else{
                          formFmk.setFieldValue("supplier", "", true);
                          formFmk.setFieldValue("po", false, true);
                          formFmk.setFieldValue("amount", 0, true);
                          formFmk.setFieldValue("amount_str", 0, true);
                          formFmk.setFieldValue("currency", "IDR", true);
                        }
                      }}
                      getListData={(search) => getListData(search)}
                  />
                  {!!formFmk.errors.po && (
                    <FormHelperText error id="po-error">
                      {formFmk.errors.po}
                    </FormHelperText>
                  )}
              </Grid>
              <Grid item md={4}>
                <TextField 
                      label="Supplier"
                      id="supplier"
                      name="supplier"
                      value={formFmk.values.supplier || ''}
                      size="small"
                      type="text"
                      style={{ width: '100%'}}
                      InputProps={{
                        readOnly: true
                      }}
                  />
              </Grid>
              <Grid item md={4}>
              <NumericFormat 
                label="Amount"
                name="amount"
                prefix={formFmk.values.currency}
                id="amount"
                value={formFmk.values.amount_str}
                thousandSeparator=","
                decimalSeparator="."
                onValueChange={ (values, source) => {
                  if (!values){
                    formFmk.setFieldError('amount', 'Required Field')
                    formFmk.setFieldValue('amount',values.value, true);
                    formFmk.setFieldValue('amount_str', values.formattedValue, true);
                  } else{
                    formFmk.setFieldValue('amount',values.value, true);
                    formFmk.setFieldValue('amount_str', values.formattedValue, true);
                  }
                }
              }
                size='small'
                style={{ width: "100%"}}
                customInput={TextField} />
              {!!formFmk.errors.amount && (
                <FormHelperText error id="amount-error">
                  {formFmk.errors.amount}
                </FormHelperText>
              )}
              </Grid>
              <Grid item md={12}>{
                formFmk.isSubmitting ? <CustomizedProgressBars /> : formFmk.isSubmitting
              }
                
              </Grid>
              
              <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
              >
            <NotificationContainer/>
            <Grid item md={12} m={2} pt={5} alignItems="center" >
                <Button type="submit" sx={{ px: 3, m: 1 }} pt={15} variant="contained">Save</Button>
                <Button color="error" pt={15} variant="contained">Cancel</Button>
            </Grid>
          </Grid> 
          </Grid>
          </LocalizationProvider>
        </form>     
        </Box> 
    )
}

// Payment.getLayout = function getLayout(page) {
//     return (
//       <Layout>
//         {page}
//       </Layout>
//     )
// }

export async function getServerSideProps(){
  // const { URL } = process.env;
  
  // const res = await fetch(URL + '/api/number',{
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({'type': 'get'})
    
  // });
  // const data = await res.json();
  
  const res_data = numberRepo.getNumber("dp","22","09");
  return { props: { res_data }}
}
