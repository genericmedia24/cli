import { Command } from 'commander'
import { createApiConfig } from '../client.js'
import { DatabaseInstallationsClient } from '../openapi/apis/DatabaseInstallationsClient.js'
import { DatabasesClient } from '../openapi/apis/DatabasesClient.js'
import { DatabaseVersionsClient } from '../openapi/apis/DatabaseVersionsClient.js'
import { handleError, printJson, readFileInput } from '../output.js'

/** Registers the `databases` command group. */
export function databasesCommand(): Command {
  const databases = new Command('databases')
    .alias('db')
    .description('Manage databases')

  databases
    .command('list')
    .description('List all databases')
    .action(handleError(async () => {
      const client = new DatabasesClient(createApiConfig())
      const result = await client.listDatabases()

      printJson(result)
    }))

  databases
    .command('get')
    .description('Get a database by ID')
    .argument('<id>', 'Database ID')
    .action(handleError(async (id: string) => {
      const client = new DatabasesClient(createApiConfig())
      const result = await client.getDatabase(id)

      printJson(result)
    }))

  databases
    .command('create')
    .description('Create a new database')
    .requiredOption('--name <name>', 'Display name')
    .requiredOption('--slug <slug>', 'URL-friendly identifier')
    .option('--description <description>', 'Description')
    .option('--public', 'Publicly visible to other organisations')
    .action(handleError(async (_opts: unknown, cmd: Command) => {
      const opts = cmd.opts<{ description?: string
        name: string
        public?: boolean
        slug: string }>()

      const client = new DatabasesClient(createApiConfig())

      const result = await client.createDatabase({
        _public: opts.public,
        description: opts.description,
        name: opts.name,
        slug: opts.slug,
      })

      printJson(result)
    }))

  databases
    .command('update')
    .description('Update a database')
    .argument('<id>', 'Database ID')
    .option('--name <name>', 'Display name')
    .option('--slug <slug>', 'URL-friendly identifier')
    .option('--description <description>', 'Description')
    .option('--public', 'Publicly visible')
    .option('--no-public', 'Not publicly visible')
    .action(handleError(async (id: string, _opts: unknown, cmd: Command) => {
      const opts = cmd.opts<{ description?: string
        name?: string
        public?: boolean
        slug?: string }>()

      const client = new DatabasesClient(createApiConfig())

      const result = await client.updateDatabase(id, {
        _public: opts.public,
        description: opts.description,
        name: opts.name,
        slug: opts.slug,
      })

      printJson(result)
    }))

  databases
    .command('delete')
    .description('Delete a database')
    .argument('<id>', 'Database ID')
    .action(handleError(async (id: string) => {
      const client = new DatabasesClient(createApiConfig())

      await client.deleteDatabase(id)
      console.log(`Database ${id} deleted.`)
    }))

  databases.addCommand(databaseInstallationsCommand())
  databases.addCommand(databaseVersionsCommand())

  return databases
}

/** Registers the `databases installations` subcommand group. */
function databaseInstallationsCommand(): Command {
  const installations = new Command('installations')
    .alias('i')
    .description('Manage database installations')

  installations
    .command('install')
    .description('Install a database version')
    .argument('<databaseId>', 'Database ID')
    .requiredOption('--alias <alias>', 'Installation alias')
    .requiredOption('--version-id <versionId>', 'Database version ID')
    .action(handleError(async (databaseId: string, _opts: unknown, cmd: Command) => {
      const opts = cmd.opts<{ alias: string
        versionId: string }>()

      const client = new DatabaseInstallationsClient(createApiConfig())

      const result = await client.installDatabase(databaseId, {
        alias: opts.alias,
        database_version_id: opts.versionId,
      })

      printJson(result)
    }))

  installations
    .command('list')
    .description('List all database installations')
    .action(handleError(async () => {
      const client = new DatabaseInstallationsClient(createApiConfig())
      const result = await client.listDatabaseInstallations()

      printJson(result)
    }))

  installations
    .command('get')
    .description('Get an installation by ID')
    .argument('<databaseId>', 'Database ID')
    .argument('<installationId>', 'Installation ID')
    .action(handleError(async (databaseId: string, installationId: string) => {
      const client = new DatabaseInstallationsClient(createApiConfig())
      const result = await client.getDatabaseInstallation(databaseId, installationId)

      printJson(result)
    }))

  installations
    .command('update')
    .description('Update an installation')
    .argument('<databaseId>', 'Database ID')
    .argument('<installationId>', 'Installation ID')
    .option('--alias <alias>', 'New alias')
    .option('--version-id <versionId>', 'New database version ID')
    .action(handleError(async (databaseId: string, installationId: string, _opts: unknown, cmd: Command) => {
      const opts = cmd.opts<{ alias?: string
        versionId?: string }>()

      const client = new DatabaseInstallationsClient(createApiConfig())

      const result = await client.updateDatabaseInstallation(databaseId, installationId, {
        alias: opts.alias,
        database_version_id: opts.versionId,
      })

      printJson(result)
    }))

  installations
    .command('uninstall')
    .description('Remove an installation')
    .argument('<databaseId>', 'Database ID')
    .argument('<installationId>', 'Installation ID')
    .action(handleError(async (databaseId: string, installationId: string) => {
      const client = new DatabaseInstallationsClient(createApiConfig())

      await client.uninstallDatabase(databaseId, installationId)
      console.log(`Installation ${installationId} removed.`)
    }))

  return installations
}

/** Registers the `databases versions` subcommand group. */
function databaseVersionsCommand(): Command {
  const versions = new Command('versions')
    .alias('v')
    .description('Manage database versions')

  versions
    .command('publish')
    .description('Publish a new version')
    .argument('<databaseId>', 'Database ID')
    .requiredOption('--version <version>', 'Semantic version string (e.g. "1.0.0")')
    .requiredOption('--ddl-up <ddlUp>', 'SQL migration to apply (prefix with @ to read from file, e.g. @./up.sql)')
    .requiredOption('--ddl-down <ddlDown>', 'SQL migration to revert (prefix with @ to read from file, e.g. @./down.sql)')
    .action(handleError(async (databaseId: string, _opts: unknown, cmd: Command) => {
      const opts = cmd.opts<{ ddlDown: string
        ddlUp: string
        version: string }>()

      const client = new DatabaseVersionsClient(createApiConfig())

      const result = await client.publishDatabaseVersion(databaseId, {
        ddl_down: readFileInput(opts.ddlDown),
        ddl_up: readFileInput(opts.ddlUp),
        version: opts.version,
      })

      printJson(result)
    }))

  versions
    .command('list')
    .description('List all versions of a database')
    .argument('<databaseId>', 'Database ID')
    .action(handleError(async (databaseId: string) => {
      const client = new DatabaseVersionsClient(createApiConfig())
      const result = await client.listDatabaseVersions(databaseId)

      printJson(result)
    }))

  versions
    .command('get')
    .description('Get a version by ID')
    .argument('<databaseId>', 'Database ID')
    .argument('<versionId>', 'Version ID')
    .action(handleError(async (databaseId: string, versionId: string) => {
      const client = new DatabaseVersionsClient(createApiConfig())
      const result = await client.getDatabaseVersion(databaseId, versionId)

      printJson(result)
    }))

  versions
    .command('delete')
    .description('Delete a version')
    .argument('<databaseId>', 'Database ID')
    .argument('<versionId>', 'Version ID')
    .action(handleError(async (databaseId: string, versionId: string) => {
      const client = new DatabaseVersionsClient(createApiConfig())

      await client.deleteDatabaseVersion(databaseId, versionId)
      console.log(`Version ${versionId} deleted.`)
    }))

  return versions
}
