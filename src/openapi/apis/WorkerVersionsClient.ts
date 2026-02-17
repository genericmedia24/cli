import * as runtime from '../runtime.js'

/** Request body for {@link WorkerVersionsClient.publishWorkerVersion}. */
export interface PublishWorkerVersionRequest {
  generator: string
  processor: string
  version: string
}

/**
 * API client for worker version endpoints.
 *
 * @see {@link https://github.com/genericmedia24/app} for the full API reference.
 */
export class WorkerVersionsClient extends runtime.BaseAPI {
  /** Deletes a version of a worker. */
  async deleteWorkerVersion(workerId: string, versionId: string, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
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
      path: `/workers/${encodeURIComponent(workerId)}/versions/${encodeURIComponent(versionId)}`,
      query: {},
    }, initOverrides)

    await new runtime.VoidApiResponse(response).value()
  }

  /** Retrieves a single version of a worker. */
  async getWorkerVersion(workerId: string, versionId: string, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Record<string, unknown>> {
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
      path: `/workers/${encodeURIComponent(workerId)}/versions/${encodeURIComponent(versionId)}`,
      query: {},
    }, initOverrides)

    return new runtime.JSONApiResponse<Record<string, unknown>>(response).value()
  }

  /** Lists all versions of a worker. */
  async listWorkerVersions(workerId: string, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Record<string, unknown>>> {
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
      path: `/workers/${encodeURIComponent(workerId)}/versions`,
      query: {},
    }, initOverrides)

    return new runtime.JSONApiResponse<Array<Record<string, unknown>>>(response).value()
  }

  /** Publishes a new version of a worker. */
  async publishWorkerVersion(workerId: string, body: PublishWorkerVersionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Record<string, unknown>> {
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
      path: `/workers/${encodeURIComponent(workerId)}/versions`,
      query: {},
    }, initOverrides)

    return new runtime.JSONApiResponse<Record<string, unknown>>(response).value()
  }
}
