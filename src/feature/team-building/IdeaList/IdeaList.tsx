import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const Header = styled.div`
  margin: 2rem 0 1.75rem;
  padding-bottom: 1.2rem;
  border-bottom: 1px solid #d7d7d7;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1.5rem;
`;

const Title = styled.h3`
  font-size: 1.45rem;
  font-weight: 600;
  letter-spacing: 0.02em;
`;

const Mentor = styled.span`
  font-size: 0.95rem;
  color: #666;
`;

const InfoCard = styled.div`
  border-radius: 12px;
  border: 1px solid #ebebeb;
  overflow: hidden;
  margin-bottom: 2.5rem;
`;

const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 180px 1fr;
  border-bottom: 1px solid #ebebeb;
  @media (max-width: 600px) {
    grid-template-columns: 140px 1fr;
  }
  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.div`
  background-color: #f0f0f0;
  padding: 1.1rem 1.4rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #4a4a4a;
`;

const InfoValue = styled.div`
  padding: 1.1rem 1.4rem;
  font-size: 0.95rem;
  line-height: 1.7;
  color: #2f2f2f;
  background-color: #fff;
  div {
    line-height: 1.7;
  }
  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin-top: 0.75rem;
  }
  div + div {
    margin-top: 0.35rem;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.25rem;
`;

const SecondaryButton = styled.button`
  min-width: 180px;
  padding: 0.9rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  background-color: #d9d9d9;
  color: #2a2a2a;
  transition: 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;

const PrimaryButton = styled(SecondaryButton)`
  background-color: #8a8cff;
  color: #fff;
`;

const EmptyState = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  color: #555;
  line-height: 1.6;
`;

const BackLink = styled.button`
  margin-top: 1.5rem;
  border: none;
  background: none;
  color: #7f8cff;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
`;
import { Idea, useIdeaStore } from '../store/IdeaStore';
import IdeaLayout from '../IdeaLayout/IdeaLayout';

const partLabels: Record<keyof Idea['team'], string> = {
  planning: '기획',
  design: '디자인',
  frontendWeb: '프론트엔드(웹)',
  frontendMobile: '프론트엔드(모바일)',
  backend: '백엔드',
};

const orderedPartKeys: Array<keyof Idea['team']> = [
  'planning',
  'design',
  'frontendWeb',
  'frontendMobile',
  'backend',
];

export default function IdeaDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const numericId = useMemo(() => {
    if (Array.isArray(id)) {
      return Number(id[0]);
    }
    return id ? Number(id) : NaN;
  }, [id]);

  const idea = useIdeaStore(state =>
    Number.isFinite(numericId) ? state.getIdeaById(numericId) : undefined
  );

  if (!idea) {
    if (typeof window !== 'undefined') {
      router.replace('/feature/team-building/welcome');
    }
    return null;
  }

  const totalSelected = Object.values(idea.team).reduce((sum, count) => sum + count, 0);
  const totalMembers = idea.totalMembers ?? totalSelected;
  const currentMembers = idea.currentMembers ?? 0;

  return (
    <IdeaLayout>
      <Header>
        <Title>{idea.title}</Title>
        <Mentor>성공회대 디자인 주현지</Mentor>
      </Header>

      <InfoCard>
        <InfoRow>
          <InfoLabel>주제</InfoLabel>
          <InfoValue>{idea.topic}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>아이디어 한 줄 소개</InfoLabel>
          <InfoValue>{idea.intro}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>아이디어 설명</InfoLabel>
          <InfoValue>
            <div
              dangerouslySetInnerHTML={{
                __html: idea.description || '<p>아이디어를 자유롭게 설명해 주세요!</p>',
              }}
            />
          </InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>팀원 구성</InfoLabel>
          <InfoValue>
            {orderedPartKeys.map(key => (
              <div key={key}>
                {partLabels[key]} 0명 / 최대 {idea.team?.[key] ?? 0}명
              </div>
            ))}
            <div>
              현재 {currentMembers}명 / 목표 {totalMembers}명
            </div>
          </InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>작성자 희망 파트</InfoLabel>
          <InfoValue>{idea.preferredPart}</InfoValue>
        </InfoRow>
      </InfoCard>

      <ButtonRow>
        <SecondaryButton type="button">저장하기</SecondaryButton>
        <PrimaryButton
          type="button"
          onClick={() =>
            router.push({ pathname: '/feature/team-building/apply', query: { id: idea.id } })
          }
        >
          지원하기
        </PrimaryButton>
      </ButtonRow>
    </IdeaLayout>
  );
}
