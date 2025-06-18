const themeName = 'appTheme';
const primaryColor = '#f22735';
const primaryDarken = '#d9202f';

export const theme = {
  defaultTheme: themeName,
  themes: {
    appTheme: {
      dark: false,
      colors: {
        primary: primaryColor,
        'primary-darken': primaryDarken,
        background: '#ffffff',
      },
    },
    appThemeDark: {
      dark: true,
      colors: {
        primary: primaryColor,
        'primary-darken': primaryDarken,
        background: '#121212',
      },
    },
  },
};
