import { astro } from '@kitae/compiler/drivers/astro'
import { exec } from 'child_process'
import { access, constants, mkdir, readdir, unlink, writeFile } from 'fs/promises'
import { join } from 'path'
import { WorkspaceData, WorkspaceDriver, WorkspaceDriverResult } from '../../types'
import { toJsxTagName } from '../../utils'
import { HtmlLayout } from './templates/HtmlLayout'

async function initWorkspace(path: string): Promise<boolean> {
  return new Promise((resolve) =>
    exec(
      `pnpm create astro@latest "${path}" --template minimal --typescript strict --no-git --no-install --skip-houston`,
      (error) => {
        if (error) {
          console.error(error)
          resolve(false)
        }
        resolve(true)
      }
    )
  )
}

async function compile(workspace: WorkspaceData): Promise<WorkspaceDriverResult> {
  const result: WorkspaceDriverResult = {
    components: {},
    pages: {}
  }
  workspace.components.forEach((component) => {
    const fileContent = astro(component, workspace, true)
    result.components[toJsxTagName(component.name)] = fileContent
  })
  workspace.pages.forEach((page) => {
    const fileContent = astro(page, workspace, false)
    result.pages[page.name.toLowerCase().replaceAll(' ', '-')] = fileContent
  })
  return Promise.resolve(result)
}

async function compileAndWritesFiles(
  path: string,
  workspace: WorkspaceData
): Promise<boolean | Error> {
  try {
    // Ensure the src, src/components and src/pages directories exist and create them if they don't
    await mkdir(join(path, 'src'), { recursive: true })
    await mkdir(join(path, 'src', 'components'), { recursive: true })
    await mkdir(join(path, 'src', 'layouts'), { recursive: true })
    // Create the html layout file if needed
    try {
      await access(join(path, 'src', 'layouts', 'HtmlLayout.astro'), constants.R_OK)
    } catch (error) {
      await writeFile(join(path, 'src', 'layouts', 'HtmlLayout.astro'), HtmlLayout)
    }
    await mkdir(join(path, 'src', 'pages'), { recursive: true })
    // Clean the src/components and src/pages directories
    for (const file of await readdir(join(path, 'src', 'components'))) {
      await unlink(join(path, 'src', 'components', file))
    }
    for (const file of await readdir(join(path, 'src', 'pages'))) {
      await unlink(join(path, 'src', 'pages', file))
    }
    // Compile the workspace data to files
    const compiledWorkspace = await compile(workspace)
    Object.entries(compiledWorkspace.components).forEach(async ([filename, content]) => {
      await writeFile(join(path, 'src', 'components', `${filename}.astro`), content)
    })
    Object.entries(compiledWorkspace.pages).forEach(async ([filename, content]) => {
      await writeFile(join(path, 'src', 'pages', `${filename}.astro`), content)
    })
    return true
  } catch (error) {
    return error as Error
  }
}

export default { compile, compileAndWritesFiles, initWorkspace } as WorkspaceDriver
