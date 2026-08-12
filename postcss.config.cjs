const path = require('node:path');

module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss')({
      config: path.join(__dirname, 'tailwind.config.cjs'),
    }),
    require('postcss-preset-env')({
      autoprefixer: false,
      features: {
        'is-pseudo-class': false,
      },
    }),
    require('autoprefixer'),
  ],
};
