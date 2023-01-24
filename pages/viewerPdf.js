// import pdfFile from './TesPdf.pdf';

import dynamic from "next/dynamic";
import { useEffect } from 'react';
import { useState } from 'react';
import { CustomizedProgressBars } from "../src/components/Layout/loader";
import {Box, Grid, Button} from '@mui/material';
import { ArrowBackIosNewOutlined } from "@mui/icons-material";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';




const SinglePagePDFViewer = dynamic(() => import("../src/components/Fields/pdfView"), {
  ssr: false
});



export default function ViewPdf(props) {

  const [file, setFile] = useState("");
  const id = props.id;
  const getReport = async () => {
    const result = await fetch("api/report_api",{
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          'id': props.id,
          'report_type': props.report_type
      })
    });
    
    const res = await result.json();
    return res.data
  }

  const b64toBlob = (content, contentType) => {
    contentType = contentType || '';
    const sliceSize = 512;
     // method which converts base64 to binary
    const byteCharacters = window.atob(content); 

    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, {
        type: contentType
    }); // statement which creates the blob
    return blob;
};

function previewPdf(data64){
  let blob = null;
  blob = b64toBlob(data64, 'application/pdf;base64');
  const blobURL = URL.createObjectURL(blob);
  const theWindow = window.open(blobURL);
  const theDoc = theWindow.document;
  const theScript = document.createElement('script');
  function injectThis() {
      window.print();
  }
  theScript.innerHTML = `window.onload = ${injectThis.toString()};`;
  theDoc.body.appendChild(theScript);
}

  const printPreview = (data, type = 'application/pdf;base64') => {
    let blob = null;
    blob = b64toBlob(data, type);
    const blobURL = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.download = props.id;
    a.href = blobURL;
    document.body.appendChild(a);
    a.click();
    a.remove();
};

  
  useEffect( async () => {
   
    const response = await getReport();
    setFile(response);
  },[id])
 
    return (
      <div className="App">
        <div className="all-page-container">
        <Box
        sx=
        {
            {
                bgcolor: 'background.paper',
                boxShadow: 1,
                borderRadius: 2,
                p: 2,
                minWidth: 100,
                marginBottom: 10,
                marginLeft:10,
                marginRight:10,
                marginTop:3
            }
        }
      >
      <Grid><ArrowBackIosNewOutlined onClick={() => props.onBack()} ></ArrowBackIosNewOutlined></Grid>
          {
            file ? (<>
            <Grid 
              container
              justifyContent="flex-end"
              ><Button onClick={(e) => previewPdf(file)}></Button>
                <Button onClick={(e) => printPreview(file)}><CloudDownloadIcon /></Button>
              </Grid>
            <SinglePagePDFViewer pdf={file} /></>) : (<CustomizedProgressBars />)
          }
       </Box>   
        </div>
      </div>
    );
  
}