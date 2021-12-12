<script lang="ts">
  import { derived } from 'svelte/store'
  import { Pack } from '../../types'
  import { active } from '../app'
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
  import { createPack, packs, selectPack } from '../packs'
  import { projects, removeProject } from '../projects'

  let newPackName: string = ''

  let newPackWarning: boolean = false

  let newPackRef: HTMLInputElement

  let showSettings: boolean = false

  const store = projects.store

  $: project = $store[$active.projectId || '']

  $: projectPacks = derived([packs.store, active], ([packs, active]) => {
    let derivedPacks: Record<string, Pack> = {}

    Object.values(packs).forEach((p) => {
      if (p.projectId === active.projectId) {
        derivedPacks[p.id] = p
      }
    })

    return derivedPacks
  })

  $: {
    if (project) {
      projects.set(project)
    }
  }

  function onClickToggleSettings() {
    showSettings = !showSettings
  }

  function onClickRemoveProject() {
    const msg = `Are you sure you want to delete the project "${project.name}"?`

    if (confirm(msg)) {
      removeProject(project)
    }
  }

  function onClickNewPack() {
    if (newPackName === '') {
      newPackWarning = true
      newPackRef.focus()
    } else {
      createPack(newPackName)
    }
  }

  function onClickPack(pack: Pack) {
    selectPack(pack)
  }

  function suffix(val: Array<any> | number) {
    return (Array.isArray(val) ? val.length : val) === 1 ? '' : 's'
  }
</script>

<style>
  .name {
    flex: 1 1 auto;
  }

  li:hover :global(.remove) {
    display: block;
  }
</style>

<Main>
  <Sticky>
    <Section>
      <Title />
    </Section>
    <Section>
      <Button block on:click={onClickToggleSettings}>
        {showSettings ? 'Hide' : 'Show'} Settings
      </Button>
    </Section>
    {#if showSettings}
      <Section>
        <Heading>Project Name</Heading>
        <Input bind:value={project.name} />
      </Section>
      <Section>
        <Button block warning on:click={onClickRemoveProject}>Delete Project</Button>
      </Section>
    {/if}
    <Section>
      <Input
        bind:ref={newPackRef}
        bind:value={newPackName}
        on:input={() => (newPackWarning = false)}
        warning={newPackWarning}
        placeholder="New Pack Name" />
      <Button block on:click={onClickNewPack}>New Pack</Button>
    </Section>
    <Section>
      <Heading>Packs</Heading>
    </Section>
  </Sticky>
  <ContentArea>
    <List>
      {#each Object.entries($projectPacks) as [id, pack]}
        <li on:click={() => onClickPack(pack)}>
          <div class="name">
            <ClampedText text={pack.name} />
            <Italic>{pack.products.length} Animation{suffix(pack.products)}</Italic>
          </div>
        </li>
      {/each}
    </List>
  </ContentArea>
</Main>
