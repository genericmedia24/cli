import { Command } from 'commander'
import { loadConfig, resolveConfig, saveConfig } from '../config.js'
import { handleError, printJson } from '../output.js'

/** Registers the `auth` command group. */
export function authCommand(): Command {
  const auth = new Command('auth')
    .description('Authenticate with the API')

  auth
    .command('login')
    .description('Save an API token to the config file')
    .option('--token <token>', 'API bearer token (prefer GMA_TOKEN env var)')
    .option('--api-url <url>', 'API base URL (prefer GMA_API_URL env var)')
    .action(handleError((_opts: unknown, cmd: Command) => {
      const opts = cmd.opts<{ apiUrl?: string
        token?: string }>()

      if (opts.token === undefined) {
        console.error('Provide a token via --token or the GMA_TOKEN environment variable.')

        return process.exit(1)
      }

      saveConfig({
        ...(opts.apiUrl !== undefined
          ? {
              apiUrl: opts.apiUrl,
            }
          : {}),
        token: opts.token,
      })

      console.log('Authentication saved.')
    }))

  auth
    .command('logout')
    .description('Remove stored credentials')
    .action(handleError(() => {
      saveConfig({
        token: null,
      })

      console.log('Logged out.')
    }))

  auth
    .command('status')
    .description('Show current authentication status')
    .action(handleError(() => {
      const file = loadConfig()
      const resolved = resolveConfig()
      const fromEnv = process.env['GMA_TOKEN'] !== undefined

      printJson({
        apiUrl: resolved.apiUrl,
        authenticated: resolved.token !== null,
        ...(fromEnv
          ? {
              source: 'environment',
            }
          : {}),
        ...(file.token !== null && fromEnv
          ? {
              configFileAlsoSet: true,
            }
          : {}),
      })
    }))

  return auth
}
