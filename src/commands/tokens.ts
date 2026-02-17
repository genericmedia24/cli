import { Command } from 'commander'
import { createApiConfig } from '../client.js'
import { TokensClient } from '../openapi/apis/TokensClient.js'
import { handleError, printJson } from '../output.js'

/** Registers the `tokens` command group. */
export function tokensCommand(): Command {
  const tokens = new Command('tokens')
    .description('Manage API tokens')

  tokens
    .command('list')
    .description('List all tokens')
    .action(handleError(async () => {
      const client = new TokensClient(createApiConfig())
      const result = await client.listTokens()

      printJson(result)
    }))

  tokens
    .command('get')
    .description('Get a token by ID')
    .argument('<id>', 'Token ID')
    .action(handleError(async (id: string) => {
      const client = new TokensClient(createApiConfig())
      const result = await client.getToken(id)

      printJson(result)
    }))

  tokens
    .command('create')
    .description('Create a new API token')
    .requiredOption('--name <name>', 'Display name')
    .requiredOption('--scopes <scopes...>', 'Permission scopes (e.g. *:read users:write)')
    .option('--expires-at <date>', 'Expiry date (ISO 8601)')
    .action(handleError(async (_opts: unknown, cmd: Command) => {
      const opts = cmd.opts<{ expiresAt?: string
        name: string
        scopes: string[] }>()

      const client = new TokensClient(createApiConfig())

      const result = await client.createToken({
        expiresAt: opts.expiresAt !== undefined ? new Date(opts.expiresAt) : undefined,
        name: opts.name,
        scopes: opts.scopes,
      })

      printJson(result)
    }))

  tokens
    .command('update')
    .description('Update a token')
    .argument('<id>', 'Token ID')
    .option('--name <name>', 'Display name')
    .option('--scopes <scopes...>', 'Permission scopes')
    .option('--active', 'Activate the token')
    .option('--no-active', 'Deactivate the token')
    .action(handleError(async (id: string, _opts: unknown, cmd: Command) => {
      const opts = cmd.opts<{ active?: boolean
        name?: string
        scopes?: string[] }>()

      const client = new TokensClient(createApiConfig())

      const result = await client.updateToken(id, {
        active: opts.active,
        name: opts.name,
        scopes: opts.scopes,
      })

      printJson(result)
    }))

  tokens
    .command('delete')
    .description('Delete a token')
    .argument('<id>', 'Token ID')
    .action(handleError(async (id: string) => {
      const client = new TokensClient(createApiConfig())

      await client.deleteToken(id)
      console.log(`Token ${id} deleted.`)
    }))

  return tokens
}
