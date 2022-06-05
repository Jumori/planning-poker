import React from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

type InputProps = {
  name: string
  label?: string
  placeholder?: string
  errors: { message?: string } | undefined
  register: (name: string) => UseFormRegisterReturn
}

export const Input = (props: InputProps) => {
  return (
    <div className="flex flex-col mb-4">
      {props.label && <span className="text-zinc-500">{props.label}</span>}

      <input
        type="text"
        placeholder={props.placeholder || ''}
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
        {...props.register(props.name)}
      />
      {props.errors && (
        <span className="text-sm text-red-600">{props.errors.message}</span>
      )}
    </div>
  )
}
