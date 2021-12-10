<script lang="ts">
  import { Product } from '../../types'
  import {
    active,
    addProductToPack,
    downloadPack,
    packs,
    removeProductFromPack,
    selectedCharacter,
    selectedProduct,
    switchPackCharacter,
    viewProduct,
  } from '../app'
  import Button from '../components/Button.svelte'
  import ClampedText from '../components/ClampedText.svelte'
  import ContentArea from '../components/ContentArea.svelte'
  import Heading from '../components/Heading.svelte'
  import Italic from '../components/Italic.svelte'
  import List from '../components/List.svelte'
  import Main from '../components/Main.svelte'
  import Section from '../components/Section.svelte'
  import Sticky from '../components/Sticky.svelte'
  import Title from '../components/Title.svelte'
  import CaretIcon from '../icons/CaretIcon.svelte'

  let expandedId: string

  $: pack = $packs[$active.pack.id]

  $: {
    if (pack) {
      pack.products[0].details.gms_hash['arm-space'] = 1
    }
  }

  function onClickSwitchCharacter() {
    const msg = `Are you sure you want to switch this pack to use the character "${$selectedCharacter.name}"?`

    if (confirm(msg)) {
      switchPackCharacter(pack)
    }
  }

  function onClickAddProduct() {
    if (pack) {
      addProductToPack()
    }
  }

  function onClickRemoveProduct(product: Product) {
    const msg = `Are you sure you want to delete the animation "${product.name}"?`

    if (confirm(msg)) {
      removeProductFromPack(product.id)
    }
  }

  function onClickProduct(product: Product) {
    if (expandedId !== product.id) {
      expandedId = product.id
      viewProduct(product)
    }
  }

  function onClickDownloadPack() {
    downloadPack()
  }

  function isProductAlreadyAdded(product: Product) {
    return Boolean(pack.products.find((p) => p.id === product.id))
  }
</script>

<Main>
  <Sticky>
    <Section>
      <Title />
    </Section>
    <Section>
      <Heading>Character</Heading>
      <div class="selected-prod">
        <ClampedText clamp={1} text={pack.character.name} />
      </div>
      <Button block on:click={onClickSwitchCharacter}>Switch</Button>
    </Section>
    <Section>
      <Heading>Selected Animation</Heading>
      {#if $selectedProduct}
        <div class="selected-prod">
          <div>
            {$selectedProduct.name}
          </div>
        </div>
        <Button
          block
          disabled={isProductAlreadyAdded($selectedProduct)}
          on:click={onClickAddProduct}
        >
          Add To Pack
        </Button>
      {:else}
        <div class="selected-prod">
          <Italic>No animation currently selected</Italic>
        </div>
      {/if}
    </Section>
  </Sticky>
  <ContentArea>
    <Section>
      <Heading>Pack Animations</Heading>
    </Section>
    <List>
      {#each pack.products as product}
        <li class="prod" class:expanded={product.id === expandedId}>
          <div class="prod-header" on:click={() => onClickProduct(product)}>
            <div>
              <div title={product.name}>{product.name}</div>
              <Italic>
                <ClampedText text={product.description} />
              </Italic>
            </div>
            <div class="mb_arrow">
              <CaretIcon />
            </div>
          </div>
          <div class="prod-body">
            {JSON.stringify(product.details.gms_hash, null, 2)}
          </div>
        </li>
      {/each}
    </List>
  </ContentArea>
  <Sticky bottom>
    <Section>
      <Button block on:click={onClickDownloadPack}>Download Pack</Button>
    </Section>
  </Sticky>
</Main>

<style>
  li :global(.remove) {
    visibility: hidden;
    display: block;
  }

  li:hover :global(.remove) {
    visibility: visible;
  }

  .selected-prod {
    padding: 10px;
    text-align: center;
  }

  .prod {
    flex-direction: column;
    padding: 10px;
  }

  .prod.expanded .prod-body {
    display: block;
  }

  .prod.expanded .mb_arrow {
    transform: rotate(180deg);
  }

  .mb_arrow {
    transform: rotate(90deg);
    transition: 0.2s;
  }

  .prod-header {
    align-items: center;
    display: flex;
    flex: 0 0 auto;
    justify-content: space-between;
    width: 100%;
  }

  .prod-body {
    cursor: default;
    /* display: none; */
    padding: 10px 0;
    width: 100%;
  }
</style>
