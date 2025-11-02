import React, { useMemo } from 'react';
import { useRouter } from 'next/router';

import IdeaPreview from '../../../feature/team-building/IdeaPreview/IdeaPreview';
import { useIdeaStore } from '../../../feature/team-building/store/IdeaStore';

export default function Page() {
  const router = useRouter();
  const { id } = router.query;

  const numericId = useMemo(() => {
    if (Array.isArray(id)) return Number(id[0]);
    return id ? Number(id) : NaN;
  }, [id]);

  const idea = useIdeaStore(state =>
    Number.isFinite(numericId) ? state.getIdeaById(Number(numericId)) : undefined
  );

  if (!idea) {
    return (
      <div
        style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          fontFamily: 'Pretendard, sans-serif',
          lineHeight: 1.6,
        }}
      >
        미리보려는 아이디어를 찾을 수 없어요.
        <br />
        <button
          type="button"
          style={{
            marginTop: '1.5rem',
            border: 'none',
            background: 'none',
            color: '#7f8cff',
            fontWeight: 600,
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
          onClick={() => router.push('/feature/team-building/welcome')}
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  const { team } = idea;

  return (
    <IdeaPreview
      form={{
        topic: idea.topic,
        title: idea.title,
        intro: idea.intro,
        description: idea.description,
        preferredPart: idea.preferredPart,
        team: {
          planning: team?.planning ?? 0,
          design: team?.design ?? 0,
          frontendWeb: team?.frontendWeb ?? 0,
          frontendMobile: team?.frontendMobile ?? 0,
          backend: team?.backend ?? 0,
        },
      }}
      onBack={() => router.back()}
      onRegister={() =>
        router.push({ pathname: '/feature/team-building/apply', query: { id: idea.id } })
      }
    />
  );
}
