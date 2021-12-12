<script lang="ts">
  export let ref: HTMLInputElement | null = null

  export let value: string = ''

  export let warning: boolean = false

  export let placeholder: string = ''
</script>

<style>
  input.warning {
    border-color: #f5464b;
  }
</style>

<input
  bind:this={ref}
  bind:value
  on:input
  on:change
  class="form-control input-sm"
  class:warning
  {placeholder} />
