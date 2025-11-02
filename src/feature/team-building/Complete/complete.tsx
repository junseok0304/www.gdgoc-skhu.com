import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const Container = styled.div`
  padding: 3.5rem 2.5rem 4rem;
  font-family: 'Pretendard', sans-serif;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-bottom: 1.8rem;
  border-bottom: 1px solid #dcdcdc;
`;

const BrandTitle = styled.h1`
  font-size: 2.125rem;
  font-weight: 600;
  letter-spacing: 0.04em;
`;

const PageTitle = styled.h2`
  font-size: 1.625rem;
  font-weight: 500;
`;

const InfoBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.1rem 0;
  font-size: 0.95rem;
  border-bottom: 1px solid #dcdcdc;
`;

const TeamName = styled.span`
  font-weight: 600;
`;

const Mentor = styled.span`
  color: #5d5d5d;
`;

const ButtonRow = styled.div`
  margin-top: 4.5rem;
  display: flex;
  justify-content: center;
`;

const PrimaryButton = styled.button`
  min-width: 220px;
  padding: 0.95rem 2rem;
  border-radius: 12px;
  border: none;
  background-color: #c7c9ff;
  color: #1f1f1f;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
  box-shadow: 0 8px 18px rgba(87, 94, 255, 0.15);
  &:hover {
    background-color: #b5b8ff;
  }
`;

const EmptyState = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  color: #555;
  line-height: 1.6;
`;

const CompleteMessage = styled.div`
  margin-top: 6rem;
  text-align: center;
  line-height: 1.9;
  font-size: 1.05rem;
  color: #2f2f2f;
  strong {
    display: block;
    font-weight: 600;
  }
`;
import IdeaLayout from '../IdeaLayout/IdeaLayout';
import { useIdeaStore } from '../store/IdeaStore';

export default function IdeaApplyCompletePage() {
  const router = useRouter();
  const { id } = router.query;

  const numericId = useMemo(() => {
    if (Array.isArray(id)) return Number(id[0]);
    return id ? Number(id) : NaN;
  }, [id]);

  const idea = useIdeaStore(state =>
    Number.isFinite(numericId) ? state.getIdeaById(numericId) : undefined
  );

  if (!idea) {
    return (
      <IdeaLayout>
        <EmptyState>
          지원 완료 정보를 찾을 수 없어요.
          <br />
          목록에서 다시 선택해 주세요.
        </EmptyState>
      </IdeaLayout>
    );
  }

  return (
    <IdeaLayout>
      <Container>
        <Header>
          <BrandTitle>Team Building</BrandTitle>
          <PageTitle>{idea.title}</PageTitle>
          <InfoBar>
            <TeamName>{idea.intro || idea.topic}</TeamName>
            <Mentor>성공회대 디자인 주현지</Mentor>
          </InfoBar>
        </Header>

        <CompleteMessage>
          <strong>🎉 지원을 완료했어요!</strong>
          이제 결과를 기다려볼까요? 😊
        </CompleteMessage>

        <ButtonRow>
          <PrimaryButton
            type="button"
            onClick={() => router.push('/feature/team-building/welcome')}
          >
            아이디어 목록으로
          </PrimaryButton>
        </ButtonRow>
      </Container>
    </IdeaLayout>
  );
}
