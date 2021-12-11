import { createTheme } from '@mui/material/styles';

export const BladeDarkGreenTheme5 = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#2BDE6A',
    },
    secondary: {
      main: '#1db954',
    },
    accent: {
      main: '#20173c',
    },
    background: { 
      default: '#030303', 
      paper: '#151515' 
    },
  },
  props: {
    MuiCard: {
      variant: 'outlined',
    },
  },
});

export const BladeDarkBlueTheme5 = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#0dbedc',
    },
    secondary: {
      main: '#0dbedc',
    },
    accent: {
      main: '#20173c',
    },
    background: { 
      default: '#030303', 
      paper: '#151515' 
    },
  },
  props: {
    MuiCard: {
      variant: 'outlined',
    },
  },
});

export const BladeDarkTheme5 = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#b00000',
    },
    secondary: {
      main: '#500000',
    },
    accent: {
      main: '#20173c',
    },
    background: { 
      default: '#030303', 
      paper: '#151515' 
    },
  },
  props: {
    MuiCard: {
      variant: 'outlined',
    },
  },  
  typography: {
    "fontFamily": `"Nunito", "Roboto", "Helvetica", "Arial", sans-serif`,
    "fontSize": 14,
    "fontWeightRegular": 400,
   }
});

export const BladeDarkGreyTheme5 = createTheme({
  palette: {
    mode: 'dark',
    type: 'dark',
    primary: {
      main: '#333',
    },
    secondary: {
      main: '#222',
    },
    background: { 
      default: '#030303', 
      paper: '#151515' 
    },
  },
  props: {
    MuiCard: {
      variant: 'outlined',
    },
  },  
  typography: {
    "fontFamily": `"Nunito", "Roboto", "Helvetica", "Arial", sans-serif`,
    "fontSize": 14,
    "fontWeightRegular": 400,
   }
});

export const BladeDarkOrangeTheme5 = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#FFBF47',
    },
    secondary: {
      main: '#edad2d',
    },
    accent: {
      main: '#542581',
    },
    background: { 
      default: '#030303', 
      paper: '#151515' 
    },
  },
  props: {
    MuiCard: {
      variant: 'outlined',
    },
  },  
  typography: {
    "fontFamily": `"Nunito", "Roboto", "Helvetica", "Arial", sans-serif`,
    "fontSize": 14,
    "fontWeightRegular": 400,
   }
});

export const BladeLightTheme5 = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#800000',
    },
    secondary: {
      main: '#800000',
    },
    // background: { default: '#030303', paper: '#151515' },
  },
  props: {
    MuiCard: {
      variant: 'outlined',
    },
  },
});