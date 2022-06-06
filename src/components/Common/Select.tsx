import React from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

type SelectProps = {
  name: string
  options: { label: string; value: string | number }[]
  label?: string
  placeholder?: string
  errors: { message?: string } | undefined
  register: (name: string) => UseFormRegisterReturn
}

export const Select = (props: SelectProps) => {
  return (
    <div className="flex flex-col mb-4">
      {props.label && <span className="text-zinc-500">{props.label}</span>}
      <select
        className={`
          h-12
          w-full
          placeholder-zinc-400
          text-zinc-500
          border-zinc-600
          bg-transparent
          rounded-md
          focus:border-violet-500
          focus:ring-violet-500
          focus:ring-1
          focus:outline-none
          ${props.errors && 'border-red-500 text-red-500'}
        `}
        defaultValue={props.options.length > 1 ? '' : undefined}
        {...props.register(props.name)}
      >
        {props.placeholder && (
          <option value="" disabled hidden>
            {props.placeholder}
          </option>
        )}

        {props.options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {props.errors && (
        <span className="text-sm text-red-600">{props.errors.message}</span>
      )}
    </div>
  )
}
