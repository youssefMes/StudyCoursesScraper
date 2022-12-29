export const Button = {
  // 1. We can update the base styles
  baseStyle: {
    borderRadius: "8px",
  },
  // 2. We can add a new button size or extend existing
  sizes: {},
  // 3. We can add a new visual variant
  variants: {
    primary: {
      bg: "primary",
      color: "black",
      _hover: {
        textDecoration: "none",
        bg: "primaryDark",
      },
    },
  },
  // 6. We can overwrite defaultProps
  defaultProps: {},
};
