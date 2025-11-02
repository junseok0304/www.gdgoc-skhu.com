import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  font-family: 'Pretendard', sans-serif;
  line-height: 1.75;
`;

const Section = styled.div`
  margin-top: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e5e5;
  &:last-of-type {
    border-bottom: none;
    padding-bottom: 0;
  }
  strong {
    display: block;
    margin-bottom: 0.6rem;
    font-size: 1.05rem;
  }
  ul {
    list-style: none;
    margin: 0;
    padding-left: 0;
    li {
      margin-bottom: 0.25rem;
      color: #3b3b3b;
      font-size: 0.95rem;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 0.8rem 2rem;
  border-radius: 6px;
  border: ${({ $variant }) => ($variant === 'primary' ? 'none' : '1px solid #aaa')};
  background-color: ${({ $variant }) => ($variant === 'primary' ? '#7f8cff' : '#e0e0e0')};
  color: ${({ $variant }) => ($variant === 'primary' ? '#fff' : '#000')};
  font-weight: 500;
  transition: 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;

const Description = styled.div`
  font-size: 0.95rem;
  color: #2f2f2f;
  line-height: 1.7;
  * {
    font-family: 'Pretendard', sans-serif;
  }
  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin-top: 0.75rem;
  }
`;

interface Props {
  form: {
    topic: string;
    title: string;
    intro: string;
    description: string;
    preferredPart: string;
    team: {
      planning: number;
      design: number;
      frontendWeb: number;
      frontendMobile: number;
      backend: number;
    };
  };
  onBack: () => void;
  onRegister: () => void;
}

export default function IdeaPreview({ form, onBack, onRegister }: Props) {
  const team = form.team ?? {
    planning: 0,
    design: 0,
    frontendWeb: 0,
    frontendMobile: 0,
    backend: 0,
  };

  return (
    <Container>
      <h3>아이디어 미리보기</h3>
      <Section>
        <strong>주제</strong>
        {form.topic}
      </Section>
      <Section>
        <strong>아이디어 제목</strong>
        {form.title}
      </Section>
      <Section>
        <strong>아이디어 한 줄 소개</strong>
        {form.intro}
      </Section>
      <Section>
        <strong>아이디어 설명</strong>
        <Description
          dangerouslySetInnerHTML={{
            __html: form.description || '<p>아이디어를 자유롭게 설명해 주세요!</p>',
          }}
        />
      </Section>
      <Section>
        <strong>팀원 구성</strong>
        <ul>
          <li>기획 {team.planning}명</li>
          <li>디자인 {team.design}명</li>
          <li>프론트엔드(웹) {team.frontendWeb}명</li>
          <li>프론트엔드(모바일) {team.frontendMobile}명</li>
          <li>백엔드 {team.backend}명</li>
        </ul>
      </Section>
      <Section>
        <strong>작성자 희망 파트</strong>
        {form.preferredPart}
      </Section>

      <ButtonGroup>
        <Button $variant="secondary" onClick={onBack}>
          이전으로
        </Button>
        <Button $variant="primary" onClick={onRegister}>
          아이디어 등록
        </Button>
      </ButtonGroup>
    </Container>
  );
}
