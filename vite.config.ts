import { defineConfig, loadEnv } from 'vite'
import type { Plugin, ProxyOptions, ViteDevServer } from 'vite'
import type { ClientRequest, IncomingMessage, ServerResponse } from 'node:http'
import react from '@vitejs/plugin-react'
import contactHandler from './api/contact.js'
import emailSupportHandler from './api/email-support.js'
import marketingSignupHandler from './api/marketing-signup.js'

type ApiHandler = (request: IncomingMessage, response: ServerResponse) => Promise<void> | void
type NextFunction = (error?: unknown) => void

const contactApiHandler = contactHandler as ApiHandler
const emailSupportApiHandler = emailSupportHandler as ApiHandler
const marketingSignupApiHandler = marketingSignupHandler as ApiHandler

// Shopify store origin that actually hosts checkout.
const SHOPIFY_ORIGIN = 'https://orise-6796.myshopify.com'
const SHOPIFY_HOST = 'orise-6796.myshopify.com'
const STORE_DOMAIN = 'mdrnlifeddw.com'

// Transparently proxy the Shopify checkout paths to Shopify during `vite dev`,
// so "Pay now" loads the real Shopify checkout WITHOUT leaving localhost.
// Mirrors what nginx (prod) / vercel.json must do. Any redirects or cookies
// Shopify sets for its own domain are rewritten back to the current host so the
// browser stays put.
function shopifyCheckoutProxy(): ProxyOptions {
  return {
    target: SHOPIFY_ORIGIN,
    // IMPORTANT: do NOT use changeOrigin (it forces Host = myshopify domain, which
    // makes Shopify 301 to its canonical custom domain -> infinite redirect loop).
    // Instead we connect to the myshopify origin via TLS/SNI but send the CUSTOM
    // domain as the Host header, so Shopify treats it as already-canonical and
    // serves the checkout page directly.
    changeOrigin: false,
    secure: true,
    headers: {
      host: STORE_DOMAIN,
    },
    // Drop the cookie Domain attribute so Shopify's checkout cookies stick to localhost.
    cookieDomainRewrite: '',
    configure: (proxy) => {
      // Force the Host on every proxied request (covers redirects/sub-requests too).
      proxy.on('proxyReq', (proxyReq: ClientRequest) => {
        proxyReq.setHeader('host', STORE_DOMAIN)
      })
      proxy.on('proxyRes', (proxyRes: IncomingMessage) => {
        const loc = proxyRes.headers['location']
        if (typeof loc === 'string') {
          // Make Shopify's redirects relative so the browser stays on the current origin.
          const rel = loc
            .replace(`https://${SHOPIFY_HOST}`, '')
            .replace(`http://${SHOPIFY_HOST}`, '')
            .replace(`https://${STORE_DOMAIN}`, '')
            .replace(`http://${STORE_DOMAIN}`, '')
          proxyRes.headers['location'] = rel === '' ? '/' : rel
        }
      })
    },
  }
}

function localShopifyChatApi(): Plugin {
  return {
    name: 'local-shopify-support-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/email-support', async (req: IncomingMessage, res: ServerResponse, next: NextFunction) => {
        try {
          await emailSupportApiHandler(req, res)
        } catch (error) {
          next(error)
        }
      })
      server.middlewares.use('/api/contact', async (req: IncomingMessage, res: ServerResponse, next: NextFunction) => {
        try {
          await contactApiHandler(req, res)
        } catch (error) {
          next(error)
        }
      })
      server.middlewares.use('/api/marketing-signup', async (req: IncomingMessage, res: ServerResponse, next: NextFunction) => {
        try {
          await marketingSignupApiHandler(req, res)
        } catch (error) {
          next(error)
        }
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return {
    plugins: [react(), localShopifyChatApi()],
    server: {
      proxy: {
        '/checkouts': shopifyCheckoutProxy(),
        '/cart/c': shopifyCheckoutProxy(),
        '/a/checkout': shopifyCheckoutProxy(),
        // The Shopify checkout page loads its CSS/JS and other assets from these
        // same-origin paths; without forwarding them the page renders unstyled.
        '/cdn': shopifyCheckoutProxy(),
        '/wpm': shopifyCheckoutProxy(),
        '/payments': shopifyCheckoutProxy(),
        '/services': shopifyCheckoutProxy(),
        '/.well-known': shopifyCheckoutProxy(),
      },
    },
  }
})
