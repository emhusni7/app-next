import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { Paper, Tooltip, Avatar, Menu, MenuItem, Divider, ListItemIcon } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { withAuth } from "../../models/withAuthorization";
import { Box, Container } from "@mui/system";
import { useRouter } from 'next/router';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';

import { ArrowBackIosNewOutlined } from "@mui/icons-material";
import LogoutIcon from '@mui/icons-material/Logout';
import { styled, alpha } from '@mui/material/styles';
import { deleteCookie, getCookie } from "cookies-next";


const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));


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
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [username, setUsername ]= React.useState("");
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
 
  const handleClose = () => {
    setAnchorEl(null);
  };
 

  React.useEffect(() => {
    setUsername(JSON.parse(getCookie('user')).username.substring(0,1));
  },[username])

  return (
  <div> 
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit"  onClick={() => router.back()}><ArrowBackIosNewOutlined> </ArrowBackIosNewOutlined></Button>
        {/* <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 0.1 }} /> */}
        <MenuIcon onClick={(e) => router.push("/")} />
        

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>PT. Baramuda Bahari</Typography>
       
        <Tooltip title="Account">
          <IconButton
            onClick={(e) => handleClick(e)}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>{username.toUpperCase()}</Avatar>
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => {
              deleteCookie('user');
              deleteCookie('menu');
              router.push("/login")}}>
          <ListItemIcon  >
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
        <Divider />
        </Menu>
        
      </Toolbar>
    </AppBar>
      {children}
    <Footer />
  </div>
  )
}

export default withAuth(Layout)