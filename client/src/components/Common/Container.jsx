import { Container } from "@chakra-ui/react";
import { Children } from "react";
import { ReactComponent as Logo } from "../../assets/crown.svg";

const ContainerBloc = ({children}) => {
    return (
      <Container
        bg='lightgrey'
        w='100%'
        m={0}
      >
       {children}
      </Container>
    );
  };
  
  export default ContainerBloc;