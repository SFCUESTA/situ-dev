// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        // Ensure these paths correctly point to your components and pages
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // If using App Router
    ],
    theme: {
        extend: {
            // ... any other theme extensions you might have
            animation: {
                scroll:
                    "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
            },
            keyframes: {
                scroll: {
                    to: {
                        // This moves the content.
                        // -50% translates by half of the total width (original + duplicated items).
                        // -0.5rem accounts for half of the `gap-4` (which is 1rem) applied in InfiniteMovingCards.jsx.
                        // If you change the `gap` in the component, adjust this value (gap / 2).
                        transform: "translate(calc(-50% - 0.5rem))",
                    },
                },
            },
        },
    },
    plugins: [
        // ... any other plugins you might be using
    ],
};