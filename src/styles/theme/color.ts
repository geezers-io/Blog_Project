export const color = {
  primary: {
    light: '#ffc107',
    main: '#ffa000',
    dark: '#ff6f00',
  },
  secondary: {
    main: '#ffb300',
  },
  error: {
    main: '#DA1E28',
  },
};

export const themeStyle = {
  MuiButton: {
    variants: [
      {
        props: { variant: 'contained' },
        style: {
          color: 'black',
          borderRadius: '20px',
          backgroundColor: '#ffcc80',
          padding: '10px 20px',
          marginRight: '10px',
        },
      },
    ],
  },
};
