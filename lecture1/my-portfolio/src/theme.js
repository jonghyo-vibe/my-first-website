import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main:  '#0080FF',
      light: '#00B9EF',
      dark:  '#005FCC',
    },
    secondary: {
      main:  '#12C0EC',
      light: '#A9FFD4',
      dark:  '#0090B0',
    },
    background: {
      default: '#FFFFFF',
      paper:   '#F5F7FA',
    },
    text: {
      primary:   '#1A1A2E',
      secondary: '#555555',
      disabled:  '#AAAAAA',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 700 },
    h2: { fontSize: '2rem',   fontWeight: 600 },
    h3: { fontSize: '1.5rem', fontWeight: 600 },
  },
  spacing: 8,
});

export default theme;
