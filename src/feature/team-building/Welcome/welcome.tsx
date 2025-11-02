import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';

import { useIdeaStore } from '../store/IdeaStore';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  color: #1f1f1f;
  font-family: 'Pretendard', sans-serif;
  padding: 4rem 2.5rem 5rem;
`;

const Wrapper = styled.div`
  width: 100%;
  max-width: 920px;
`;

const Title = styled.h1`
  font-size: 2.3rem;
  font-weight: 600;
  letter-spacing: 0.05em;
`;

const Subtitle = styled.h2`
  font-size: 1.7rem;
  font-weight: 500;
  margin-top: 0.4rem;
`;

const TitleDivider = styled.div`
  margin: 1.8rem 0 2.2rem;
  height: 1px;
  background-color: #dcdcdc;
`;

const StatusBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1.2rem;
  border-bottom: 1px solid #dcdcdc;
`;

const StatusText = styled.span`
  font-size: 1.05rem;
  letter-spacing: 0.02em;
  strong {
    font-weight: 600;
  }
`;

const RegisterButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.55rem 1.6rem;
  border-radius: 8px;
  border: 1px solid #2f2f2f;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f1f1f;
  text-decoration: none;
  background: #f9f9f9;
  transition: 0.15s ease;
  &:hover {
    background: #efefef;
  }
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin: 1.8rem 0 2.2rem;
`;

const Select = styled.select`
  min-width: 120px;
  border: 1px solid #bdbdbd;
  border-radius: 8px;
  padding: 0.55rem 1rem;
  font-size: 0.95rem;
  color: #2f2f2f;
  background: #fff;
`;

const ToggleTrack = styled.span`
  width: 54px;
  height: 28px;
  border-radius: 999px;
  background: #dedede;
  position: relative;
  transition: background 0.2s ease;
  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 4px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;
  }
`;

const ToggleInput = styled.input`
  display: none;
  &:checked + ${ToggleTrack} {
    background: #8e95ff;
  }
  &:checked + ${ToggleTrack}::after {
    transform: translateX(24px);x
  }
`;

const ToggleLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: #3f3f3f;
  cursor: pointer;
`;

const EmptyCard = styled.div`
  padding: 3.75rem 3rem;
  border-radius: 18px;
  background: #dedede;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  color: #2f2f2f;
  line-height: 1.7;
`;

const EmptyEmoji = styled.span`
  font-size: 1.4rem;
`;

const EmptyTitle = styled.p`
  font-size: 1.05rem;
  font-weight: 600;
  margin: 0;
`;

const EmptyMessage = styled.p`
  font-size: 0.95rem;
  margin: 0;
`;

const IdeaList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const IdeaCard = styled(Link)`
  display: block;
  padding: 1.75rem 1.9rem;
  border-radius: 16px;
  border: 1px solid #dcdcdc;
  background: #fff;
  text-decoration: none;
  color: inherit;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  }
`;

const IdeaCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 0.85rem;
`;

const IdeaCardTitle = styled.h3`
  font-size: 1.12rem;
  font-weight: 600;
  margin: 0;
`;

const StatusTag = styled.span<{ $variant: 'active' | 'closed' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.9rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid ${({ $variant }) => ($variant === 'active' ? '#c7d2fe' : '#d4d4d4')};
  background: ${({ $variant }) => ($variant === 'active' ? '#eef2ff' : '#f5f5f5')};
  color: ${({ $variant }) => ($variant === 'active' ? '#1d2cd8' : '#6b7280')};
`;

const StatusDot = styled.span<{ $variant: 'active' | 'closed' }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $variant }) => ($variant === 'active' ? '#4f46e5' : '#9ca3af')};
`;

const IdeaCardIntro = styled.p`
  font-size: 0.95rem;
  color: #4a4a4a;
  margin: 0 0 1.1rem;
`;

const IdeaCardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
  font-size: 0.85rem;
  color: #5a5a5a;
`;

const MetaItem = styled.span`
  display: inline-flex;
  gap: 0.35rem;
  align-items: center;
  strong {
    font-weight: 600;
    color: #2f2f2f;
  }
`;

export default function Welcome() {
  const { ideas } = useIdeaStore();
  const [excludeClosed, setExcludeClosed] = useState(false);

  const displayedIdeas = useMemo(() => {
    if (!excludeClosed) return ideas;
    return ideas.filter(idea => {
      const totalMembers =
        idea.totalMembers ?? Object.values(idea.team).reduce((sum, count) => sum + count, 0);
      const status =
        idea.status ??
        (idea.currentMembers >= totalMembers && totalMembers > 0 ? '모집 마감' : '모집 중');
      return status !== '모집 마감';
    });
  }, [ideas, excludeClosed]);

  return (
    <Container>
      <Wrapper>
        <Title>Team Building</Title>
        <Subtitle>그로우톤</Subtitle>
        <TitleDivider />

        <StatusBar>
          <StatusText>
            <strong>아이디어 현황</strong> ・ {ideas.length}개
          </StatusText>
          <RegisterButton href="/feature/team-building/IdeaPage">아이디어 등록</RegisterButton>
        </StatusBar>

        <FilterRow>
          <Select>
            <option>전체</option>
          </Select>
          <ToggleLabel>
            <ToggleInput
              type="checkbox"
              checked={excludeClosed}
              onChange={event => setExcludeClosed(event.target.checked)}
            />
            <ToggleTrack />
            모집완료 제외
          </ToggleLabel>
        </FilterRow>

        {displayedIdeas.length === 0 ? (
          <EmptyCard>
            <EmptyEmoji>👋</EmptyEmoji>
            <EmptyTitle>팀빌딩이 곧 시작돼요!</EmptyTitle>
            <EmptyMessage>
              등록할 아이디어를 미리 생각해두면, 팀빌딩이 열릴 때 바로 등록할 수 있습니다.
            </EmptyMessage>
          </EmptyCard>
        ) : (
          <IdeaList>
            {displayedIdeas.map(idea => {
              const totalFromTeam = Object.values(idea.team).reduce((sum, count) => sum + count, 0);
              const totalMembers = idea.totalMembers ?? totalFromTeam;
              const status =
                idea.status ??
                (idea.currentMembers >= totalMembers && totalMembers > 0 ? '모집 마감' : '모집 중');
              const variant = status === '모집 중' ? 'active' : 'closed';

              return (
                <IdeaCard
                  key={idea.id}
                  href={{ pathname: '/feature/team-building/IdeaList', query: { id: idea.id } }}
                >
                  <IdeaCardHeader>
                    <IdeaCardTitle>{idea.title}</IdeaCardTitle>
                    <StatusTag $variant={variant}>
                      <StatusDot $variant={variant} />
                      {status}
                    </StatusTag>
                  </IdeaCardHeader>
                  <IdeaCardIntro>
                    {idea.intro || '아직 한 줄 소개가 작성되지 않았어요.'}
                  </IdeaCardIntro>
                  <IdeaCardMeta>
                    <MetaItem>
                      <strong>인원</strong> {idea.currentMembers} / {totalMembers}
                    </MetaItem>
                    <MetaItem>
                      <strong>희망 파트</strong> {idea.preferredPart}
                    </MetaItem>
                  </IdeaCardMeta>
                </IdeaCard>
              );
            })}
          </IdeaList>
        )}
      </Wrapper>
    </Container>
  );
}
