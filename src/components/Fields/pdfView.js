import React, { useState } from "react";
import { Document, Page, pdfjs } from 'react-pdf';
// import pdf worker as a url, see `next.config.js` and `pdf-worker.js`
import {Box, Grid, Button} from '@mui/material';
import workerSrc from "../../../pdf-worker";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';


pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;


export default function SinglePage(props) {
  
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1); //setting 1 to show fisrt page

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  // const openPdf = (basePdf) => { }

  const { pdf } = props;
  
  return (
    <>
    <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '130vh' }}
    >
      <div>
        <Button variant="text" type="button" disabled={pageNumber <= 1} onClick={previousPage}>
          Previous
        </Button>
        {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
        <Button
          variant="text"
          type="button"
          disabled={pageNumber >= numPages}
          onClick={nextPage}
        >
          Next
        </Button>
        
        
      </div>
      
      <Document
        file={ "data:application/pdf;base64,"+pdf}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => console.log("test" + error.message)}
      >
        <Page pageNumber={pageNumber} />
      </Document>
    </Grid>
    </>
  );
}