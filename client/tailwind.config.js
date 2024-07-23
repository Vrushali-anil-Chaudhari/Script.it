/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
         "border": "#EAEAEA",
         "black": "#111111",
         "reddish":"#F02200",
         "subTextGrey":"#767676",
      },
      animation:{
        slide: "slide 2.5s linear infinite",
        shine: "shine 2s ease-in-out infinite",
        opacityToBottom: "opacityToBottom 1s ease-in-out 1",
      },
      keyframes: {
        slide: {
          "0%": { transform: "translateY(100%)", opacity: 0.1 },
          "15%": { transform: "translateY(0)", opacity: 1 },
          "30%": { transform: "translateY(0)", opacity: 1 },
          "45%": { transform: "translateY(-100%)", opacity: 1 },
          "100%": { transform: "translateY(-100%)", opacity: 0.1 },
        },
        shine:{
          "from": {left: "-4rem"},
          "to": {left: "7rem"}
        },
        opacityToBottom:{
          "from": {opacity: 0},
          "to": {opacity:1}
        }
      },
    },
    
  },
  plugins: [],
}