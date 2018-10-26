import styled from 'styled-components';

export const FlexDiv = styled.div`
  display: flex;
  align-items: ${props => props.alignItems || 'center'};
  justify-content: center;
  width: ${props => props.width};
  height: ${props => props.height || 'auto'};
`;

export const FlexItem = styled.div`
  margin: 0 10px;
`;
