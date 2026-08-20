import { randomBytes } from 'node:crypto'
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const tmpDir = new URL('./tmp/', import.meta.url)
mkdirSync(tmpDir, { recursive: true })

process.env.NODE_ENV ||= 'production'
process.env.HOST ||= '0.0.0.0'
process.env.PORT ||= '3333'
process.env.LOG_LEVEL ||= 'info'
process.env.SESSION_DRIVER ||= 'cookie'
process.env.TZ ||= 'UTC'

if (!process.env.APP_KEY?.trim()) {
  const keyFile = new URL('./tmp/.app_key', import.meta.url)
  if (existsSync(keyFile)) {
    process.env.APP_KEY = readFileSync(keyFile, 'utf8').trim()
  } else {
    process.env.APP_KEY = randomBytes(32).toString('base64url')
    writeFileSync(keyFile, process.env.APP_KEY)
  }
}

if (!process.env.APP_URL?.trim()) {
  const fromCoolify = [process.env.COOLIFY_URL, process.env.COOLIFY_FQDN]
    .flatMap((value) => (value ? value.split(',') : []))
    .map((value) => value.trim())
    .find(Boolean)

  if (fromCoolify) {
    const value = fromCoolify.replace(/\/$/, '')
    if (/^https?:\/\//.test(value)) {
      process.env.APP_URL = value
    } else {
      const local = /localhost|127\.0\.0\.1|sslip\.io|nip\.io/i.test(value)
      process.env.APP_URL = `${local ? 'http' : 'https'}://${value}`
    }
  } else {
    process.env.APP_URL = `http://localhost:${process.env.PORT}`
  }
}

execSync('node ace.js migration:run --force', { stdio: 'inherit' })
await import('./bin/server.js')
