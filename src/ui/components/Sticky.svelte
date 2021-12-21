<script lang="ts">
  export let bottom = false
</script>

<div style={bottom ? 'bottom: 0;' : 'top: 0'}>
  <slot />
</div>

<style>
  div {
    background: white;
    z-index: 10;
  }

  @media only screen and (min-height: 500px) {
    div {
      position: sticky;
    }
  }
</style>
