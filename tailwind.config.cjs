/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'app-yellow': '#FFDE00',
                'app-blue': '#3B82F6',
                'app-pink': '#EC4899',
                'app-purple': '#A855F7',
                'app-black': '#000000',
                'app-offwhite': '#FDFBF7',
            },
            boxShadow: {
                'neobrutalism': '4px 4px 0px 0px rgba(0,0,0,1)',
            },
            fontFamily: {
                'sans': ['Inter', 'sans-serif'], // Or default
            }
        },
    },
    plugins: [],
}
