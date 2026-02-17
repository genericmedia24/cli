import { Command } from 'commander'
import { createApiConfig } from '../client.js'
import { WorkerInstallationsClient } from '../openapi/apis/WorkerInstallationsClient.js'
import { WorkersClient } from '../openapi/apis/WorkersClient.js'
import { WorkerVersionsClient } from '../openapi/apis/WorkerVersionsClient.js'
import { handleError, printJson, readFileInput } from '../output.js'

/** Registers the `workers` command group. */
export function workersCommand(): Command {
  const workers = new Command('workers')
    .description('Manage workers')

  workers
    .command('list')
    .description('List all workers')
    .action(handleError(async () => {
      const client = new WorkersClient(createApiConfig())
      const result = await client.listWorkers()

      printJson(result)
    }))

  workers
    .command('get')
    .description('Get a worker by ID')
    .argument('<id>', 'Worker ID')
    .action(handleError(async (id: string) => {
      const client = new WorkersClient(createApiConfig())
      const result = await client.getWorker(id)

      printJson(result)
    }))

  workers
    .command('create')
    .description('Create a new worker')
    .requiredOption('--name <name>', 'Display name')
    .requiredOption('--slug <slug>', 'URL-friendly identifier')
    .option('--description <description>', 'Description')
    .option('--public', 'Publicly visible')
    .action(handleError(async (_opts: unknown, cmd: Command) => {
      const opts = cmd.opts<{ description?: string
        name: string
        public?: boolean
        slug: string }>()

      const client = new WorkersClient(createApiConfig())

      const result = await client.createWorker({
        _public: opts.public,
        description: opts.description,
        name: opts.name,
        slug: opts.slug,
      })

      printJson(result)
    }))

  workers
    .command('update')
    .description('Update a worker')
    .argument('<id>', 'Worker ID')
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

      const client = new WorkersClient(createApiConfig())

      const result = await client.updateWorker(id, {
        _public: opts.public,
        description: opts.description,
        name: opts.name,
        slug: opts.slug,
      })

      printJson(result)
    }))

  workers
    .command('delete')
    .description('Delete a worker')
    .argument('<id>', 'Worker ID')
    .action(handleError(async (id: string) => {
      const client = new WorkersClient(createApiConfig())

      await client.deleteWorker(id)
      console.log(`Worker ${id} deleted.`)
    }))

  workers.addCommand(workerInstallationsCommand())
  workers.addCommand(workerVersionsCommand())

  return workers
}

/** Registers the `workers installations` subcommand group. */
function workerInstallationsCommand(): Command {
  const installations = new Command('installations')
    .alias('i')
    .description('Manage worker installations')

  installations
    .command('install')
    .description('Install a worker version')
    .argument('<workerId>', 'Worker ID')
    .requiredOption('--alias <alias>', 'Installation alias')
    .requiredOption('--version-id <versionId>', 'Worker version ID')
    .action(handleError(async (workerId: string, _opts: unknown, cmd: Command) => {
      const opts = cmd.opts<{ alias: string
        versionId: string }>()

      const client = new WorkerInstallationsClient(createApiConfig())

      const result = await client.installWorker(workerId, {
        alias: opts.alias,
        worker_version_id: opts.versionId,
      })

      printJson(result)
    }))

  installations
    .command('list')
    .description('List all worker installations')
    .action(handleError(async () => {
      const client = new WorkerInstallationsClient(createApiConfig())
      const result = await client.listWorkerInstallations()

      printJson(result)
    }))

  installations
    .command('get')
    .description('Get an installation by ID')
    .argument('<workerId>', 'Worker ID')
    .argument('<installationId>', 'Installation ID')
    .action(handleError(async (workerId: string, installationId: string) => {
      const client = new WorkerInstallationsClient(createApiConfig())
      const result = await client.getWorkerInstallation(workerId, installationId)

      printJson(result)
    }))

  installations
    .command('update')
    .description('Update an installation')
    .argument('<workerId>', 'Worker ID')
    .argument('<installationId>', 'Installation ID')
    .option('--alias <alias>', 'New alias')
    .option('--version-id <versionId>', 'New worker version ID')
    .action(handleError(async (workerId: string, installationId: string, _opts: unknown, cmd: Command) => {
      const opts = cmd.opts<{ alias?: string
        versionId?: string }>()

      const client = new WorkerInstallationsClient(createApiConfig())

      const result = await client.updateWorkerInstallation(workerId, installationId, {
        alias: opts.alias,
        worker_version_id: opts.versionId,
      })

      printJson(result)
    }))

  installations
    .command('uninstall')
    .description('Remove an installation')
    .argument('<workerId>', 'Worker ID')
    .argument('<installationId>', 'Installation ID')
    .action(handleError(async (workerId: string, installationId: string) => {
      const client = new WorkerInstallationsClient(createApiConfig())

      await client.uninstallWorker(workerId, installationId)
      console.log(`Installation ${installationId} removed.`)
    }))

  return installations
}

/** Registers the `workers versions` subcommand group. */
function workerVersionsCommand(): Command {
  const versions = new Command('versions')
    .alias('v')
    .description('Manage worker versions')

  versions
    .command('publish')
    .description('Publish a new version')
    .argument('<workerId>', 'Worker ID')
    .requiredOption('--version <version>', 'Semantic version string (e.g. "1.0.0")')
    .requiredOption('--generator <generator>', 'Generator source code (prefix with @ to read from file, e.g. @./gen.js)')
    .requiredOption('--processor <processor>', 'Processor source code (prefix with @ to read from file, e.g. @./proc.js)')
    .action(handleError(async (workerId: string, _opts: unknown, cmd: Command) => {
      const opts = cmd.opts<{ generator: string
        processor: string
        version: string }>()

      const client = new WorkerVersionsClient(createApiConfig())

      const result = await client.publishWorkerVersion(workerId, {
        generator: readFileInput(opts.generator),
        processor: readFileInput(opts.processor),
        version: opts.version,
      })

      printJson(result)
    }))

  versions
    .command('list')
    .description('List all versions of a worker')
    .argument('<workerId>', 'Worker ID')
    .action(handleError(async (workerId: string) => {
      const client = new WorkerVersionsClient(createApiConfig())
      const result = await client.listWorkerVersions(workerId)

      printJson(result)
    }))

  versions
    .command('get')
    .description('Get a version by ID')
    .argument('<workerId>', 'Worker ID')
    .argument('<versionId>', 'Version ID')
    .action(handleError(async (workerId: string, versionId: string) => {
      const client = new WorkerVersionsClient(createApiConfig())
      const result = await client.getWorkerVersion(workerId, versionId)

      printJson(result)
    }))

  versions
    .command('delete')
    .description('Delete a version')
    .argument('<workerId>', 'Worker ID')
    .argument('<versionId>', 'Version ID')
    .action(handleError(async (workerId: string, versionId: string) => {
      const client = new WorkerVersionsClient(createApiConfig())

      await client.deleteWorkerVersion(workerId, versionId)
      console.log(`Version ${versionId} deleted.`)
    }))

  return versions
}
