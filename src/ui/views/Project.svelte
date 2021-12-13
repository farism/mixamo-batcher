<script lang="ts">
  import { Pack, Project } from '../../types'
  import { suffix } from '../app'
  import Breadcrumbs from '../components/Breadcrumbs.svelte'
  import Button from '../components/Button.svelte'
  import ClampedText from '../components/ClampedText.svelte'
  import ContentArea from '../components/ContentArea.svelte'
  import Heading from '../components/Heading.svelte'
  import Input from '../components/Input.svelte'
  import Italic from '../components/Italic.svelte'
  import List from '../components/List.svelte'
  import Main from '../components/Main.svelte'
  import Preferences from '../components/Preferences.svelte'
  import Section from '../components/Section.svelte'
  import Sticky from '../components/Sticky.svelte'
  import Title from '../components/Title.svelte'
  import { createPack, removeProject, selectPack } from '../projects'

  export let project: Project

  let newPackName: string = ''

  let newPackWarning: boolean = false

  let newPackRef: HTMLInputElement

  let showSettings: boolean = false

  function onClickToggleSettings() {
    showSettings = !showSettings
  }

  function onClickRemoveProject() {
    const msg = `Are you sure you want to delete the project "${project.name}"?`

    if (confirm(msg)) {
      removeProject(project)
    }
  }

  function onClickCreatePack() {
    if (newPackName === '') {
      newPackWarning = true
      newPackRef.focus()
    } else {
      createPack(project, newPackName)
    }
  }

  function onClickPack(pack: Pack) {
    selectPack(pack)
  }
</script>

<Main>
  <Sticky>
    <Section>
      <Title />
    </Section>
    <Section>
      <Breadcrumbs />
    </Section>
    <Section>
      <Button block on:click={onClickToggleSettings}>
        {showSettings ? 'Hide' : 'Show'} Project Settings
      </Button>
    </Section>
    {#if showSettings}
      <Section>
        <Heading>Project Name</Heading>
        <Input bind:value={project.name} />
      </Section>
      <Section>
        <Heading>Download Preferences</Heading>
        <div class="animation-settings">
          <Preferences
            showInplace
            bind:inplace={project.inplace}
            bind:preferences={project.preferences}
          />
        </div>
      </Section>
      <Section>
        <Button block warning on:click={onClickRemoveProject}>Delete Project</Button>
      </Section>
    {:else}
      <Section>
        <Input
          bind:ref={newPackRef}
          bind:value={newPackName}
          on:input={() => (newPackWarning = false)}
          warning={newPackWarning}
          placeholder="New Pack Name"
        />
        <Button block on:click={onClickCreatePack}>Create Pack</Button>
      </Section>
      <Section>
        <Heading>Packs</Heading>
      </Section>
    {/if}
  </Sticky>
  {#if !showSettings}
    <ContentArea>
      <List>
        {#each Object.entries(project.packs) as [id, pack]}
          <li on:click={() => onClickPack(pack)}>
            <div class="name">
              <ClampedText text={pack.name} />
              <Italic>{pack.products.length} Animation{suffix(pack.products)}</Italic>
            </div>
          </li>
        {/each}
      </List>
    </ContentArea>
  {/if}
</Main>

<style>
  li:hover :global(.remove) {
    display: block;
  }

  .name {
    flex: 1 1 auto;
  }

  .animation-settings {
    border: 0;
    padding: 10px 0 0 0;
    margin-left: 0;
    margin-right: 0;
  }
</style>
