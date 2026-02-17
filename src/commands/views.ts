import { Command } from 'commander'
import { createApiConfig } from '../client.js'
import { ViewInstallationsClient } from '../openapi/apis/ViewInstallationsClient.js'
import { ViewsClient } from '../openapi/apis/ViewsClient.js'
import { ViewVersionsClient } from '../openapi/apis/ViewVersionsClient.js'
import { handleError, printJson, readFileInput } from '../output.js'

/** Registers the `views` command group. */
export function viewsCommand(): Command {
  const views = new Command('views')
    .description('Manage views')

  views
    .command('list')
    .description('List all views')
    .action(handleError(async () => {
      const client = new ViewsClient(createApiConfig())
      const result = await client.listViews()

      printJson(result)
    }))

  views
    .command('get')
    .description('Get a view by ID')
    .argument('<id>', 'View ID')
    .action(handleError(async (id: string) => {
      const client = new ViewsClient(createApiConfig())
      const result = await client.getView(id)

      printJson(result)
    }))

  views
    .command('create')
    .description('Create a new view')
    .requiredOption('--name <name>', 'Display name')
    .requiredOption('--slug <slug>', 'URL-friendly identifier')
    .option('--description <description>', 'Description')
    .option('--public', 'Publicly visible')
    .action(handleError(async (_opts: unknown, cmd: Command) => {
      const opts = cmd.opts<{ description?: string
        name: string
        public?: boolean
        slug: string }>()

      const client = new ViewsClient(createApiConfig())

      const result = await client.createView({
        _public: opts.public,
        description: opts.description,
        name: opts.name,
        slug: opts.slug,
      })

      printJson(result)
    }))

  views
    .command('update')
    .description('Update a view')
    .argument('<id>', 'View ID')
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

      const client = new ViewsClient(createApiConfig())

      const result = await client.updateView(id, {
        _public: opts.public,
        description: opts.description,
        name: opts.name,
        slug: opts.slug,
      })

      printJson(result)
    }))

  views
    .command('delete')
    .description('Delete a view')
    .argument('<id>', 'View ID')
    .action(handleError(async (id: string) => {
      const client = new ViewsClient(createApiConfig())

      await client.deleteView(id)
      console.log(`View ${id} deleted.`)
    }))

  views.addCommand(viewInstallationsCommand())
  views.addCommand(viewVersionsCommand())

  return views
}

/** Registers the `views installations` subcommand group. */
function viewInstallationsCommand(): Command {
  const installations = new Command('installations')
    .alias('i')
    .description('Manage view installations')

  installations
    .command('install')
    .description('Install a view version')
    .argument('<viewId>', 'View ID')
    .requiredOption('--alias <alias>', 'Installation alias')
    .requiredOption('--version-id <versionId>', 'View version ID')
    .action(handleError(async (viewId: string, _opts: unknown, cmd: Command) => {
      const opts = cmd.opts<{ alias: string
        versionId: string }>()

      const client = new ViewInstallationsClient(createApiConfig())

      const result = await client.installView(viewId, {
        alias: opts.alias,
        view_version_id: opts.versionId,
      })

      printJson(result)
    }))

  installations
    .command('list')
    .description('List all view installations')
    .action(handleError(async () => {
      const client = new ViewInstallationsClient(createApiConfig())
      const result = await client.listViewInstallations()

      printJson(result)
    }))

  installations
    .command('get')
    .description('Get an installation by ID')
    .argument('<viewId>', 'View ID')
    .argument('<installationId>', 'Installation ID')
    .action(handleError(async (viewId: string, installationId: string) => {
      const client = new ViewInstallationsClient(createApiConfig())
      const result = await client.getViewInstallation(viewId, installationId)

      printJson(result)
    }))

  installations
    .command('update')
    .description('Update an installation')
    .argument('<viewId>', 'View ID')
    .argument('<installationId>', 'Installation ID')
    .option('--alias <alias>', 'New alias')
    .option('--version-id <versionId>', 'New view version ID')
    .action(handleError(async (viewId: string, installationId: string, _opts: unknown, cmd: Command) => {
      const opts = cmd.opts<{ alias?: string
        versionId?: string }>()

      const client = new ViewInstallationsClient(createApiConfig())

      const result = await client.updateViewInstallation(viewId, installationId, {
        alias: opts.alias,
        view_version_id: opts.versionId,
      })

      printJson(result)
    }))

  installations
    .command('uninstall')
    .description('Remove an installation')
    .argument('<viewId>', 'View ID')
    .argument('<installationId>', 'Installation ID')
    .action(handleError(async (viewId: string, installationId: string) => {
      const client = new ViewInstallationsClient(createApiConfig())

      await client.uninstallView(viewId, installationId)
      console.log(`Installation ${installationId} removed.`)
    }))

  return installations
}

/** Registers the `views versions` subcommand group. */
function viewVersionsCommand(): Command {
  const versions = new Command('versions')
    .alias('v')
    .description('Manage view versions')

  versions
    .command('publish')
    .description('Publish a new version')
    .argument('<viewId>', 'View ID')
    .requiredOption('--version <version>', 'Semantic version string (e.g. "1.0.0")')
    .requiredOption('--widgets <widgets>', 'Widget configuration as JSON (prefix with @ to read from file, e.g. @./widgets.json)')
    .action(handleError(async (viewId: string, _opts: unknown, cmd: Command) => {
      const opts = cmd.opts<{ version: string
        widgets: string }>()

      const client = new ViewVersionsClient(createApiConfig())

      const result = await client.publishViewVersion(viewId, {
        version: opts.version,
        widgets: JSON.parse(readFileInput(opts.widgets)) as Record<string, unknown>,
      })

      printJson(result)
    }))

  versions
    .command('list')
    .description('List all versions of a view')
    .argument('<viewId>', 'View ID')
    .action(handleError(async (viewId: string) => {
      const client = new ViewVersionsClient(createApiConfig())
      const result = await client.listViewVersions(viewId)

      printJson(result)
    }))

  versions
    .command('get')
    .description('Get a version by ID')
    .argument('<viewId>', 'View ID')
    .argument('<versionId>', 'Version ID')
    .action(handleError(async (viewId: string, versionId: string) => {
      const client = new ViewVersionsClient(createApiConfig())
      const result = await client.getViewVersion(viewId, versionId)

      printJson(result)
    }))

  versions
    .command('delete')
    .description('Delete a version')
    .argument('<viewId>', 'View ID')
    .argument('<versionId>', 'Version ID')
    .action(handleError(async (viewId: string, versionId: string) => {
      const client = new ViewVersionsClient(createApiConfig())

      await client.deleteViewVersion(viewId, versionId)
      console.log(`Version ${versionId} deleted.`)
    }))

  return versions
}
