const gulp = require('gulp');
const rollup = require('rollup');
const rollupPluginNodeResolve = require('@rollup/plugin-node-resolve');
const rollupPluginTypescript = require('@rollup/plugin-typescript');
const fs = require('fs');
const path = require('path');
const terser = require("rollup-plugin-terser");

gulp.task('build', async (done) => {
   // bundle it
   try {
      const bundle = await rollup.rollup({
         input: './src/index.js',
         plugins: [
            rollupPluginNodeResolve.nodeResolve(),
            // rollupPluginTypescript(),
            // terser.terser(),
         ],
      });

      // write it
      await bundle.write({
         file: './bin/bundle.js',
         format: 'umd',
         name: 'bundle',
         sourcemap: true,
      });

      // update autoreload
      const reloadText = JSON.stringify({ changed: Date.now() });
      fs.writeFileSync(path.join(__dirname, 'reload.json'), reloadText);
      done();
   } catch (e) {
      console.log('Catching Rollup Build Error');
      console.log(e);
      done();
   }
});

gulp.task('watch', async (done) => {
   gulp.watch('./src/**.js', gulp.series(["build"]));
});
