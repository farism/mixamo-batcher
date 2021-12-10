<script lang="ts">
  export let bottom = false
</script>

<div style={bottom ? 'bottom: 0;' : 'top: 0'}>
  <slot />
</div>

<style>
  div {
    background: white;
    position: sticky;
    z-index: 10;
  }
</style>
