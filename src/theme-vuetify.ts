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
        surface: '#ffffff',
        'on-surface': '#000000',
        'on-background': '#000000',
      },
    },
    appThemeDark: {
      dark: true,
      colors: {
        primary: '#f22735',
        'primary-darken': '#d9202f',
        background: '#121212',
        surface: '#ffffff',
        'on-surface': '#ffffff',
        'on-background': '#ffffff',
      },
    },
  },
};
