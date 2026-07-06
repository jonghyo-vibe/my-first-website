import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main:  '#22C55E',
      light: '#4ADE80',
      dark:  '#16A34A',
    },
    secondary: {
      main:  '#38BDF8',
      light: '#7DD3FC',
      dark:  '#0EA5E9',
    },
    background: {
      default: '#0A0A0A',
      paper:   '#111111',
    },
    text: {
      primary:   '#FFFFFF',
      secondary: '#CCCCCC',
      disabled:  '#444444',
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
