import React from 'react';
import dynamic from 'next/dynamic';
import type { ReactQuillProps } from 'react-quill';
import type ReactQuillType from 'react-quill';
import styled, { css } from 'styled-components';

import { sanitizeDescription } from '../utils/sanitizeDescription';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
}) as unknown as React.ForwardRefExoticComponent<
  ReactQuillProps & React.RefAttributes<ReactQuillType>
>;

const FormContainer = styled.div`
  margin-top: 2.25rem;
  font-family: 'Pretendard', sans-serif;
  color: #1f1f1f;
`;

const SectionDivider = styled.div`
  height: 1px;
  background-color: #dcdcdc;
  margin: 1.4rem 0 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.35rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  margin-bottom: 1.6rem;
`;

const TeamSection = styled.div`
  margin-bottom: 1.9rem;
`;

const TeamHeading = styled.p`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
`;

const TeamLimit = styled.span`
  font-size: 0.82rem;
  color: #ea4141;
  strong {
    font-weight: 700;
  }
`;

const TeamCaution = styled.span`
  font-size: 0.78rem;
  color: #ea4141;
`;

const TeamRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.55rem;
  font-size: 0.95rem;
  &:last-of-type {
    margin-bottom: 0;
  }
  span {
    width: 120px;
    color: #4c4c4c;
  }
`;

const CountSelect = styled.select`
  width: 72px;
  border: 1px solid #bcbcbc;
  border-radius: 6px;
  padding: 0.35rem 0.5rem;
  font-size: 0.9rem;
  color: #333;
  background: #fff;
`;

const TeamNotice = styled.p`
  margin: 0.6rem 0 1.4rem;
  font-size: 0.82rem;
  color: #8a8a8a;
`;

const PreferredSection = styled.div`
  margin-bottom: 2.3rem;
`;

const PreferredHeading = styled.p`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
`;

const PreferredHint = styled.span`
  font-size: 0.82rem;
  color: #8a8a8a;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.05rem;
  margin-bottom: 2rem;
`;

const RadioLabel = styled.label<{ $checked: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.95rem;
  cursor: pointer;
  color: ${({ $checked }) => ($checked ? '#1f1f1f' : '#6a6a6a')};
  font-weight: ${({ $checked }) => ($checked ? 600 : 500)};
`;

const RadioInput = styled.input`
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #b5b5b5;
  position: relative;
  transition: 0.15s ease;
  &:checked {
    border-color: #1f1f1f;
  }
  &:checked::after {
    content: '';
    position: absolute;
    inset: 4px;
    border-radius: 50%;
    background-color: #1f1f1f;
  }
`;

const FieldSet = styled.div`
  margin-bottom: 1.7rem;
`;

const FieldLabel = styled.label`
  display: block;
  font-size: 0.92rem;
  font-weight: 600;
  margin-bottom: 0.55rem;
`;

const FieldHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.55rem;
`;

const DescriptionLabel = styled(FieldLabel)`
  margin-bottom: 0;
`;

const AutoSaveStatus = styled.span<{ $saving: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.82rem;
  color: ${({ $saving }) => ($saving ? '#4f5dff' : '#6a6a6a')};
  white-space: nowrap;
  &::before {
    content: '💾';
    font-size: 0.85rem;
    line-height: 1;
  }
`;

const inputStyle = css`
  width: 100%;
  border: 1px solid #bcbcbc;
  border-radius: 6px;
  padding: 0.6rem 0.75rem;
  font-size: 0.95rem;
  color: #2f2f2f;
  background: #fff;
`;

const Select = styled.select`
  ${inputStyle}
  max-width: 240px;
`;

const Input = styled.input`
  ${inputStyle}
`;

const TextAreaWrapper = styled.div`
  position: relative;
`;

const PreviewTag = styled.span`
  position: absolute;
  top: 14px;
  right: 16px;
  font-size: 0.9rem;
  color: #4f4f4f;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  pointer-events: none;
`;

const QuillWrapper = styled.div`
  .ql-toolbar.ql-snow {
    border: 1px solid #bcbcbc;
    border-radius: 6px 6px 0 0;
    background-color: #fff;
    padding: 0.5rem;
  }

  .ql-container.ql-snow {
    border: 1px solid #bcbcbc;
    border-radius: 0 0 6px 6px;
    font-size: 0.95rem;
    min-height: 220px;
  }

  .ql-editor {
    min-height: 200px;
    padding: 1rem;
    line-height: 1.7;
  }

  .ql-toolbar button,
  .ql-toolbar .ql-picker-label {
    border-radius: 4px;
  }
`;

const ButtonGroup = styled.div`
  margin-top: 2.6rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 0.8rem 2.2rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  border: ${({ $variant }) => ($variant === 'primary' ? 'none' : '1px solid #aaa')};
  background: ${({ $variant }) => ($variant === 'primary' ? '#7f8cff' : '#e0e0e0')};
  color: ${({ $variant }) => ($variant === 'primary' ? '#fff' : '#000')};
  transition: 0.2s ease;
  &:hover {
    opacity: 0.9;
  }
`;

const PREFERRED_OPTIONS = [
  '기획',
  '디자인',
  '프론트엔드(웹)',
  '프론트엔드(모바일)',
  '백엔드',
  'AI/ML',
] as const;

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
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onSave: () => void;
  onPreview: () => void;
  onDescriptionChange: (value: string) => void;
  lastSavedAt?: string;
  isSaving?: boolean;
}

const quillModules = {
  toolbar: [
    [{ header: [false, 1, 2, 3] }],
    [{ align: [] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ color: [] }, { background: [] }],
    ['blockquote'],
  ],
};

const quillFormats = [
  'header',
  'align',
  'bold',
  'italic',
  'underline',
  'list',
  'bullet',
  'color',
  'background',
  'blockquote',
];

export default function IdeaForm({
  form,
  onChange,
  onSave,
  onPreview,
  onDescriptionChange,
  lastSavedAt,
  isSaving,
}: Props) {
  const { topic, title, intro, description, preferredPart } = form;
  const team = form.team ?? {
    planning: 0,
    design: 0,
    frontendWeb: 0,
    frontendMobile: 0,
    backend: 0,
  };

  const safeDescription = sanitizeDescription(description ?? '');

  const quillRef = React.useRef<ReactQuillType | null>(null);
  const [quillRoot, setQuillRoot] = React.useState<HTMLElement | null>(null);
  const autoSaveMessage = React.useMemo(() => {
    if (isSaving) return '임시 저장 중...';
    if (lastSavedAt) return `임시 저장 완료 ${lastSavedAt}`;
    return '';
  }, [isSaving, lastSavedAt]);

  React.useEffect(() => {
    if (!quillRef.current) return;
    const editor = quillRef.current.getEditor?.();
    if (editor) setQuillRoot(editor.root);
  }, []);

  React.useEffect(() => {
    if (!quillRoot) return;
    const blockFileInput = (event: ClipboardEvent | DragEvent) => {
      const hasFiles =
        'clipboardData' in event
          ? Boolean(event.clipboardData?.files?.length)
          : Boolean(event.dataTransfer?.files?.length);
      if (hasFiles) event.preventDefault();
    };

    quillRoot.addEventListener('paste', blockFileInput);
    quillRoot.addEventListener('drop', blockFileInput);

    return () => {
      quillRoot.removeEventListener('paste', blockFileInput);
      quillRoot.removeEventListener('drop', blockFileInput);
    };
  }, [quillRoot]);

  const syncEditorContent = React.useCallback((html: string) => {
    const instance = quillRef.current;
    if (!instance?.getEditor) return;
    const editor = instance.getEditor();
    const currentHtml = editor.root.innerHTML;
    if (currentHtml === html) return;

    const selection = editor.getSelection();
    const delta = editor.clipboard.convert(html);
    editor.setContents(delta, 'silent');

    if (selection) {
      const length = editor.getLength();
      const index = Math.min(selection.index, Math.max(length - 1, 0));
      editor.setSelection(index, selection.length, 'silent');
    }
  }, []);

  const handleDescriptionChange = (value: string) => {
    const sanitized = sanitizeDescription(value);
    if (sanitized !== value) syncEditorContent(sanitized);
    onDescriptionChange(sanitized);
  };

  return (
    <FormContainer>
      <SectionTitle>아이디어 작성</SectionTitle>
      <SectionDivider />

      <TeamSection>
        <TeamHeading>
          팀원 구성을 선택해주세요 <TeamLimit>* 팀원 최대 5명</TeamLimit>{' '}
          <TeamCaution>
            * 이 숫자는 운영자가 사전에 받은 설문 답변과 팀원 모집 인원을 연동해요.
          </TeamCaution>
        </TeamHeading>

        {['planning', 'design', 'frontendWeb', 'frontendMobile', 'backend'].map((key, idx) => {
          const label = ['기획', '디자인', '프론트엔드(웹)', '프론트엔드(모바일)', '백엔드'][idx];
          return (
            <TeamRow key={key}>
              <span>{label}</span>
              <CountSelect name={`team.${key}`} value={(team as any)[key]} onChange={onChange}>
                {Array.from({ length: 6 }, (_, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </CountSelect>
            </TeamRow>
          );
        })}
        <TeamNotice>* 작성자의 희망 파트는 아래에서 선택할 수 있습니다.</TeamNotice>
      </TeamSection>

      <PreferredSection>
        <PreferredHeading>
          작성자의 희망 파트를 선택해주세요
          <PreferredHint>* 하나의 파트만 선택이 가능합니다.</PreferredHint>
        </PreferredHeading>
        <RadioGroup>
          {PREFERRED_OPTIONS.map(option => (
            <RadioLabel key={option} $checked={preferredPart === option}>
              <RadioInput
                type="radio"
                name="preferredPart"
                value={option}
                checked={preferredPart === option}
                onChange={onChange}
              />
              {option}
            </RadioLabel>
          ))}
        </RadioGroup>
      </PreferredSection>

      <FieldSet>
        <FieldLabel htmlFor="topic">주제 선택</FieldLabel>
        <Select id="topic" name="topic" value={topic} onChange={onChange}>
          <option value="전체">전체</option>
        </Select>
      </FieldSet>

      <FieldSet>
        <FieldLabel htmlFor="title">아이디어 제목</FieldLabel>
        <Input
          id="title"
          name="title"
          value={title}
          onChange={onChange}
          placeholder="제목을 입력해주세요"
        />
      </FieldSet>

      <FieldSet>
        <FieldLabel htmlFor="intro">아이디어 한 줄 소개</FieldLabel>
        <Input
          id="intro"
          name="intro"
          value={intro}
          onChange={onChange}
          placeholder="아이디어를 간단하게 소개해 주세요"
        />
      </FieldSet>

      <FieldSet>
        <FieldHeader>
          <DescriptionLabel htmlFor="description">아이디어 설명</DescriptionLabel>
          {autoSaveMessage && (
            <AutoSaveStatus $saving={Boolean(isSaving)}>{autoSaveMessage}</AutoSaveStatus>
          )}
        </FieldHeader>
        <TextAreaWrapper>
          <PreviewTag>미리보기</PreviewTag>
          <QuillWrapper>
            <ReactQuill
              ref={quillRef}
              value={safeDescription}
              onChange={handleDescriptionChange}
              modules={quillModules}
              formats={quillFormats}
              placeholder="아이디어를 자유롭게 설명해 주세요!"
            />
          </QuillWrapper>
        </TextAreaWrapper>
      </FieldSet>

      <ButtonGroup>
        <Button type="button" onClick={onPreview} $variant="primary">
          아이디어 미리보기
        </Button>
      </ButtonGroup>
    </FormContainer>
  );
}
