import React from 'react';
import styled from 'styled-components';

const Container = styled.div.withConfig({ componentId: 'TeamBuildingLayout__Container' })`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  color: #000;
  font-family: 'Pretendard', sans-serif;
  padding: 3.5rem 2.5rem 2.5rem;
  position: relative;
  z-index: 1;
`;

const Wrapper = styled.div.withConfig({ componentId: 'TeamBuildingLayout__Wrapper' })`
  width: 100%;
  max-width: 800px;
`;

const Title = styled.h1.withConfig({ componentId: 'TeamBuildingLayout__Title' })`
  font-size: 1.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.h2.withConfig({ componentId: 'TeamBuildingLayout__Subtitle' })`
  font-size: 1.5rem;
  margin-bottom: 2rem;
`;

export default function IdeaLayout({ children }: { children?: React.ReactNode }) {
  return (
    <Container>
      <Wrapper>
        <Title>Team Building</Title>
        <Subtitle>그로우톤</Subtitle>
        {children}
      </Wrapper>
    </Container>
  );
}
