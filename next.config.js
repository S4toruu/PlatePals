/** @type {import('next').NextConfig} */
const path = require('path')
const { i18n } = require('./next-i18next.config')

module.exports = {
  i18n,
  images: {
    domains: [process.env.NEXT_IMAGE_DOMAIN]
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Referrer-Policy',
            value: 'no-referrer-when-downgrade'
          }
        ]
      }
    ]
  }
}
