import * as runtime from '../runtime.js'

/** Request body for {@link DatabaseInstallationsClient.installDatabase}. */
export interface InstallDatabaseRequest {
  alias: string
  database_version_id: string
}

/** Request body for {@link DatabaseInstallationsClient.updateDatabaseInstallation}. */
export interface UpdateDatabaseInstallationRequest {
  alias?: string
  database_version_id?: string
}

/**
 * API client for database installation endpoints.
 *
 * @see {@link https://github.com/genericmedia24/app} for the full API reference.
 */
export class DatabaseInstallationsClient extends runtime.BaseAPI {
  /** Retrieves a single database installation. */
  async getDatabaseInstallation(databaseId: string, installationId: string, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Record<string, unknown>> {
    const headerParameters: runtime.HTTPHeaders = {}

    if (this.configuration.accessToken) {
      const token = this.configuration.accessToken
      const tokenString = await token('token', [])

      if (tokenString) {
        headerParameters['Authorization'] = `Bearer ${tokenString}`
      }
    }

    const response = await this.request({
      headers: headerParameters,
      method: 'GET',
      path: `/databases/${encodeURIComponent(databaseId)}/installations/${encodeURIComponent(installationId)}`,
      query: {},
    }, initOverrides)

    return new runtime.JSONApiResponse<Record<string, unknown>>(response).value()
  }

  /** Installs a database version. */
  async installDatabase(databaseId: string, body: InstallDatabaseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Record<string, unknown>> {
    const headerParameters: runtime.HTTPHeaders = {}

    headerParameters['Content-Type'] = 'application/json'

    if (this.configuration.accessToken) {
      const token = this.configuration.accessToken
      const tokenString = await token('token', [])

      if (tokenString) {
        headerParameters['Authorization'] = `Bearer ${tokenString}`
      }
    }

    const response = await this.request({
      body,
      headers: headerParameters,
      method: 'POST',
      path: `/databases/${encodeURIComponent(databaseId)}/installations`,
      query: {},
    }, initOverrides)

    return new runtime.JSONApiResponse<Record<string, unknown>>(response).value()
  }

  /** Lists all database installations. */
  async listDatabaseInstallations(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Record<string, unknown>>> {
    const headerParameters: runtime.HTTPHeaders = {}

    if (this.configuration.accessToken) {
      const token = this.configuration.accessToken
      const tokenString = await token('token', [])

      if (tokenString) {
        headerParameters['Authorization'] = `Bearer ${tokenString}`
      }
    }

    const response = await this.request({
      headers: headerParameters,
      method: 'GET',
      path: '/databases/installations',
      query: {},
    }, initOverrides)

    return new runtime.JSONApiResponse<Array<Record<string, unknown>>>(response).value()
  }

  /** Removes a database installation. */
  async uninstallDatabase(databaseId: string, installationId: string, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
    const headerParameters: runtime.HTTPHeaders = {}

    if (this.configuration.accessToken) {
      const token = this.configuration.accessToken
      const tokenString = await token('token', [])

      if (tokenString) {
        headerParameters['Authorization'] = `Bearer ${tokenString}`
      }
    }

    const response = await this.request({
      headers: headerParameters,
      method: 'DELETE',
      path: `/databases/${encodeURIComponent(databaseId)}/installations/${encodeURIComponent(installationId)}`,
      query: {},
    }, initOverrides)

    await new runtime.VoidApiResponse(response).value()
  }

  /** Updates a database installation. */
  async updateDatabaseInstallation(databaseId: string, installationId: string, body: UpdateDatabaseInstallationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Record<string, unknown>> {
    const headerParameters: runtime.HTTPHeaders = {}

    headerParameters['Content-Type'] = 'application/json'

    if (this.configuration.accessToken) {
      const token = this.configuration.accessToken
      const tokenString = await token('token', [])

      if (tokenString) {
        headerParameters['Authorization'] = `Bearer ${tokenString}`
      }
    }

    const response = await this.request({
      body,
      headers: headerParameters,
      method: 'PATCH',
      path: `/databases/${encodeURIComponent(databaseId)}/installations/${encodeURIComponent(installationId)}`,
      query: {},
    }, initOverrides)

    return new runtime.JSONApiResponse<Record<string, unknown>>(response).value()
  }
}
