import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Idea } from '../store/IdeaStore';
const Container = styled.div`
  padding: 2.5rem 2rem 3rem;
  font-family: 'Pretendard', sans-serif;
`;

const SectionHeader = styled.div`
  margin: 2rem 0 1.5rem;
  padding-bottom: 1.2rem;
  border-bottom: 1px solid #cfcfcf;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1.5rem;
`;

const IdeaTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.02em;
`;

const MentorInfo = styled.span`
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
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const OutlineButton = styled.button`
  min-width: 170px;
  padding: 0.95rem;
  border-radius: 8px;
  border: 1px solid #cfcfcf;
  background-color: #fff;
  color: #333;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const PrimaryButton = styled(OutlineButton)`
  background-color: #8a8cff;
  border-color: #8a8cff;
  color: #fff;
  &:hover {
    opacity: 0.9;
    background-color: #7c7fee;
  }
`;


interface IdeaCompleteProps {
  idea: Idea;
  onGoList: () => void;
}

export default function IdeaComplete({ idea, onGoList }: IdeaCompleteProps) {
  const router = useRouter();
  const team = idea.team ?? {
    planning: 0,
    design: 0,
    frontendWeb: 0,
    frontendMobile: 0,
    backend: 0,
  };
  const totalSelected = Object.values(team).reduce((sum, count) => sum + count, 0);
  const totalMembers = idea.totalMembers ?? totalSelected;
  const currentMembers = idea.currentMembers ?? 0;

  return (
    <Container>
      <SectionHeader>
        <IdeaTitle>{idea.title}</IdeaTitle>
        <MentorInfo>성공회대 디자인 주현지</MentorInfo>
      </SectionHeader>

      <InfoCard>
        <InfoRow>
          <InfoLabel>주제</InfoLabel>
          <InfoValue>{idea.topic}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>아이디어 제목</InfoLabel>
          <InfoValue>{idea.title}</InfoValue>
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
            기획 {team.planning}명 | 디자인 {team.design}명 | 프론트엔드(웹) {team.frontendWeb}명 |
            프론트엔드(모바일) {team.frontendMobile}명 | 백엔드 {team.backend}명 (총 {totalMembers}
            명)
          </InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>모집 현황</InfoLabel>
          <InfoValue>
            현재 {currentMembers}명 / 목표 {totalMembers}명
          </InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>작성자 희망 파트</InfoLabel>
          <InfoValue>{idea.preferredPart}</InfoValue>
        </InfoRow>
      </InfoCard>

      <ButtonRow>
        <OutlineButton
          type="button"
          onClick={() =>
            router.push({ pathname: '/feature/team-building/IdeaList', query: { id: idea.id } })
          }
        >
          등록한 글 보기
        </OutlineButton>
        <PrimaryButton type="button" onClick={onGoList}>
          아이디어 목록 보기
        </PrimaryButton>
      </ButtonRow>
    </Container>
  );
}
