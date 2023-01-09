import PasswordField from "./PasswordField";
import TextField from "./TextField";

const Field = ({ type, ...rest }) => {
  return (
    <>
      {type === "text" ? (
        <TextField {...rest} />
      ) : type === "password" ? (
        <PasswordField {...rest} />
      ) : null}
    </>
  );
};

export default Field;
