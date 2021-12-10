<script lang="ts">
  import { derived } from 'svelte/store'
  import { Pack } from '../../types'
  import { active, createPack, deletePack, packs, selectPack } from '../app'
  import Button from '../components/Button.svelte'
  import ClampedText from '../components/ClampedText.svelte'
  import ContentArea from '../components/ContentArea.svelte'
  import Heading from '../components/Heading.svelte'
  import Input from '../components/Input.svelte'
  import Italic from '../components/Italic.svelte'
  import List from '../components/List.svelte'
  import Main from '../components/Main.svelte'
  import RemoveButton from '../components/RemoveButton.svelte'
  import Section from '../components/Section.svelte'
  import Sticky from '../components/Sticky.svelte'
  import Title from '../components/Title.svelte'

  let newPackName: string = ''

  let newPackWarning: boolean = false

  let newPackRef: HTMLInputElement

  $: projectPacks = derived([packs, active], ([packs, active]) => {
    let derivedPacks: Record<string, Pack> = {}

    Object.values(packs).forEach((p) => {
      if (p.projectId === active?.project?.id) {
        derivedPacks[p.id] = p
      }
    })

    return derivedPacks
  })

  function onClickNewPack() {
    if (newPackName === '') {
      newPackWarning = true
      newPackRef.focus()
    } else {
      createPack(newPackName)
    }
  }

  function onClickRemovePack(pack: Pack) {
    const msg = `Are you sure you want to delete the pack "${pack.name}"?`

    if (confirm(msg)) {
      deletePack(pack)
    }
  }

  function onClickPack(pack: Pack) {
    selectPack(pack)
  }

  function suffix(val: Array<any> | number) {
    return (Array.isArray(val) ? val.length : val) === 1 ? '' : 's'
  }
</script>

<Main>
  <Sticky>
    <Section>
      <Title />
    </Section>
    <Section>
      <Input
        bind:ref={newPackRef}
        bind:value={newPackName}
        on:input={() => (newPackWarning = false)}
        warning={newPackWarning}
        placeholder="New Pack Name"
      />
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
            <Italic>
              {pack.products.length} Animation{suffix(pack.products)}
            </Italic>
          </div>
          <RemoveButton onClick={() => onClickRemovePack(pack)} />
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
</style>
