import * as core from '@actions/core'
import {upload} from './net'

async function run(): Promise<void> {
  try {
    const apiKey = core.getInput('api-key')
    if (!apiKey) {
      throw new Error('api-key is required')
    }

    const workspacePath = core.getInput('workspace-path')

    if (!workspacePath) {
      throw new Error('workspace-path is required')
    }

    const resourceId = core.getInput('resource-id')
    if (!resourceId) {
      throw new Error('resource-id is required')
    }

    const resourceType = core.getInput('resource-type')
    if (!resourceType) {
      throw new Error('resource-type is required')
    }
    const availableResourceTypes = ['project, product, environment, kb']
    if (!availableResourceTypes.includes(resourceType)) {
      throw new Error(
        `resource-type must be one of ${availableResourceTypes.join(', ')}`
      )
    }

    const artefactScope = core.getInput('artefact-scope') || 'inherit'
    if (!artefactScope) {
      throw new Error('artefact-scope is required')
    }

    const availableArtefactScopes = ['inherit', 'internal', 'public']
    if (!availableArtefactScopes.includes(artefactScope)) {
      throw new Error(
        `artefact-scope must be one of ${availableArtefactScopes.join(', ')}`
      )
    }

    const artefactPath = core.getInput('artefact-path')
    if (!artefactPath) {
      throw new Error('artefact-path is required')
    }

    const relisoUrl = core.getInput('relisio-url')
    if (!relisoUrl) {
      throw new Error('relisio-url is required')
    }

    const {artefactId, sha256} = await upload()

    const publicUrl = `${relisoUrl}/api/v1/artefacts/${artefactId}/download`
    const sha256Url = `${relisoUrl}/api/v1/artefacts/${artefactId}/sha256`

    // const url = `${relisoUrl}/api/v1/workspaces/${workspacePath}/${resourceType}s`

    core.setOutput('artefact-id', artefactId)
    core.setOutput('artefact-sha256', sha256)
    core.setOutput('public-url', publicUrl)
    core.setOutput('sha256-url', sha256Url)
  } catch (error) {
    core.debug(`Deployment Failed with Error: ${error}`)
    core.setFailed(`Deployment Failed with Error: ${error}`)
  }
}

run()
