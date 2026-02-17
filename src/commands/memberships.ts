import { Command } from 'commander'
import { createApiConfig } from '../client.js'
import { MembershipsClient } from '../openapi/apis/MembershipsClient.js'
import { handleError, printJson } from '../output.js'

/** Registers the `memberships` command group. */
export function membershipsCommand(): Command {
  const memberships = new Command('memberships')
    .description('Manage memberships')

  memberships
    .command('list')
    .description('List all memberships')
    .action(handleError(async () => {
      const client = new MembershipsClient(createApiConfig())
      const result = await client.listMemberships()

      printJson(result)
    }))

  memberships
    .command('get')
    .description('Get a membership by ID')
    .argument('<id>', 'Membership ID')
    .action(handleError(async (id: string) => {
      const client = new MembershipsClient(createApiConfig())
      const result = await client.getMembership(id)

      printJson(result)
    }))

  memberships
    .command('create')
    .description('Create a new membership')
    .requiredOption('--user-id <userId>', 'User ID')
    .requiredOption('--scopes <scopes...>', 'Permission scopes')
    .action(handleError(async (_opts: unknown, cmd: Command) => {
      const opts = cmd.opts<{ scopes: string[]
        userId: string }>()

      const client = new MembershipsClient(createApiConfig())

      const result = await client.createMembership({
        scopes: opts.scopes,
        userId: opts.userId,
      })

      printJson(result)
    }))

  memberships
    .command('update')
    .description('Update a membership')
    .argument('<id>', 'Membership ID')
    .option('--scopes <scopes...>', 'Permission scopes')
    .action(handleError(async (id: string, _opts: unknown, cmd: Command) => {
      const opts = cmd.opts<{ scopes?: string[] }>()
      const client = new MembershipsClient(createApiConfig())

      const result = await client.updateMembership(id, {
        scopes: opts.scopes,
      })

      printJson(result)
    }))

  memberships
    .command('delete')
    .description('Delete a membership')
    .argument('<id>', 'Membership ID')
    .action(handleError(async (id: string) => {
      const client = new MembershipsClient(createApiConfig())

      await client.deleteMembership(id)
      console.log(`Membership ${id} deleted.`)
    }))

  return memberships
}
