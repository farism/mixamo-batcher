<script lang="ts">
  import { active } from '../app'
  import Heading from './Heading.svelte'

  function onClickHome() {
    active.set({})
  }

  function onClickProject() {
    active.update((store) => ({ ...store, pack: null }))
  }

  function onClickPack() {}
</script>

<div class="title">
  <Heading>Mixamo Batch Utility</Heading>
</div>

<div class="breadcrumbs">
  <span on:click={onClickHome}>Home</span>
  {#if $active.project}
    <div>></div>
    <span on:click={onClickProject}>
      {$active.project.name}
    </span>
  {/if}
  {#if $active.pack}
    <div>></div>
    <span on:click={onClickPack}>
      {$active.pack.name}
    </span>
  {/if}
</div>

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
