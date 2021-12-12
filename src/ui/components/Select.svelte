<script lang="ts">
  export let label = ''
  export let value = ''
</script>

<label>
  {label}
  <select class="input-sm form-control" bind:value on:change>
    <slot />
  </select>
</label>
