import { resolveConfig } from './config.js'
import { Configuration } from './openapi/runtime.js'

/**
 * Creates an OpenAPI Configuration using the resolved token and API URL.
 * Environment variables (`GMA_TOKEN`, `GMA_API_URL`) take precedence
 * over the persisted config file.
 */
export function createApiConfig(): Configuration {
  const config = resolveConfig()
  const { token } = config

  if (token === null) {
    console.error('Not authenticated. Set GMA_TOKEN or run `gma auth login`.')

    return process.exit(1)
  }

  return new Configuration({
    accessToken: token,
    basePath: config.apiUrl,
  })
}
