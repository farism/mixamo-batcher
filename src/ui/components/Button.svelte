<script>
  export let block = false
  export let warning = false
  export let success = false
  export let disabled = false
</script>

<button
  class="btn"
  class:btn-success={success}
  class:btn-warning={warning}
  class:btn-default={!success && !warning}
  class:btn-block={block}
  on:click
  {disabled}
>
  <slot />
</button>
