<script lang="ts">
  import { Project } from '../../types'
  import { active, createProject, removeProject, projects } from '../app'
  import Button from '../components/Button.svelte'
  import ClampedText from '../components/ClampedText.svelte'
  import ContentArea from '../components/ContentArea.svelte'
  import Heading from '../components/Heading.svelte'
  import Input from '../components/Input.svelte'
  import List from '../components/List.svelte'
  import Main from '../components/Main.svelte'
  import RemoveButton from '../components/RemoveButton.svelte'
  import Section from '../components/Section.svelte'
  import Sticky from '../components/Sticky.svelte'
  import Title from '../components/Title.svelte'

  let newProjectName: string = ''

  let newProjectWarning: boolean = false

  let newProjectRef: HTMLInputElement

  function onClickCreateProject() {
    if (newProjectName === '') {
      newProjectWarning = true
      newProjectRef.focus()
    } else {
      createProject(newProjectName)
    }
  }

  function onClickRemoveProject(project: Project) {
    const msg = `Are you sure you want to delete the project "${project.name}"?`

    if (confirm(msg)) {
      removeProject(project)
    }
  }

  function onClickProject(project: Project) {
    active.update((store) => ({ ...store, project }))
  }
</script>

<Main>
  <Sticky>
    <Section>
      <Title />
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
      {#each Object.entries($projects) as [id, project]}
        <li on:click={() => onClickProject(project)}>
          <div class="name">
            <ClampedText text={project.name} />
          </div>
          <RemoveButton onClick={() => onClickRemoveProject(project)} />
        </li>
      {/each}
    </List>
  </ContentArea>
</Main>

<style>
  .name {
    display: flex;
    flex: 1 1 auto;
  }

  li:hover :global(.remove) {
    display: block;
  }
</style>
