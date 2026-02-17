#!/usr/bin/env node

import { Command } from 'commander'
import { authCommand } from './commands/auth.js'
import { databasesCommand } from './commands/databases.js'
import { membershipsCommand } from './commands/memberships.js'
import { organisationsCommand } from './commands/organisations.js'
import { resourcesCommand } from './commands/resources.js'
import { tokensCommand } from './commands/tokens.js'
import { usersCommand } from './commands/users.js'
import { viewsCommand } from './commands/views.js'
import { workersCommand } from './commands/workers.js'

const program = new Command()

program
  .name('gma')
  .description('CLI for the GenericMedia App')
  .version('1.0.0')

program.addCommand(authCommand())
program.addCommand(databasesCommand())
program.addCommand(membershipsCommand())
program.addCommand(organisationsCommand())
program.addCommand(resourcesCommand())
program.addCommand(tokensCommand())
program.addCommand(usersCommand())
program.addCommand(viewsCommand())
program.addCommand(workersCommand())
program.parse()
