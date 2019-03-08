// Based on https://medium.com/@AndrewDelPrete/using-purifycss-to-remove-unused-tailwind-css-classes-173b3ee8ee01

let mix = require('laravel-mix');
let tailwindcss = require('tailwindcss');
let glob = require("glob-all");
let PurgecssPlugin = require("purgecss-webpack-plugin");

// Custom PurgeCSS extractor for Tailwind that allows special characters in
// class names.
//
// https://github.com/FullHuman/purgecss#extractor
class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
  }
}

mix.webpackConfig({
  plugins: [
    new PurgecssPlugin({

      // Specify the locations of any files you want to scan for class names.
      paths: glob.sync([
        path.join(__dirname, "src/html/*.html"),
      ]),
      extractors: [
        {
          extractor: TailwindExtractor,

          // Specify the file extensions to include when scanning for
          // class names.
          extensions: ["html", "js", "php"]
        }
      ]
    })
  ]
});

mix.sass('src/scss/app.scss', 'dist/style.css')
  .options({
    processCssUrls: false,
    postCss: [ tailwindcss('tailwind.config.js') ],
  });

mix.copyDirectory('src/html', 'dist');
mix.copyDirectory('src/images', 'dist/images');
mix.copyDirectory('src/fonts', 'dist/fonts');