<script>
  export let block = false
  export let warning = false
  export let success = false
  export let disabled = false
  export let title = ''
</script>

<button
  class="btn"
  class:btn-success={success}
  class:btn-warning={warning}
  class:btn-default={!success && !warning}
  class:btn-block={block}
  {disabled}
  {title}
  on:click
  on:mouseover
  on:focus
>
  <slot />
</button>

<style>
  button:disabled {
    pointer-events: auto;
  }
</style>
