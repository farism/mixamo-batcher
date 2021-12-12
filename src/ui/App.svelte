<script lang="ts">
  import { accessToken, active, initialize } from './app'
  import Home from './views/Home.svelte'
  import Pack from './views/Pack.svelte'
  import Project from './views/Project.svelte'

  initialize()
</script>

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

{#if $accessToken}
  {#if $active.packId}
    <Pack />
  {:else if $active.projectId}
    <Project />
  {:else}
    <Home />
  {/if}
{:else}Not logged in{/if}
