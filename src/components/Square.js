import React from "react";
import styled from "styled-components";

const StyledDiv = styled.div`
  border: 1px dotted wheat;
  border-radius: 5px;
`;

function Square() {
  return <StyledDiv>square</StyledDiv>;
}

export default Square;
