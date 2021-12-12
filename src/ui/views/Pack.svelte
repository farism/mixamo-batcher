<script lang="ts">
  import { derived } from 'svelte/store'
  import { Product } from '../../types'
  import { active,selectedCharacter,selectedProduct } from '../app'
  import Button from '../components/Button.svelte'
  import ClampedText from '../components/ClampedText.svelte'
  import ContentArea from '../components/ContentArea.svelte'
  import Download from '../components/Download.svelte'
  import Heading from '../components/Heading.svelte'
  import Input from '../components/Input.svelte'
  import Italic from '../components/Italic.svelte'
  import List from '../components/List.svelte'
  import Main from '../components/Main.svelte'
  import Section from '../components/Section.svelte'
  import Sticky from '../components/Sticky.svelte'
  import Title from '../components/Title.svelte'
  import CaretIcon from '../icons/CaretIcon.svelte'
  import { addProduct,downloadPack,packs,removePack,removeProduct, switchCharacter } from '../packs'
  import { viewProduct } from '../products'
  
  
  let expandedId: string | null

  let showSettings: boolean = false;

  const store = packs.store

  $: pack = $store[$active.packId || '']

  $: productExists = derived([selectedProduct], ([selectedProduct]) => {
    return Boolean(pack?.products.find((p) => p.id === selectedProduct?.id))
  })

  $: {
    if(pack) {
      packs.set(pack)
    }
  }

  function onClickToggleSettings() {
    showSettings = !showSettings
  }

  function onClickRemovePack() {
    const msg = `Are you sure you want to delete the pack "${pack.name}"?`

    if (confirm(msg)) {
      removePack(pack)
    }
  }
  
  function onClickSwitchCharacter() {
    const msg = `Are you sure you want to switch this pack to use the character "${$selectedCharacter?.name}"?`

    if (pack && confirm(msg)) {
      switchCharacter(pack)
    }
  }

  function onClickAddProduct() {
    if (pack) {
      expandedId = addProduct()
    }
  }

  function onClickRemoveProduct(product: Product) {
    const msg = `Are you sure you want to delete the animation "${product.name}"?`

    if (confirm(msg)) {
      removeProduct(product.id)
    }
  }

  function onClickProduct(product: Product) {
    if (expandedId !== product.id) {
      expandedId = product.id
      selectedProduct.set(product)
      viewProduct(product)
    } else {
      expandedId = null
    }
  }

  function onClickDownloadPack() {
    downloadPack()
  }
</script>

<style>
  li :global(.animation-settings) {
    padding: 5px 0;
    margin-bottom: 10px;
  }

  li :global(.remove) {
    visibility: hidden;
    display: block;
  }

  li:hover :global(.remove) {
    visibility: visible;
  }

  .center-pad {
    padding: 10px 10px 0 10px;
    text-align: center;
  }

  .prod {
    flex-direction: column;
    padding: 10px;
  }

  .prod.expanded .prod-body {
    display: block;
  }

  .prod.expanded .arrow {
    transform: rotate(180deg);
  }

  .arrow {
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
    display: none;
    padding: 10px 0;
    width: 100%;
  }
</style>

<Main>
  <Sticky>
    <Section>
      <Title />
    </Section>
    <Section>
      <Button block on:click={onClickDownloadPack}>Download Pack</Button>
    </Section>
    <Section>
      <Button block on:click={onClickToggleSettings}>{showSettings ? 'Hide' : 'Show'} Settings</Button>
    </Section>
    {#if showSettings}
      <Section>
        <Heading>Pack Name</Heading>
        <Input bind:value={pack.name} />
      </Section>
      <Section>
        <Heading>Selected Character</Heading>
        <div class="center-pad">
            <ClampedText clamp={1} text={pack?.character.name} />
        </div>
        <Button block on:click={onClickSwitchCharacter}>Switch to Current</Button>
      </Section>
      <Section>
        <Button block warning on:click={onClickRemovePack}>Delete Pack</Button>
      </Section>
    {/if}
    <Section>
      <Heading>Selected Animation</Heading>
      {#if $selectedProduct}
        <div class="center-pad">
          <div>{$selectedProduct.name}</div>
        </div>
        <Button
          block
          disabled={$productExists}
          title={$productExists ? 'Product already added to pack' : ''}
          on:click={onClickAddProduct}>
          Add To Pack
        </Button>
      {:else}
        <div class="center-pad">
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
      {#if pack}
        {#each pack.products as product}
          <li class="prod" class:expanded={product.id === expandedId}>
            <div class="prod-header" on:click={() => onClickProduct(product)}>
              <div>
                <div title={product.name}>{product.name}</div>
                <Italic>
                  <ClampedText text={product.description} />
                </Italic>
              </div>
              <div class="arrow">
                <CaretIcon />
              </div>
            </div>
            <div class="prod-body">
              {#if product.download}
                <Download
                  showInplace={product.details.supports_inplace}
                  bind:inplace={product.details.gms_hash.inplace}
                  bind:download={product.download} />
              {/if}
              <Button block on:click={() => onClickRemoveProduct(product)}>Remove</Button>
              <pre style="display:none">
                <code>{JSON.stringify(product, null, 2)}</code>
              </pre>
            </div>
          </li>
        {/each}
      {/if}
    </List>
  </ContentArea>
</Main>