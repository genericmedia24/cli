import * as runtime from '../runtime.js'

/** Request body for {@link DatabaseVersionsClient.publishDatabaseVersion}. */
export interface PublishDatabaseVersionRequest {
  ddl_down: string
  ddl_up: string
  version: string
}

/**
 * API client for database version endpoints.
 *
 * @see {@link https://github.com/genericmedia24/app} for the full API reference.
 */
export class DatabaseVersionsClient extends runtime.BaseAPI {
  /** Deletes a version of a database. */
  async deleteDatabaseVersion(databaseId: string, versionId: string, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
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
      path: `/databases/${encodeURIComponent(databaseId)}/versions/${encodeURIComponent(versionId)}`,
      query: {},
    }, initOverrides)

    await new runtime.VoidApiResponse(response).value()
  }

  /** Retrieves a single version of a database. */
  async getDatabaseVersion(databaseId: string, versionId: string, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Record<string, unknown>> {
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
      path: `/databases/${encodeURIComponent(databaseId)}/versions/${encodeURIComponent(versionId)}`,
      query: {},
    }, initOverrides)

    return new runtime.JSONApiResponse<Record<string, unknown>>(response).value()
  }

  /** Lists all versions of a database. */
  async listDatabaseVersions(databaseId: string, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Record<string, unknown>>> {
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
      path: `/databases/${encodeURIComponent(databaseId)}/versions`,
      query: {},
    }, initOverrides)

    return new runtime.JSONApiResponse<Array<Record<string, unknown>>>(response).value()
  }

  /** Publishes a new version of a database. */
  async publishDatabaseVersion(databaseId: string, body: PublishDatabaseVersionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Record<string, unknown>> {
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
      path: `/databases/${encodeURIComponent(databaseId)}/versions`,
      query: {},
    }, initOverrides)

    return new runtime.JSONApiResponse<Record<string, unknown>>(response).value()
  }
}
