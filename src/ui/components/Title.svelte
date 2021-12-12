<script lang="ts">
  import { derived } from 'svelte/store'
  import { active } from '../app'
  import { packs } from '../packs'
  import { projects } from '../projects'
  import Heading from './Heading.svelte'

  const derivedActive = derived(
    [projects.store, packs.store, active],
    ([projects, packs, active]) => {
      return {
        project: projects[active.projectId || ''],
        pack: packs[active.packId || ''],
      }
    },
  )

  function onClickHome() {
    active.set({})
  }

  function onClickProject() {
    active.update((store) => ({ ...store, packId: null }))
  }

  function onClickPack() {
    active.update((store) => ({ ...store }))
  }
</script>

<style>
  .title {
    margin-bottom: 10px;
  }

  .breadcrumbs {
    flex: 0 0 auto;
  }

  .breadcrumbs :global(div) {
    display: inline-block;
    margin: 0 5px;
  }

  .breadcrumbs :global(span:hover) {
    color: #888;
    cursor: pointer;
    text-decoration: underline;
  }
</style>

<div class="title">
  <Heading>Mixamo Batch Utility</Heading>
</div>

<div class="breadcrumbs">
  <span on:click={onClickHome}>Projects</span>
  {#if $derivedActive.project}
    <div>></div>
    <span on:click={onClickProject}>{$derivedActive.project.name}</span>
  {/if}
  {#if $derivedActive.pack}
    <div>></div>
    <span on:click={onClickPack}>{$derivedActive.pack.name}</span>
  {/if}
</div>
