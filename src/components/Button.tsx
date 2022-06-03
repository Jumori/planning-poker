import React, { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: string
  textColor?: string
  borderColor?: string
}

export const Button: React.FC<ButtonProps> = ({
  color = 'bg-violet-600',
  textColor = 'text-white',
  borderColor = 'border-transparent',
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`
        rounded-md
        py-2
        px-4
        flex
        justify-center
        items-center
        gap-1
        w-full
        hover:opacity-75
        transition-all
        duration-150
        ease-linear
        ${color}
        ${textColor}
        ${
          borderColor !== 'border-transparent'
            ? `border-2 ${borderColor}`
            : borderColor
        }
      `}
      {...props}
    />
  )
}
