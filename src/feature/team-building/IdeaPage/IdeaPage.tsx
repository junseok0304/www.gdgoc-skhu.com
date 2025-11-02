import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import IdeaComplete from '../IdeaComplete/IdeaComplete';
import IdeaForm from '../IdeaForm/IdeaForm';
import IdeaLayout from '../IdeaLayout/IdeaLayout';
import IdeaPreview from '../IdeaPreview/IdeaPreview';
import { Idea, useIdeaStore } from '../store/IdeaStore';

const DraftModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
  z-index: 1000;
`;

const DraftModalCard = styled.div`
  width: min(420px, 90%);
  border-radius: 18px;
  background: #fff;
  padding: 2.5rem 2.2rem;
  box-shadow: 0 20px 46px rgba(0, 0, 0, 0.12);
  font-family: 'Pretendard', sans-serif;
  color: #1f1f1f;
  text-align: center;
`;

const DraftModalTitle = styled.h2`
  font-size: 1.35rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const DraftModalMessage = styled.p`
  font-size: 0.96rem;
  line-height: 1.6;
  margin-bottom: 0.75rem;
`;

const DraftModalSavedAt = styled.p`
  font-size: 0.82rem;
  color: #6a6a6a;
  margin-bottom: 1.8rem;
`;

const DraftModalActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
`;

const DraftModalButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  min-width: 120px;
  padding: 0.75rem 1.6rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  border: ${({ $variant }) => ($variant === 'secondary' ? '1px solid #bdbdbd' : 'none')};
  background: ${({ $variant }) => ($variant === 'secondary' ? '#fff' : '#7f8cff')};
  color: ${({ $variant }) => ($variant === 'secondary' ? '#1f1f1f' : '#fff')};
  transition: 0.2s ease;
  &:hover {
    opacity: 0.9;
  }
`;

type IdeaFormState = {
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
  currentMembers: number;
  totalMembers: number;
};

type IdeaDraftPayload = {
  form: IdeaFormState;
  savedAt: string;
};

const DRAFT_STORAGE_KEY = 'ideaDraft';

const formatDraftTimestamp = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (num: number) => String(num).padStart(2, '0');
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
};

const createInitialForm = (): IdeaFormState => ({
  topic: '전체',
  title: '',
  intro: '',
  description: '',
  preferredPart: '기획',
  team: {
    planning: 0,
    design: 0,
    frontendWeb: 0,
    frontendMobile: 0,
    backend: 0,
  },
  currentMembers: 0,
  totalMembers: 0,
});

export default function IdeaPage() {
  const router = useRouter();
  const addIdea = useIdeaStore(state => state.addIdea);

  const [form, setForm] = useState<IdeaFormState>(() => createInitialForm());
  const [step, setStep] = useState<'form' | 'preview' | 'complete'>('form');
  const [completedIdea, setCompletedIdea] = useState<Idea | null>(null);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [draftForm, setDraftForm] = useState<IdeaFormState | null>(null);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  const autoSaveTimerRef = useRef<number | null>(null);
  const skipAutoSaveRef = useRef(false);
  const hasInitializedAutoSaveRef = useRef(false);
  const latestFormRef = useRef(form);

  const persistDraft = useCallback(
    (targetForm: IdeaFormState, options: { showAlert?: boolean } = {}) => {
      if (typeof window === 'undefined') {
        if (options.showAlert) {
          alert('브라우저 환경에서만 임시 저장을 사용할 수 있어요.');
        }
        return;
      }

      try {
        const payload: IdeaDraftPayload = {
          form: {
            ...targetForm,
            team: { ...targetForm.team },
          },
          savedAt: new Date().toISOString(),
        };
        window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload));
        setDraftForm(payload.form);
        setDraftSavedAt(payload.savedAt);
        if (options.showAlert) {
          alert('아이디어가 임시 저장되었습니다!');
        }
      } catch (error) {
        console.error('Failed to save idea draft', error);
        if (options.showAlert) {
          alert('임시 저장 중 오류가 발생했어요. 브라우저 저장 공간을 확인해 주세요.');
        }
      }
    },
    []
  );

  const clearAutoSaveTimer = useCallback(() => {
    if (autoSaveTimerRef.current) {
      window.clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!raw) return;
      const stored = JSON.parse(raw) as IdeaDraftPayload;
      if (!stored?.form) return;
      const base = createInitialForm();
      const legacyTeam = (stored.form.team ?? {}) as Record<string, number | undefined>;
      const sanitized: IdeaFormState = {
        ...base,
        ...stored.form,
        team: {
          ...base.team,
          ...(stored.form.team ?? base.team),
          frontendWeb:
            stored.form.team?.frontendWeb ??
            (typeof legacyTeam.frontend === 'number' ? legacyTeam.frontend : base.team.frontendWeb),
          frontendMobile: stored.form.team?.frontendMobile ?? base.team.frontendMobile,
        },
        currentMembers: stored.form.currentMembers ?? base.currentMembers,
        totalMembers: stored.form.totalMembers ?? base.totalMembers,
      };
      setDraftForm(sanitized);
      setDraftSavedAt(stored.savedAt ?? null);
      setIsDraftModalOpen(true);
    } catch (error) {
      console.error('Failed to read draft from storage', error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOffline = () => {
      try {
        window.localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch (error) {
        console.error('Failed to clear draft storage on offline', error);
      }
      setDraftForm(null);
      setDraftSavedAt(null);
      setIsDraftModalOpen(false);
    };

    window.addEventListener('offline', handleOffline);

    if (!window.navigator.onLine) {
      handleOffline();
    }

    return () => {
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (skipAutoSaveRef.current) {
      skipAutoSaveRef.current = false;
      return;
    }

    if (!hasInitializedAutoSaveRef.current) {
      hasInitializedAutoSaveRef.current = true;
      return;
    }

    clearAutoSaveTimer();

    setIsAutoSaving(true);
    autoSaveTimerRef.current = window.setTimeout(() => {
      persistDraft(form, { showAlert: false });
      setIsAutoSaving(false);
      autoSaveTimerRef.current = null;
    }, 1000);

    return () => {
      clearAutoSaveTimer();
    };
  }, [clearAutoSaveTimer, form, persistDraft]);

  const formattedSavedAt = useMemo(() => {
    if (!draftSavedAt) return '';
    return formatDraftTimestamp(draftSavedAt);
  }, [draftSavedAt]);

  const updateFormState = useCallback((updater: (prev: IdeaFormState) => IdeaFormState) => {
    setForm(prev => {
      const next = updater(prev);
      latestFormRef.current = next;
      return next;
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith('team.')) {
      const key = name.split('.')[1] as keyof IdeaFormState['team'];
      const numericValue = Number(value);
      updateFormState(prev => ({
        ...prev,
        team: {
          ...prev.team,
          [key]: Number.isNaN(numericValue) ? 0 : numericValue,
        },
      }));
      return;
    }
    updateFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (value: string) => {
    updateFormState(prev => ({ ...prev, description: value }));
  };

  const handleSave = () => {
    clearAutoSaveTimer();
    setIsAutoSaving(false);
    persistDraft(form, { showAlert: true });
  };
  const handlePreview = () => setStep('preview');
  const handleBack = () => setStep('form');

  const handleRegister = () => {
    clearAutoSaveTimer();
    setIsAutoSaving(false);
    const teamTotal = Object.values(form.team).reduce((sum, count) => sum + count, 0);
    const computedTotal = teamTotal > 0 ? teamTotal : 1;
    const ideaData = {
      ...form,
      totalMembers: computedTotal,
      currentMembers: form.currentMembers ?? 0,
    };
    const createdIdea = addIdea(ideaData);
    setCompletedIdea(createdIdea);
    alert('아이디어가 등록되었습니다!');
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    }
    setDraftForm(null);
    setDraftSavedAt(null);
    skipAutoSaveRef.current = true;
    const initial = createInitialForm();
    latestFormRef.current = initial;
    setForm(initial);
    setStep('complete');
  };

  const handleGoList = () => {
    setStep('form');
    router.push('/feature/team-building/welcome');
  };

  const handleLoadDraft = () => {
    if (!draftForm) {
      setIsDraftModalOpen(false);
      return;
    }
    clearAutoSaveTimer();
    setIsAutoSaving(false);
    skipAutoSaveRef.current = true;
    const nextForm = {
      ...draftForm,
      team: { ...draftForm.team },
    };
    latestFormRef.current = nextForm;
    setForm(nextForm);
    setStep('form');
    setCompletedIdea(null);
    setIsDraftModalOpen(false);
  };

  const handleSkipDraft = () => {
    clearAutoSaveTimer();
    setIsAutoSaving(false);
    skipAutoSaveRef.current = true;
    const initial = createInitialForm();
    latestFormRef.current = initial;
    setForm(initial);
    setStep('form');
    setCompletedIdea(null);
    setIsDraftModalOpen(false);
  };

  useEffect(() => {
    latestFormRef.current = form;
  }, [form]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const flushDraft = () => {
      const currentForm = latestFormRef.current;
      if (!currentForm) return;
      clearAutoSaveTimer();
      setIsAutoSaving(false);
      persistDraft(currentForm, { showAlert: false });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushDraft();
      }
    };

    window.addEventListener('pagehide', flushDraft);
    window.addEventListener('visibilitychange', handleVisibilityChange);
    router.events?.on('routeChangeStart', flushDraft);

    return () => {
      window.removeEventListener('pagehide', flushDraft);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      router.events?.off('routeChangeStart', flushDraft);
    };
  }, [clearAutoSaveTimer, persistDraft, router.events]);

  return (
    <>
      {isDraftModalOpen && draftForm && (
        <DraftModalBackdrop>
          <DraftModalCard>
            <DraftModalTitle>임시 저장된 글이 있어요.</DraftModalTitle>
            <DraftModalMessage>
              예를 누르면 작성하던 내용을 불러옵니다.
              <br />
              아니오를 누르면 처음부터 새로 작성해요.
            </DraftModalMessage>
            {formattedSavedAt && (
              <DraftModalSavedAt>마지막 저장: {formattedSavedAt}</DraftModalSavedAt>
            )}
            <DraftModalActions>
              <DraftModalButton type="button" onClick={handleLoadDraft} $variant="primary">
                예
              </DraftModalButton>
              <DraftModalButton type="button" onClick={handleSkipDraft} $variant="secondary">
                아니오
              </DraftModalButton>
            </DraftModalActions>
          </DraftModalCard>
        </DraftModalBackdrop>
      )}
      <IdeaLayout>
        {step === 'form' && (
          <IdeaForm
            form={form}
            onChange={handleChange}
            onSave={handleSave}
            onPreview={handlePreview}
            onDescriptionChange={handleDescriptionChange}
            lastSavedAt={formattedSavedAt}
            isSaving={isAutoSaving}
          />
        )}
        {step === 'preview' && (
          <IdeaPreview form={form} onBack={handleBack} onRegister={handleRegister} />
        )}
        {step === 'complete' && completedIdea && (
          <IdeaComplete idea={completedIdea} onGoList={handleGoList} />
        )}
      </IdeaLayout>
    </>
  );
}
