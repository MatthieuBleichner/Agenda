import React from 'react';
import styled from 'styled-components';

interface plainHourProps {
  hour: number;
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-end;
`;

const PlainText = styled.div`
  color: #616161;
  font-weight: bold;
`;

const DaytimeText = styled.div`
  color: #c3c3c3;
  font-weight: bold;
  font-size: 10px;
  align-items: center;
  margin-top: 5px;
  margin-left: 5px;
  text-align: center;
  margin-right: 5px;
  display: flex;
`;

function PlainHour(props: plainHourProps) {
  const { hour } = props;

  return (
    <Container>
      <PlainText>{hour % 12} : 00</PlainText>
      <DaytimeText>{hour < 12 ? 'AM' : 'PM'}</DaytimeText>
    </Container>
  );
}

export default PlainHour;
