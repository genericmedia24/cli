import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

/** Resolved CLI configuration values. */
export interface Config {
  /** The API base URL. */
  apiUrl: string
  /** The bearer token for authentication. */
  token: null | string
}

const configDir = join(homedir(), '.config', 'gma')
const configFile = join(configDir, 'config.json')

/** Reads the CLI configuration from disk, falling back to defaults. */
export function loadConfig(): Config {
  const defaults: Config = {
    apiUrl: 'http://localhost',
    token: null,
  }

  if (!existsSync(configFile)) {
    return defaults
  }

  try {
    const raw = readFileSync(configFile, 'utf-8')

    return {
      ...defaults,
      ...JSON.parse(raw) as Partial<Config>,
    }
  } catch {
    return defaults
  }
}

/**
 * Resolves the effective configuration by layering environment variables
 * over the persisted config file. `GMA_TOKEN` and `GMA_API_URL` take
 * precedence when set, matching the `GH_TOKEN` convention.
 */
export function resolveConfig(): Config {
  const file = loadConfig()

  return {
    apiUrl: process.env['GMA_API_URL'] ?? file.apiUrl,
    token: process.env['GMA_TOKEN'] ?? file.token,
  }
}

/** Writes the CLI configuration to disk, merging with existing values. */
export function saveConfig(partial: Partial<Config>): void {
  const current = loadConfig()

  const merged = {
    ...current,
    ...partial,
  }

  mkdirSync(configDir, {
    recursive: true,
  })

  writeFileSync(configFile, JSON.stringify(merged, null, 2) + '\n')
}
