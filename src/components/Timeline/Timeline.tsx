import React from 'react';
import PlainHour from './PlainHour';
import HalfHour from './HalfHour';
import config from 'config';
import styled from 'styled-components';

const HOURS = [...Array(config.displayedHours)].map((_, index) => index);

const Container = styled.div`
  width: 80px;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-top: -10px;
`;

function Timeline() {
  return (
    <Container>
      {HOURS.map((_, index) => {
        return (
          <div
            key={index}
            style={{
              width: 80,
              height: config.hoursInPixels,
            }}
          >
            <PlainHour hour={config.firstDisplayedHour + index} />
            <HalfHour hour={config.firstDisplayedHour + index} />
            {index === HOURS.length - 1 ? (
              <div style={{ marginTop: 10 }}>
                <PlainHour hour={config.firstDisplayedHour + index + 1} />
              </div>
            ) : null}
          </div>
        );
      })}
    </Container>
  );
}

export default Timeline;
