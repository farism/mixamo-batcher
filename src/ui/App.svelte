<script lang="ts">
  import { accessToken, active, initialize } from './app'
  import Home from './views/Home.svelte'
  import Pack from './views/Pack.svelte'
  import Project from './views/Project.svelte'

  initialize()
</script>

{#if $accessToken}
  {#if $active.pack}
    <Pack />
  {:else if $active.project}
    <Project />
  {:else}
    <Home />
  {/if}
{:else}
  Not logged in
{/if}

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
</style>
