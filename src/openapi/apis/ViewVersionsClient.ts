import * as runtime from '../runtime.js'

/** Request body for {@link ViewVersionsClient.publishViewVersion}. */
export interface PublishViewVersionRequest {
  version: string
  widgets: Record<string, unknown>
}

/**
 * API client for view version endpoints.
 *
 * @see {@link https://github.com/genericmedia24/app} for the full API reference.
 */
export class ViewVersionsClient extends runtime.BaseAPI {
  /** Deletes a version of a view. */
  async deleteViewVersion(viewId: string, versionId: string, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
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
      path: `/views/${encodeURIComponent(viewId)}/versions/${encodeURIComponent(versionId)}`,
      query: {},
    }, initOverrides)

    await new runtime.VoidApiResponse(response).value()
  }

  /** Retrieves a single version of a view. */
  async getViewVersion(viewId: string, versionId: string, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Record<string, unknown>> {
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
      path: `/views/${encodeURIComponent(viewId)}/versions/${encodeURIComponent(versionId)}`,
      query: {},
    }, initOverrides)

    return new runtime.JSONApiResponse<Record<string, unknown>>(response).value()
  }

  /** Lists all versions of a view. */
  async listViewVersions(viewId: string, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Record<string, unknown>>> {
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
      path: `/views/${encodeURIComponent(viewId)}/versions`,
      query: {},
    }, initOverrides)

    return new runtime.JSONApiResponse<Array<Record<string, unknown>>>(response).value()
  }

  /** Publishes a new version of a view. */
  async publishViewVersion(viewId: string, body: PublishViewVersionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Record<string, unknown>> {
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
      path: `/views/${encodeURIComponent(viewId)}/versions`,
      query: {},
    }, initOverrides)

    return new runtime.JSONApiResponse<Record<string, unknown>>(response).value()
  }
}
