/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        safra: {
          sand: '#F5E6D3',
          sandlight: '#FAF3EB',
          sanddark: '#E8D4BC',
          blue: '#1B3A5C',
          bluelight: '#2A5A8C',
          terracotta: '#C45C3E',
          terracottalight: '#D97B5D',
          white: '#FFFFFF',
          cream: '#FFF9F2',
          turquoise: '#2DD4BF',
          turquoisedark: '#0D9488',
          turquoiselight: '#CCFBF1',
          navy: '#0F172A',
          yellow: '#FBBF24',
          yellowlight: '#FEF3C7',
          coral: '#FB7185',
          corallight: '#FFE4E6',
          gray: '#6B7280',
          graylight: '#9CA3AF',
          offwhite: '#F8FAFC',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'fun': '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
        'fun-lg': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'fun-yellow': '0 4px 14px 0 rgba(251, 191, 36, 0.3)',
        'fun-coral': '0 4px 14px 0 rgba(251, 113, 133, 0.3)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
        'pop-in': 'popIn 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
