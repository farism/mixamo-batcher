<script lang="ts">
  import Button from './Button.svelte'
  import TrashIcon from '../icons/TrashIcon.svelte'

  export let onClick = () => {}
</script>

<div class="remove">
  <Button
    warning
    on:click={(e) => {
      e.preventDefault()
      e.stopImmediatePropagation()
      onClick()
    }}
  >
    <TrashIcon />
  </Button>
</div>

<style>
  .remove {
    display: none;
    margin-left: 10px;
  }

  .remove :global(button) {
    align-items: center;
    display: flex;
    height: 24px;
    justify-content: center;
    padding: 0;
    width: 24px;
  }

  .remove :global(svg) {
    height: 16px;
    width: 16px;
  }
</style>
