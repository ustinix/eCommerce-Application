const themeName = 'appTheme';
const primaryColor = '#f22735';
const primaryDarken = '#d9202f';
const colorWhite = '#ffffff';
const colorBlack = '#000000';
const colorDarkGray = '#121212';

export const theme = {
  defaultTheme: themeName,
  themes: {
    appTheme: {
      dark: false,
      colors: {
        primary: primaryColor,
        'primary-darken': primaryDarken,
        background: colorWhite,
        surface: colorWhite,
        'on-surface': colorBlack,
        'on-background': colorBlack,
      },
    },
    appThemeDark: {
      dark: true,
      colors: {
        primary: primaryColor,
        'primary-darken': primaryDarken,
        background: colorDarkGray,
        surface: colorWhite,
        'on-surface': colorWhite,
        'on-background': colorWhite,
      },
    },
  },
};
