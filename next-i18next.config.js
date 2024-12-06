const config = require('./site.config')

module.exports = {
  i18n: {
    // debug: true,
    defaultLocale: config.defaultLocale,
    locales: Object.keys(config.locales),
  },
}
