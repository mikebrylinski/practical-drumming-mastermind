import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataPath = path.join(__dirname, '..', '..', 'data', 'applications.json')

export default function applyHandler(req, res) {
  try {
    const application = {
      ...req.body,
      submittedAt: new Date().toISOString(),
    }
    console.log('[POST /api/apply]', JSON.stringify(application, null, 2))

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

    res.status(201).json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, error: 'Server error' })
  }
}
