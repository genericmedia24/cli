import { Command } from 'commander'
import { createApiConfig } from '../client.js'
import { ResourcesClient } from '../openapi/apis/ResourcesClient.js'
import { handleError, printJson } from '../output.js'

/** Registers the `resources` command group. */
export function resourcesCommand(): Command {
  const resources = new Command('resources')
    .alias('res')
    .description('Manage resources')

  resources
    .command('list')
    .description('List all resources')
    .action(handleError(async () => {
      const client = new ResourcesClient(createApiConfig())
      const result = await client.listResources()

      printJson(result)
    }))

  resources
    .command('get')
    .description('Get a resource by ID')
    .argument('<id>', 'Resource ID')
    .action(handleError(async (id: string) => {
      const client = new ResourcesClient(createApiConfig())
      const result = await client.getResource(id)

      printJson(result)
    }))

  resources
    .command('create')
    .description('Create a new resource')
    .requiredOption('--name <name>', 'Display name')
    .requiredOption('--type <type>', 'Resource type (postgres, s3, smtp)')
    .requiredOption('--config <json>', 'Configuration as JSON string')
    .action(handleError(async (_opts: unknown, cmd: Command) => {
      const opts = cmd.opts<{ config: string
        name: string
        type: string }>()

      const client = new ResourcesClient(createApiConfig())

      const result = await client.createResource({
        config: JSON.parse(opts.config) as Record<string, unknown>,
        name: opts.name,
        type: opts.type as 'postgres' | 's3' | 'smtp',
      })

      printJson(result)
    }))

  resources
    .command('update')
    .description('Update a resource')
    .argument('<id>', 'Resource ID')
    .option('--name <name>', 'Display name')
    .option('--type <type>', 'Resource type (postgres, s3, smtp)')
    .option('--config <json>', 'Configuration as JSON string')
    .action(handleError(async (id: string, _opts: unknown, cmd: Command) => {
      const opts = cmd.opts<{ config?: string
        name?: string
        type?: string }>()

      const client = new ResourcesClient(createApiConfig())

      const result = await client.updateResource(id, {
        config: opts.config !== undefined ? JSON.parse(opts.config) as Record<string, unknown> : undefined,
        name: opts.name,
        type: opts.type as 'postgres' | 's3' | 'smtp' | undefined,
      })

      printJson(result)
    }))

  resources
    .command('delete')
    .description('Delete a resource')
    .argument('<id>', 'Resource ID')
    .action(handleError(async (id: string) => {
      const client = new ResourcesClient(createApiConfig())

      await client.deleteResource(id)
      console.log(`Resource ${id} deleted.`)
    }))

  return resources
}
