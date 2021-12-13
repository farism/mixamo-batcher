<script lang="ts">
  import { onMount } from 'svelte'
  import { derived } from 'svelte/store'
  import { Message, MessageType, Pack, Product, Project } from '../../types'
  import { active, selectedCharacter, selectedProduct } from '../app'
  import Breadcrumbs from '../components/Breadcrumbs.svelte'
  import Button from '../components/Button.svelte'
  import ClampedText from '../components/ClampedText.svelte'
  import ContentArea from '../components/ContentArea.svelte'
  import Heading from '../components/Heading.svelte'
  import Input from '../components/Input.svelte'
  import Italic from '../components/Italic.svelte'
  import List from '../components/List.svelte'
  import Main from '../components/Main.svelte'
  import Preferences from '../components/Preferences.svelte'
  import Section from '../components/Section.svelte'
  import Sticky from '../components/Sticky.svelte'
  import Title from '../components/Title.svelte'
  import CaretIcon from '../icons/CaretIcon.svelte'
  import { syncStreamParamsToProduct, viewProduct } from '../products'
  import { addProduct, downloadPack, duplicatePack, removePack, removeProduct } from '../projects'

  export let project: Project

  export let pack: Pack

  let showSettings: boolean = false

  let duplicatePackName: string = ''

  let duplicatePackWarning: boolean = false

  let duplicatePackRef: HTMLInputElement

  $: productExists = derived([selectedProduct], ([selectedProduct]) => {
    return Boolean(pack?.products.find((p) => p.id === selectedProduct?.id))
  })

  function onClickDuplicatePack() {
    duplicatePackWarning = duplicatePackName === ''

    if (duplicatePackWarning) {
      duplicatePackRef.focus()
    } else {
      duplicatePack(project, pack, duplicatePackName)
      showSettings = false
    }
  }

  function onClickToggleSettings() {
    showSettings = !showSettings
  }

  function onClickRemovePack() {
    const msg = `Are you sure you want to delete the pack "${pack.name}"?`

    if (confirm(msg)) {
      removePack(project, pack)
    }
  }

  function onClickSwitchCharacter() {
    if ($selectedCharacter) {
      const msg = `Are you sure you want to switch this pack to use the character "${$selectedCharacter.name}"?`

      if (pack && confirm(msg)) {
        pack.character = $selectedCharacter
      }
    }
  }

  function onClickAddProduct() {
    if (pack) {
      addProduct(pack)
    }
  }

  function onClickRemoveProduct(product: Product) {
    const msg = `Are you sure you want to delete the animation "${product.name}"?`

    if (confirm(msg)) {
      removeProduct(pack, product.id)
    }
  }

  function onClickProduct(product: Product) {
    active.update((s) => ({ ...s, productId: s.productId !== product.id ? product.id : null }))

    if ($active.productId) {
      selectedProduct.set(product)
      viewProduct(product)
    }
  }

  function onMessage(message: Message) {
    if (message.type === MessageType.StreamFetched) {
      syncStreamParamsToProduct(pack, message.payload)
    }
  }

  function onClickDownloadPack() {
    downloadPack()
  }

  onMount(() => {
    chrome.runtime.onMessage.addListener(onMessage)

    return () => {
      chrome.runtime.onMessage.removeListener(onMessage)
    }
  })
</script>

<Main>
  <Sticky>
    <Section>
      <Title />
    </Section>
    <Section>
      <Breadcrumbs />
    </Section>
    <Section>
      <Button block on:click={onClickToggleSettings}>
        {showSettings ? 'Hide' : 'Show'} Pack Settings
      </Button>
    </Section>
    {#if showSettings}
      <Section>
        <Heading>Pack Name</Heading>
        <Input bind:value={pack.name} />
      </Section>
      <Section>
        <Heading>Duplicate Pack</Heading>
        <Input
          bind:ref={duplicatePackRef}
          bind:value={duplicatePackName}
          warning={duplicatePackWarning}
          placeholder="Duplicated Pack Name"
        />
        <Button block on:click={onClickDuplicatePack}>Duplicate Pack</Button>
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
    {:else}
      <Section>
        <Button block on:click={onClickDownloadPack}>Download Pack</Button>
      </Section>
      <Section>
        <Heading>Add Animations</Heading>
        {#if $selectedProduct}
          <div class="center-pad">
            <div>{$selectedProduct.name}</div>
          </div>
          <Button
            block
            disabled={$productExists}
            title={$productExists ? 'Animation already exists in this pack' : ''}
            on:click={onClickAddProduct}
          >
            Add To Pack
          </Button>
        {:else}
          <div class="center-pad">
            <Italic>No animation currently selected</Italic>
          </div>
        {/if}
      </Section>
    {/if}
  </Sticky>

  {#if !showSettings}
    <ContentArea>
      <Section>
        <Heading>Pack Animations</Heading>
      </Section>
      <List>
        {#if pack}
          {#each pack.products as product}
            <li class="prod" class:expanded={product.id === $active.productId}>
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
              {#if product.id === $active.productId}
                <div class="prod-body">
                  <label>
                    <input type="checkbox" bind:checked={product.projectOverride} />
                    Override Project Preferences
                  </label>
                  {#if product.projectOverride}
                    <div class="animation-settings">
                      <Heading>Download Preferences</Heading>
                      <Preferences
                        showInplace={product.details.supports_inplace}
                        bind:inplace={product.details.gms_hash.inplace}
                        bind:preferences={product.preferences}
                      />
                    </div>
                  {/if}
                  <Button block on:click={() => onClickRemoveProduct(product)}>Remove</Button>
                  <pre style="display:none">
                  <code>{JSON.stringify(product, null, 2)}</code>
                </pre>
                </div>
              {/if}
            </li>
          {/each}
        {/if}
      </List>
    </ContentArea>
  {/if}
</Main>

<style>
  li .animation-settings {
    padding: 5px 0;
    margin: 0 0 10px 0;
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

  .prod.expanded .arrow {
    transform: rotate(180deg);
  }

  .arrow {
    margin-left: 10px;
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
    padding: 10px 0;
    width: 100%;
  }

  .animation-settings {
    padding-top: 10px;
    margin: 0 10px;
  }
</style>
