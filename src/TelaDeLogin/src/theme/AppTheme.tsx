import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#98b344', // Cor verde para os botões e foco
    },
    secondary: {
      main: '#656565', // Cor cinza para o padrão
    },
    background: {
      default: '#f0f2f5', // Cor de fundo da página
      paper: '#ffffff',  // Fundo dos componentes
    },
    text: {
      primary: '#656565', // Texto padrão em cinza
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#98b344', // Botões em verde
          color: '#fff', // Texto dos botões em branco
          textTransform: 'none', // Não transformar em maiúsculo
          '&:hover': {
            backgroundColor: '#7a9244', // Cor mais escura ao passar o mouse
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#656565', // Borda cinza padrão
            },
            '&:hover fieldset': {
              borderColor: '#98b344', // Borda verde ao passar o mouse
            },
            '&.Mui-focused fieldset': {
              borderColor: '#98b344', // Borda verde ao focar no campo
            },
          },
          '& .MuiInputBase-input': {
            color: '#656565', // Texto em cinza
          },
        },
      },
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default function AppTheme({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
