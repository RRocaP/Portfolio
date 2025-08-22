import { PurgeCSS } from 'purgecss';
import fs from 'fs';
import postcss from 'postcss';
import cssnano from 'cssnano';

(async () => {
  const result = await new PurgeCSS().purge({
    content: ['index.html'],
    css: ['styles.css']
  });
  const purged = result[0].css;
  const { css } = await postcss([cssnano]).process(purged, { from: undefined });
  fs.writeFileSync('styles.min.css', css);
})();
