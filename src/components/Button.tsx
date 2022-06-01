import React, { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: string
  textColor?: string
}

export const Button: React.FC<ButtonProps> = ({
  color = 'bg-violet-600',
  textColor = 'text-white',
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`rounded-md py-2 px-4 flex justify-center items-center gap-1 w-full ${color} ${textColor}`}
      {...props}
    />
  )
}
