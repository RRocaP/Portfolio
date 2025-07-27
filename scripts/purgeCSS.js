const { PurgeCSS } = require('purgecss');
const fs = require('fs');

(async () => {
  const purgeCSSResult = await new PurgeCSS().purge({
    content: ['index.html'],
    css: ['styles.min.css']
  });
  const result = purgeCSSResult[0].css;
  fs.writeFileSync('styles.min.css', result);
})();
