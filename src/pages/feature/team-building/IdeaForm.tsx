import React, { useState } from 'react';
import IdeaForm from '../../../feature/team-building/IdeaForm/IdeaForm';

export default function Page() {
  const [form, setForm] = useState<any>({});

  const onChange = (next: any) => {
    setForm(next);
  };

  const onDescriptionChange = (description: string) => {
    setForm((prev: any) => ({ ...prev, description }));
  };

  const onSave = () => {
    // implement save logic
    console.log('save', form);
  };

  const onPreview = () => {
    // implement preview logic
    console.log('preview', form);
  };

  return (
    <IdeaForm
      form={form}
      onChange={onChange}
      onSave={onSave}
      onPreview={onPreview}
      onDescriptionChange={onDescriptionChange}
    />
  );
}
