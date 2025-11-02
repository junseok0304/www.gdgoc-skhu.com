import React, { useEffect, useMemo, useState } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
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

const SectionTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const FormSection = styled.section`
  margin-bottom: 2.5rem;
`;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  color: #454545;
  span {
    font-weight: 600;
    color: #2c2c2c;
  }
  small {
    font-size: 0.85rem;
    color: #8a8a8a;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const RadioLabel = styled.label<{ $checked: boolean; $disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: ${({ $checked, $disabled }) => {
    if ($disabled) return '#bdbdbd';
    return $checked ? '#3a3a3a' : '#5a5a5a';
  }};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
`;

const RadioInput = styled.input`
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #bbb;
  position: relative;
  transition: 0.15s;
  &:checked {
    border-color: #7f8cff;
  }
  &:checked::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #7f8cff;
  }
  &:disabled {
    border-color: #d1d1d1;
    cursor: not-allowed;
  }
  &:disabled::after {
    background-color: #d1d1d1;
  }
`;

const SubmitButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 220px;
  margin: 0 auto;
  padding: 0.95rem;
  border-radius: 10px;
  border: none;
  background-color: #8a8cff;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;

const EmptyState = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  color: #555;
  line-height: 1.6;
`;

const BackLink = styled.a`
  margin-top: 1.5rem;
  display: inline-flex;
  border: none;
  background: transparent;
  color: #7f8cff;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
`;
import IdeaLayout from '../IdeaLayout/IdeaLayout';
import { Idea, useIdeaStore } from '../store/IdeaStore';

const PART_OPTIONS: Array<{ key: keyof Idea['team']; label: string }> = [
  { key: 'planning', label: '기획' },
  { key: 'design', label: '디자인' },
  { key: 'frontendWeb', label: '프론트엔드(웹)' },
  { key: 'frontendMobile', label: '프론트엔드(모바일)' },
  { key: 'backend', label: '백엔드' },
];

type IdeaApplyPageProps = {
  ideaId: number | null;
};

const ZERO_TEAM: Idea['team'] = {
  planning: 0,
  design: 0,
  frontendWeb: 0,
  frontendMobile: 0,
  backend: 0,
};

const resolveInitialPart = (idea?: Idea) => {
  const team = idea?.team ?? ZERO_TEAM;
  const filled = idea?.filledTeam ?? ZERO_TEAM;
  const target = PART_OPTIONS.find(option => {
    const limit = team[option.key] ?? 0;
    const current = filled[option.key] ?? 0;
    if (limit <= 0) return false;
    return current < limit;
  });
  return target ? target.key : 'planning';
};

export default function IdeaApplyPage({ ideaId }: IdeaApplyPageProps) {
  const addApplicant = useIdeaStore(state => state.addApplicant);

  const idea = useIdeaStore(state => (ideaId !== null ? state.getIdeaById(ideaId) : undefined));

  const router = useRouter();
  const [priority, setPriority] = useState<'1지망' | '2지망' | '3지망'>('1지망');
  const [part, setPart] = useState<keyof Idea['team']>(() => resolveInitialPart(idea));

  const partOptions = useMemo(() => {
    if (!idea) {
      return PART_OPTIONS.map(option => ({ ...option, disabled: false }));
    }
    const team = idea.team ?? ZERO_TEAM;
    const filled = idea.filledTeam ?? ZERO_TEAM;
    const hasPositive = Object.values(team).some(count => count > 0);
    return PART_OPTIONS.map(option => {
      const count = team[option.key] ?? 0;
      const taken = filled[option.key] ?? 0;
      return {
        ...option,
        disabled: hasPositive ? count <= 0 || taken >= count : false,
      };
    });
  }, [idea]);

  useEffect(() => {
    const fallback = partOptions.find(option => !option.disabled)?.key ?? 'planning';
    setPart(prev => {
      const stillEnabled = partOptions.some(option => option.key === prev && !option.disabled);
      return stillEnabled ? prev : fallback;
    });
  }, [partOptions]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!idea) {
      alert('아이디어 정보를 불러오지 못했어요. 다시 시도해주세요.');
      return;
    }
    if (idea.currentMembers >= idea.totalMembers) {
      alert('이미 모집이 완료된 아이디어입니다.');
      return;
    }
    const selected = partOptions.find(option => option.key === part);
    if (selected?.disabled) {
      alert('이미 모집이 완료된 파트입니다.');
      return;
    }
    const accepted = addApplicant(idea.id, part);
    if (!accepted) {
      alert('이미 모집이 완료된 파트입니다.');
      return;
    }
    router.push({ pathname: '/feature/team-building/complete', query: { id: idea.id } });
  };

  if (!idea) {
    return (
      <IdeaLayout>
        <EmptyState>
          지원하려는 아이디어를 찾을 수 없어요.
          <br />
          목록에서 다시 선택해 주세요.
          <Link href="/feature/team-building/welcome" passHref legacyBehavior>
            <BackLink>목록으로 돌아가기</BackLink>
          </Link>
        </EmptyState>
      </IdeaLayout>
    );
  }

  return (
    <IdeaLayout>
      <Header>
        <Title>{idea.title}</Title>
        <Mentor>성공회대 디자인 주현지</Mentor>
      </Header>

      <form onSubmit={handleSubmit}>
        <SectionTitle>지원하기</SectionTitle>

        <FormSection>
          <LabelRow>
            <span>희망 순위를 선택해주세요</span>
            <small>* 하나의 순위만 선택이 가능합니다.</small>
          </LabelRow>
          <RadioGroup>
            {(['1지망', '2지망', '3지망'] as const).map(option => (
              <RadioLabel key={option} $checked={priority === option}>
                <RadioInput
                  type="radio"
                  name="priority"
                  value={option}
                  checked={priority === option}
                  onChange={() => setPriority(option)}
                />
                {option}
              </RadioLabel>
            ))}
          </RadioGroup>
        </FormSection>

        <FormSection>
          <LabelRow>
            <span>희망 파트를 선택해주세요</span>
            <small>* 하나의 파트만 선택이 가능합니다.</small>
          </LabelRow>
          <RadioGroup>
            {partOptions.map(option => (
              <RadioLabel
                key={option.key}
                $checked={part === option.key}
                $disabled={option.disabled}
              >
                <RadioInput
                  type="radio"
                  name="part"
                  value={option.key}
                  checked={part === option.key}
                  disabled={option.disabled}
                  onChange={() => setPart(option.key)}
                />
                {option.label}
              </RadioLabel>
            ))}
          </RadioGroup>
        </FormSection>

        <SubmitButton type="submit">지원 완료</SubmitButton>
      </form>
    </IdeaLayout>
  );
}

export const getServerSideProps: GetServerSideProps<IdeaApplyPageProps> = async context => {
  const { id } = context.params ?? {};
  const rawId = Array.isArray(id) ? id?.[0] : id;
  const parsedId = rawId ? Number(rawId) : NaN;

  return {
    props: {
      ideaId: Number.isNaN(parsedId) ? null : parsedId,
    },
  };
};
