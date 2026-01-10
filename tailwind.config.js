/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "media",
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "var(--color-border)", // gray-200
                input: "var(--color-input)", // gray-200
                ring: "var(--color-ring)", // blue-600
                background: "var(--color-background)", // gray-50
                foreground: "var(--color-foreground)", // gray-900
                primary: {
                    DEFAULT: "var(--color-primary)", // blue-600
                    foreground: "var(--color-primary-foreground)", // white
                },
                secondary: {
                    DEFAULT: "var(--color-secondary)", // violet-600
                    foreground: "var(--color-secondary-foreground)", // white
                },
                destructive: {
                    DEFAULT: "var(--color-destructive)", // red-600
                    foreground: "var(--color-destructive-foreground)", // white
                },
                muted: {
                    DEFAULT: "var(--color-muted)", // gray-100
                    foreground: "var(--color-muted-foreground)", // gray-500
                },
                accent: {
                    DEFAULT: "var(--color-accent)", // emerald-600
                    foreground: "var(--color-accent-foreground)", // white
                },
                popover: {
                    DEFAULT: "var(--color-popover)", // white
                    foreground: "var(--color-popover-foreground)", // gray-900
                },
                card: {
                    DEFAULT: "var(--color-card)", // white
                    foreground: "var(--color-card-foreground)", // gray-900
                },
                success: {
                    DEFAULT: "var(--color-success)", // emerald-500
                    foreground: "var(--color-success-foreground)", // white
                },
                warning: {
                    DEFAULT: "var(--color-warning)", // amber-500
                    foreground: "var(--color-warning-foreground)", // white
                },
                error: {
                    DEFAULT: "var(--color-error)", // red-500
                    foreground: "var(--color-error-foreground)", // white
                },
                trust: {
                    DEFAULT: "var(--color-trust)", // indigo-500
                    foreground: "var(--color-trust-foreground)", // white
                },
                'surface-dark': {
                    DEFAULT: "var(--color-surface-dark)", // slate-800
                    foreground: "var(--color-surface-dark-foreground)", // white
                },
            },
            fontFamily: {
                headline: ['var(--font-headline)'],
                body: ['var(--font-body)'],
                cta: ['var(--font-cta)'],
                accent: ['var(--font-accent)'],
            },
            spacing: {
                'xs': 'var(--spacing-xs)',
                'sm': 'var(--spacing-sm)',
                'md': 'var(--spacing-md)',
                'lg': 'var(--spacing-lg)',
                'xl': 'var(--spacing-xl)',
                '2xl': 'var(--spacing-2xl)',
                '3xl': 'var(--spacing-3xl)',
                '4xl': 'var(--spacing-4xl)',
            },
            borderRadius: {
                sm: "var(--radius-sm)",
                md: "var(--radius-md)",
                lg: "var(--radius-lg)",
            },
            boxShadow: {
                'sm': 'var(--shadow-sm)',
                'md': 'var(--shadow-md)',
                'lg': 'var(--shadow-lg)',
                'xl': 'var(--shadow-xl)',
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "fade-in": {
                    from: { opacity: "0" },
                    to: { opacity: "1" },
                },
                "slide-in-right": {
                    from: { transform: "translateX(100%)" },
                    to: { transform: "translateX(0)" },
                },
                "slide-in-left": {
                    from: { transform: "translateX(-100%)" },
                    to: { transform: "translateX(0)" },
                },
                "bounce-subtle": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-4px)" },
                },
                "pulse-scale": {
                    "0%, 100%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.05)" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fade-in 0.8s ease-out",
                "slide-in-right": "slide-in-right 0.3s ease-out",
                "slide-in-left": "slide-in-left 0.3s ease-out",
                "bounce-subtle": "bounce-subtle 0.6s ease-out",
                "pulse-scale": "pulse-scale 2s infinite",
            },
        },
    },
    plugins: [require("@tailwindcss/typography")],
}