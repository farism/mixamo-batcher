<script lang="ts">
  import { active } from '../app'
  import { projects } from '../projects'

  const store = projects.store

  $: project = $store[$active.projectId || '']

  $: pack = project && project.packs[$active.packId || '']

  function onClickHome() {
    active.set({})
  }

  function onClickProject() {
    active.update((s) => ({ ...s, packId: null }))
  }

  function onClickPack() {
    active.update((s) => ({ ...s }))
  }
</script>

<div class="breadcrumbs">
  <span on:click={onClickHome}>Home</span>
  {#if project}
    <div>></div>
    <span on:click={onClickProject}>{project.name}</span>
  {/if}
  {#if pack}
    <div>></div>
    <span on:click={onClickPack}>{pack.name}</span>
  {/if}
</div>

<style>
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
