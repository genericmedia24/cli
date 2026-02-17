import { Command } from 'commander'
import { createApiConfig } from '../client.js'
import { UsersClient } from '../openapi/apis/UsersClient.js'
import { handleError, printJson } from '../output.js'

/** Registers the `users` command group. */
export function usersCommand(): Command {
  const users = new Command('users')
    .description('Manage users')

  users
    .command('list')
    .description('List all users')
    .action(handleError(async () => {
      const client = new UsersClient(createApiConfig())
      const result = await client.listUsers()

      printJson(result)
    }))

  users
    .command('get')
    .description('Get a user by ID')
    .argument('<id>', 'User ID')
    .action(handleError(async (id: string) => {
      const client = new UsersClient(createApiConfig())
      const result = await client.getUser(id)

      printJson(result)
    }))

  users
    .command('create')
    .description('Create a new user')
    .requiredOption('--email <email>', 'Email address')
    .requiredOption('--handle <handle>', 'Unique public handle')
    .requiredOption('--name <name>', 'Display name')
    .option('--password <password>', 'Password')
    .action(handleError(async (_opts: unknown, cmd: Command) => {
      const opts = cmd.opts<{ email: string
        handle: string
        name: string
        password?: string }>()

      const client = new UsersClient(createApiConfig())

      const result = await client.createUser({
        email: opts.email,
        handle: opts.handle,
        name: opts.name,
        password: opts.password,
      })

      printJson(result)
    }))

  users
    .command('update')
    .description('Update a user')
    .argument('<id>', 'User ID')
    .option('--email <email>', 'Email address')
    .option('--handle <handle>', 'Unique public handle')
    .option('--name <name>', 'Display name')
    .option('--password <password>', 'Password')
    .option('--locale <locale>', 'Locale')
    .option('--email-public', 'Make email public')
    .option('--no-email-public', 'Make email private')
    .option('--name-public', 'Make name public')
    .option('--no-name-public', 'Make name private')
    .action(handleError(async (id: string, _opts: unknown, cmd: Command) => {
      const opts = cmd.opts<{ email?: string
        emailPublic?: boolean
        handle?: string
        locale?: string
        name?: string
        namePublic?: boolean
        password?: string }>()

      const client = new UsersClient(createApiConfig())

      const result = await client.updateUser(id, {
        email: opts.email,
        emailPublic: opts.emailPublic,
        handle: opts.handle,
        locale: opts.locale,
        name: opts.name,
        namePublic: opts.namePublic,
        password: opts.password,
      })

      printJson(result)
    }))

  users
    .command('delete')
    .description('Delete a user')
    .argument('<id>', 'User ID')
    .action(handleError(async (id: string) => {
      const client = new UsersClient(createApiConfig())

      await client.deleteUser(id)
      console.log(`User ${id} deleted.`)
    }))

  return users
}
