import { createTheme, ThemeProvider } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
      components: {
      MUIDataTableFilterList: {
        styleOverrides: { 
          chip: {
            display: 'none'
          }
        }
      }
    },
  
  // overrides: {
    
  //   MuiIconButton: {
  //     root: {
  //       '&:hover': {
  //         backgroundColor: "white"
  //       }
  //     }
  //   }
  // },
  palette: {
    background:{
      paper: '#fff',
    },
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    text: {
      primary: '#173A5E',
      secondary: '#46505A',
    },
    action: {
      active: '#001E3C',
    },
  },
});

export default theme;