import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function getApplicationsPath() {
  if (process.env.APPLICATIONS_PATH) {
    return process.env.APPLICATIONS_PATH
  }
  if (process.env.VERCEL) {
    return '/tmp/applications.json'
  }
  return path.join(__dirname, '..', '..', 'data', 'applications.json')
}

export function persistApplication(body) {
  const application = {
    ...body,
    submittedAt: new Date().toISOString(),
  }

  const dataPath = getApplicationsPath()
  let apps = []

  try {
    const raw = fs.readFileSync(dataPath, 'utf8')
    apps = JSON.parse(raw)
  } catch {
    apps = []
  }
  if (!Array.isArray(apps)) apps = []

  apps.push(application)
  fs.mkdirSync(path.dirname(dataPath), { recursive: true })
  fs.writeFileSync(dataPath, JSON.stringify(apps, null, 2))

  return application
}
