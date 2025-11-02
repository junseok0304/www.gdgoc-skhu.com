import React, { useMemo } from 'react';
import { useRouter } from 'next/router';

import Apply from '../../../feature/team-building/Apply/apply';

export default function Page() {
  const router = useRouter();
  const { id } = router.query;

  const ideaId = useMemo(() => {
    if (Array.isArray(id)) {
      const parsed = Number(id[0]);
      return Number.isFinite(parsed) ? parsed : null;
    }
    if (typeof id === 'string') {
      const parsed = Number(id);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
  }, [id]);

  return <Apply ideaId={ideaId} />;
}
