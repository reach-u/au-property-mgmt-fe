import styled from 'styled-components';

export const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.width};
  height: ${props => props.height || 'auto'};
  padding: 5px;
`;
