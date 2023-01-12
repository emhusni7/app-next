import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { Paper } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { withAuth } from "../../models/withAuthorization";
import { Box, Container } from "@mui/system";
import { useRouter } from 'next/router';

import { ArrowBackIosNewOutlined } from "@mui/icons-material";

const Footer = () => {
  return (
    <Paper sx={
      {
        marginTop: 'calc(10% + 60px)',
        width: '100%',
        position: 'fixed',
        backgroundColor: '#f5f5f5',
        bottom: 0,
        width: '100%'
    }} component="footer" square variant="outlined">
      <Container maxWidth="lg">
        <Box
          sx={{
            flexGrow: 1,
            justifyContent: "center",
            display: "flex",
            my:1
          }}
        >
            <div>
            {/* <Image priority src="/Logo.svg" width={75} height={30} alt="Logo" /> */}
            </div>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            justifyContent: "center",
            display: "flex",
            mb: 2,
          }}
        >
          <Typography variant="caption" color="initial">
            Copyright ©2022. [] Limited
          </Typography>
        </Box>
      </Container>
    </Paper>
  );
};

function Layout({children}){

  const router = useRouter();
  return (
  <div> 
    <AppBar position="static">
      <Toolbar>
      <ArrowBackIosNewOutlined onClick={() => router.back()}> </ArrowBackIosNewOutlined>
        <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} />
        <MenuIcon />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>PT. Baramuda Bahari</Typography>
        <Button color="inherit" onClick={() => {
              localStorage.removeItem("user");
              router.push("/login");}}>LogOut</Button>
      </Toolbar>
    </AppBar>
      {children}
    <Footer />
  </div>
  )
}

export default withAuth(Layout)