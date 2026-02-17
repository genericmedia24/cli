import * as runtime from '../runtime.js'

/** Request body for {@link ViewInstallationsClient.installView}. */
export interface InstallViewRequest {
  alias: string
  view_version_id: string
}

/** Request body for {@link ViewInstallationsClient.updateViewInstallation}. */
export interface UpdateViewInstallationRequest {
  alias?: string
  view_version_id?: string
}

/**
 * API client for view installation endpoints.
 *
 * @see {@link https://github.com/genericmedia24/app} for the full API reference.
 */
export class ViewInstallationsClient extends runtime.BaseAPI {
  /** Retrieves a single view installation. */
  async getViewInstallation(viewId: string, installationId: string, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Record<string, unknown>> {
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
      path: `/views/${encodeURIComponent(viewId)}/installations/${encodeURIComponent(installationId)}`,
      query: {},
    }, initOverrides)

    return new runtime.JSONApiResponse<Record<string, unknown>>(response).value()
  }

  /** Installs a view version. */
  async installView(viewId: string, body: InstallViewRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Record<string, unknown>> {
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
      path: `/views/${encodeURIComponent(viewId)}/installations`,
      query: {},
    }, initOverrides)

    return new runtime.JSONApiResponse<Record<string, unknown>>(response).value()
  }

  /** Lists all view installations. */
  async listViewInstallations(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Record<string, unknown>>> {
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
      path: '/views/installations',
      query: {},
    }, initOverrides)

    return new runtime.JSONApiResponse<Array<Record<string, unknown>>>(response).value()
  }

  /** Removes a view installation. */
  async uninstallView(viewId: string, installationId: string, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
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
      path: `/views/${encodeURIComponent(viewId)}/installations/${encodeURIComponent(installationId)}`,
      query: {},
    }, initOverrides)

    await new runtime.VoidApiResponse(response).value()
  }

  /** Updates a view installation. */
  async updateViewInstallation(viewId: string, installationId: string, body: UpdateViewInstallationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Record<string, unknown>> {
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
      path: `/views/${encodeURIComponent(viewId)}/installations/${encodeURIComponent(installationId)}`,
      query: {},
    }, initOverrides)

    return new runtime.JSONApiResponse<Record<string, unknown>>(response).value()
  }
}
