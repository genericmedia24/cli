import { Command } from 'commander'
import { createApiConfig } from '../client.js'
import { OrganisationsClient } from '../openapi/apis/OrganisationsClient.js'
import { handleError, printJson } from '../output.js'

/** Registers the `organisations` command group. */
export function organisationsCommand(): Command {
  const organisations = new Command('organisations')
    .alias('orgs')
    .description('Manage organisations')

  organisations
    .command('list')
    .description('List all organisations')
    .action(handleError(async () => {
      const client = new OrganisationsClient(createApiConfig())
      const result = await client.listOrganisations()

      printJson(result)
    }))

  organisations
    .command('get')
    .description('Get an organisation by ID')
    .argument('<id>', 'Organisation ID')
    .action(handleError(async (id: string) => {
      const client = new OrganisationsClient(createApiConfig())
      const result = await client.getOrganisation(id)

      printJson(result)
    }))

  organisations
    .command('create')
    .description('Create a new organisation')
    .requiredOption('--name <name>', 'Display name')
    .requiredOption('--slug <slug>', 'URL-friendly identifier')
    .option('--public', 'Publicly visible')
    .action(handleError(async (_opts: unknown, cmd: Command) => {
      const opts = cmd.opts<{ name: string
        public?: boolean
        slug: string }>()

      const client = new OrganisationsClient(createApiConfig())

      const result = await client.createOrganisation({
        _public: opts.public,
        name: opts.name,
        slug: opts.slug,
      })

      printJson(result)
    }))

  organisations
    .command('update')
    .description('Update an organisation')
    .argument('<id>', 'Organisation ID')
    .option('--name <name>', 'Display name')
    .option('--slug <slug>', 'URL-friendly identifier')
    .option('--public', 'Publicly visible')
    .option('--no-public', 'Not publicly visible')
    .action(handleError(async (id: string, _opts: unknown, cmd: Command) => {
      const opts = cmd.opts<{ name?: string
        public?: boolean
        slug?: string }>()

      const client = new OrganisationsClient(createApiConfig())

      const result = await client.updateOrganisation(id, {
        _public: opts.public,
        name: opts.name,
        slug: opts.slug,
      })

      printJson(result)
    }))

  organisations
    .command('delete')
    .description('Delete an organisation')
    .argument('<id>', 'Organisation ID')
    .action(handleError(async (id: string) => {
      const client = new OrganisationsClient(createApiConfig())

      await client.deleteOrganisation(id)
      console.log(`Organisation ${id} deleted.`)
    }))

  return organisations
}
