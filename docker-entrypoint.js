import { execSync } from 'node:child_process'

execSync('node ace.js migration:run --force', { stdio: 'inherit' })
await import('./bin/server.js')
