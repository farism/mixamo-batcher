<script lang="ts">
  import { Project } from '../../types'
  import { active, exportData, importData, suffix } from '../app'
  import Button from '../components/Button.svelte'
  import ClampedText from '../components/ClampedText.svelte'
  import ContentArea from '../components/ContentArea.svelte'
  import Heading from '../components/Heading.svelte'
  import Input from '../components/Input.svelte'
  import Italic from '../components/Italic.svelte'
  import List from '../components/List.svelte'
  import Main from '../components/Main.svelte'
  import Section from '../components/Section.svelte'
  import Sticky from '../components/Sticky.svelte'
  import Title from '../components/Title.svelte'
  import { createProject, projects } from '../projects'

  const store = projects.store

  let importRef: HTMLInputElement

  let newProjectName: string = ''

  let newProjectWarning: boolean = false

  let newProjectRef: HTMLInputElement

  function onClickImport() {
    importRef.click()
  }

  function onClickExport() {
    exportData()
  }

  function onChangeImportFile(e: Event) {
    importData(importRef.files?.[0])
  }

  function onClickCreateProject() {
    if (newProjectName === '') {
      newProjectWarning = true
      newProjectRef.focus()
    } else {
      createProject(newProjectName)
    }
  }

  function onClickProject({ id }: Project) {
    active.update((s) => ({ ...s, projectId: id }))
  }
</script>

<Main>
  <Sticky>
    <Section>
      <Title />
    </Section>
    <Section>
      <Button block on:click={onClickImport}>Import</Button>
      <Button block on:click={onClickExport}>Export</Button>
      <input
        type="file"
        accept="application/json"
        class="import"
        bind:this={importRef}
        on:change={onChangeImportFile}
      />
    </Section>
    <Section>
      <Input
        bind:ref={newProjectRef}
        bind:value={newProjectName}
        on:input={() => (newProjectWarning = false)}
        warning={newProjectWarning}
        placeholder="New Project Name"
      />
      <Button block on:click={onClickCreateProject}>Create Project</Button>
    </Section>
    <Section>
      <Heading>Projects</Heading>
    </Section>
  </Sticky>
  <ContentArea>
    <List>
      {#each Object.entries($store) as [id, project]}
        <li on:click={() => onClickProject(project)}>
          <div class="name">
            <ClampedText text={project.name} />
            <Italic>{Object.keys(project.packs).length} Pack{suffix(project.packs)}</Italic>
          </div>
        </li>
      {/each}
    </List>
  </ContentArea>
</Main>

<style>
  .name {
    flex: 1 1 auto;
  }

  li:hover :global(.remove) {
    display: block;
  }

  .import {
    height: 0;
    margin: 0;
    padding: 0;
    pointer-events: none;
    position: absolute;
    visibility: hidden;
    width: 0;
  }
</style>
