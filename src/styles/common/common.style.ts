import styled from 'styled-components';
interface SizeProps {
  size: string;
}

export const CommonText = styled.p<SizeProps>`
  font-size: ${props => props.size};
  color: #4d5053;
  margin: auto 10px;
`;
