<script lang="ts">
  export let ref: HTMLInputElement

  export let value: string = ''

  export let warning: boolean = false

  export let placeholder: string
</script>

<input
  bind:this={ref}
  bind:value
  on:input
  class="form-control input-sm"
  class:warning
  {placeholder}
/>

<style>
  input {
    margin-bottom: 10px;
  }

  input.warning {
    border-color: #f5464b;
  }
</style>
