const plugin = require('tailwindcss/plugin')

const cardFlipAnimation = plugin(({ addUtilities }) => {
  addUtilities({
    '.rotate-y-180': {
      transform: 'rotateY(180deg)'
    },
    '.preserve-3d': {
      transformStyle: 'preserve-3d'
    },
  })
})

module.exports = {
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif']
      }
    }
  },
  plugins: [require('@tailwindcss/forms'), cardFlipAnimation]
}
