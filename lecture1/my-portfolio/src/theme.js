import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main:  '#52B788',
      light: '#74C69D',
      dark:  '#40916C',
    },
    secondary: {
      main:  '#95D5B2',
      light: '#D8F3DC',
      dark:  '#52B788',
    },
    background: {
      default: '#F4FAF0',
      paper:   '#FFFFFF',
    },
    text: {
      primary:   '#1B4332',
      secondary: '#2D6A4F',
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
