/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    invoiceCode: process.env.DB_INVOICE_START_FROM,
    invoiceCodeNumber: process.env.DB_INVOICE_START_DIGIT,
    backendURL: process.env.DB_BACKENDURL+'/api',
    frontendURL: process.env.DB_FRONTENDENDURL,
    imagekiturl: process.env.DB_IMAGEKIT_URL,
    imagekitPublicKey: process.env.DB_IMAGEKIT_PUBLICKEY,
    imagekitPriateKey: process.env.DB_IMAGEKIT_PRIVATEKEY,
    imagekitUrlEndpoint: process.env.DB_IMAGEKIT_URLENDPOINTKEY,
  }
}

module.exports = nextConfig


