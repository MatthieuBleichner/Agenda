import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  color: #c3c3c3;
  font-weight: bold;
  font-size: 13px;
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  margin-right: 5px;
`;

interface HalfHourProps {
  hour: number;
}

function HalfHour(props: HalfHourProps) {
  const { hour } = props;

  return <Container>{hour % 12} : 30</Container>;
}

export default HalfHour;
