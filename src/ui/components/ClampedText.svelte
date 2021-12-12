<script lang="ts">
  export let clamp = 2
  export let text = ''
</script>

<style>
  .single-line {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    display: inline-block;
  }

  .multi-line {
    -webkit-box-orient: vertical;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>

{#if clamp === 1}
  <span class="single-line" title={text}>{text}</span>
{:else}
  <span class="multi-line" style={`-webkit-line-clamp: ${clamp};`} title={text}>{text}</span>
{/if}
