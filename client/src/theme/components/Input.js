export const Input = {
  variants: {
    primary: {
      field: {
        bg: "white",
        borderWidth: "2px",
        _focus: {
          boxShadow: "none",
          borderColor: "secondary",
          borderWidth: "2px",
        },
      },
    },
  },
  defaultProps: {
    variant: "primary",
  },
};
