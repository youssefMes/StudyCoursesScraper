const When = ({ condition, children }) => {
  if (Boolean(condition)) {
    return <>{children}</>;
  }
};

export default When;
