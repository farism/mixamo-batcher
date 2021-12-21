<script lang="ts">
  import { onMount } from 'svelte'
  import { accessToken, active, initialize } from './app'
  import { projects } from './projects'
  import Home from './views/Home.svelte'
  import Pack from './views/Pack.svelte'
  import Project from './views/Project.svelte'

  const store = projects.store

  $: project = $store[$active.projectId || '']

  $: pack = project && project.packs[$active.packId || '']

  $: project && projects.set(project)

  initialize()

  onMount(() => {
    window.onunhandledrejection = (e) => {
      // console.log('we got exception', e)
    }
  })
</script>

{#if $accessToken}
  {#if project}
    {#if pack}
      <Pack bind:project bind:pack />
    {:else}
      <Project bind:project />
    {/if}
  {:else}
    <Home />
  {/if}
{:else}Not logged in{/if}

<style>
  :global * {
    box-sizing: border-box;
    height: auto;
  }

  :global html {
    color: #333;
    font-family: Ubuntu, Arial, sans-serif;
    height: 100%;
  }

  :global body {
    background: white;
    box-sizing: border-box;
    margin: 0;
    min-height: 100%;
    padding: 0;
  }

  :global #app {
    display: flex;
    flex-direction: column;
    font-size: 13px;
    height: 100%;
  }

  :global(* + input),
  :global(* + button) {
    margin-top: 10px;
  }
</style>
