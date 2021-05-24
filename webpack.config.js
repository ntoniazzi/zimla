const Encore = require('@symfony/webpack-encore');
const { resolve } = require('path');

/*
let prefix = process.env.prefix;
if (undefined === prefix) {
    prefix = "";
} else {
    prefix = prefix.replace(/^\/+/, '').replace(/\/+$/, '') + '/';
}
*/

Encore
    .setOutputPath('public/build')
    .setPublicPath('/build')
    .cleanupOutputBeforeBuild()
    .enableVueLoader(() => {}, { runtimeCompilerBuild: false })
    .enableSassLoader()
    .enableTypeScriptLoader(options => {
        // options.appendTsSuffixTo = [/\.vue$/];
        options.transpileOnly = true;
        // options.configFile = 'tsconfig.json';
    })
    .enableSingleRuntimeChunk()

    .copyFiles({ from: './assets/flags', pattern: /\.svg$/, to: 'flags/[name].[ext]'})
    .copyFiles({ from: './maps', pattern: /\.(svg|data)$/, to: 'maps/[name].[ext]'})

    .addEntry('app', resolve(__dirname, '/src/app.ts'))
    // .addEntry('app', resolve(__dirname, '/src/t.ts'))

    .configureCssMinimizerPlugin(options => {
        options.minimizerOptions = {
            preset: [
                'default',
                {
                  mergeLonghand: false,
                },
              ],
        };
    })
;

module.exports = Encore.getWebpackConfig();
