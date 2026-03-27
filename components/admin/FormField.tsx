'use client';

import type { ChangeEvent, ReactNode } from 'react';

type Base = {
  label: string;
  error?: string;
  id?: string;
  required?: boolean;
  hint?: ReactNode;
};

type TextLike = Base & {
  type: 'text' | 'textarea' | 'date';
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  name?: string;
};

type Select = Base & {
  type: 'select';
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  name?: string;
};

type Checkbox = Base & {
  type: 'checkbox';
  checked: boolean;
  onChange: (checked: boolean) => void;
  name?: string;
};

export type FormFieldProps = TextLike | Select | Checkbox;

const fieldClass =
  'w-full rounded-lg border border-[#EDE4D3] bg-white px-3 text-sm text-[#3D1F10] outline-none transition focus:border-[#8B3A1E] focus:ring-1 focus:ring-[#8B3A1E]/25';

export function FormField(props: FormFieldProps) {
  const id =
    props.id ??
    `field-${props.label.replace(/\s+/g, '-').toLowerCase()}-${props.type}`;

  const labelEl = (
    <label htmlFor={id} className="mb-1.5 block font-sans text-sm font-medium text-[#3D1F10]">
      {props.label}
      {props.required ? <span className="text-[#8B3A1E]"> *</span> : null}
    </label>
  );

  if (props.type === 'checkbox') {
    return (
      <div>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            id={id}
            name={props.name}
            type="checkbox"
            checked={props.checked}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              props.onChange(e.target.checked)
            }
            className="h-4 w-4 rounded border-[#EDE4D3] text-[#8B3A1E] focus:ring-[#8B3A1E]"
          />
          <span className="font-sans text-sm text-[#3D1F10]">{props.label}</span>
        </label>
        {props.hint ? (
          <p className="mt-1 font-sans text-xs text-[#6B4C35]">{props.hint}</p>
        ) : null}
        {props.error ? (
          <p className="mt-1 font-sans text-xs text-[#8B3A1E]">{props.error}</p>
        ) : null}
      </div>
    );
  }

  if (props.type === 'select') {
    return (
      <div>
        {labelEl}
        <select
          id={id}
          name={props.name}
          value={props.value}
          required={props.required}
          onChange={(e) => props.onChange(e.target.value)}
          className={`${fieldClass} h-11`}
        >
          {props.placeholder ? (
            <option value="">{props.placeholder}</option>
          ) : null}
          {props.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {props.hint ? (
          <p className="mt-1 font-sans text-xs text-[#6B4C35]">{props.hint}</p>
        ) : null}
        {props.error ? (
          <p className="mt-1 font-sans text-xs text-[#8B3A1E]">{props.error}</p>
        ) : null}
      </div>
    );
  }

  if (props.type === 'textarea') {
    return (
      <div>
        {labelEl}
        <textarea
          id={id}
          name={props.name}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
          rows={props.rows ?? 5}
          className={`${fieldClass} resize-y py-2.5`}
        />
        {props.hint ? (
          <p className="mt-1 font-sans text-xs text-[#6B4C35]">{props.hint}</p>
        ) : null}
        {props.error ? (
          <p className="mt-1 font-sans text-xs text-[#8B3A1E]">{props.error}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      {labelEl}
      <input
        id={id}
        name={props.name}
        type={props.type}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        className={`${fieldClass} h-11`}
      />
      {props.hint ? (
        <p className="mt-1 font-sans text-xs text-[#6B4C35]">{props.hint}</p>
      ) : null}
      {props.error ? (
        <p className="mt-1 font-sans text-xs text-[#8B3A1E]">{props.error}</p>
      ) : null}
    </div>
  );
}
