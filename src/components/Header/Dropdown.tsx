import React from 'react'

interface HeaderDropdownProps {
  options: {
    label: string
    onClick: () => void
  }[]
}

export const HeaderDropdown = ({ options }: HeaderDropdownProps) => {
  return (
    <div className="absolute top-8 bg-zinc-300 rounded-md">
      <nav>
        <ul className="py-2">
          {options.map(option => (
            <li
              key={option.label}
              className="
              px-2
              hover:opacity-75
              hover:bg-violet-500
              hover:text-zinc-100
              transition-all
              duration-150
              ease-linear
            "
            >
              <button
                className="text-left text-[0.75rem]"
                type="button"
                onClick={option.onClick}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
