<div class="top-bar">
  <slot />
</div>

<style>
  .top-bar {
    border-bottom: 1px solid #ddd;
    flex: 0 0 auto;
    padding: 10px;
  }

  .top-bar > :global(button) {
    height: 32px;
    margin: 0;
  }
</style>
