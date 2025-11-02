import React from 'react';
import { useRouter } from 'next/router';

import IdeaComplete from '../../../feature/team-building/IdeaComplete/IdeaComplete';
import { useIdeaStore } from '../../../feature/team-building/store/IdeaStore';

export default function Page() {
  const router = useRouter();

  const ideaId = React.useMemo(() => {
    const { id } = router.query;
    if (Array.isArray(id)) return Number(id[0]);
    return id ? Number(id) : NaN;
  }, [router.query]);

  const idea = useIdeaStore(state =>
    Number.isFinite(ideaId) ? state.getIdeaById(ideaId) : undefined
  );

  const handleGoList = React.useCallback(() => {
    void router.push('/feature/team-building/IdeaList');
  }, [router]);

  if (!idea) {
    if (typeof window !== 'undefined') {
      void router.replace('/feature/team-building/IdeaList');
    }
    return null;
  }

  return <IdeaComplete idea={idea} onGoList={handleGoList} />;
}
