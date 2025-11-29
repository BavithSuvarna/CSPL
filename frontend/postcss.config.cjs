// frontend/postcss.config.cjs
// Use the separate PostCSS plugin wrapper for Tailwind
// (the PostCSS plugin moved to @tailwindcss/postcss)
module.exports = {
  plugins: [
    require('@tailwindcss/postcss')(),
    require('autoprefixer')(),
  ],
};
