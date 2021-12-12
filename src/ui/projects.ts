import { nanoid } from 'nanoid'
import { Project } from '../types'
import { active } from './app'
import { defaultDownload } from './constants'
import { createStore } from './store'

export const projects = createStore<Project>('projects')

export function createProject(name: string) {
  const project: Project = {
    id: nanoid(),
    name,
    inplace: false,
    download: defaultDownload()
  }

  projects.set(project)

  active.update((s) => ({ ...s, projectId: project.id }))
}

export function removeProject(project: Project) {
  active.update(s => ({ ...s, projectId: null, editProject: false }))
  
  projects.clear(project)
}
