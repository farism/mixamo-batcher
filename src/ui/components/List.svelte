<style>
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  ul :global(li) {
    align-items: center;
    cursor: pointer;
    display: flex;
    min-height: 48px;
    padding: 10px;
    transition: 0.2s;
  }

  ul :global(li:hover) {
    background-color: #f9f9f9;
  }

  ul :global(li + li) {
    border-top: 1px solid #ddd;
  }
</style>

<ul>
  <slot />
</ul>
