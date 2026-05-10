/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    {
      pattern: /(bg|text|border)-(preto|vermelho|verde|amarelo|laranja|roxo|cinza-escuro|cinza-medio|cinza-borda|branco|branco-dim|azul-mente)/,
      variants: ['hover', 'focus', 'active', 'placeholder'],
    },
    {
      pattern: /font-(display|body|mono)/,
    },
    'placeholder-branco-dim/50',
  ],
  theme: {
    extend: {
      colors: {
        preto: '#0D0D0D',
        vermelho: '#FF3B3B',
        verde: '#00C853',
        amarelo: '#FFC857',
        laranja: '#FF8C42',
        roxo: '#B366FF',
        'cinza-escuro': '#1A1A1A',
        'cinza-medio': '#2A2A2A',
        'cinza-borda': '#333333',
        branco: '#F5F5F5',
        'branco-dim': '#AAAAAA',
        'azul-mente': '#5B8CFF',
      },
      fontFamily: {
        display: ['var(--font-display)', 'cursive'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        sans: ['var(--font-body)', 'sans-serif'],
      },
      letterSpacing: {
        'ultra-wide': '0.3em',
        'extra-wide': '0.2em',
      },
      animation: {
        'slide-in-up': 'slideInUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-in',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
};
