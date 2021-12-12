<script lang="ts">
  export let bottom = false
</script>

<style>
  div {
    background: white;
    position: sticky;
    z-index: 10;
  }
</style>

<div style={bottom ? 'bottom: 0;' : 'top: 0'}>
  <slot />
</div>
