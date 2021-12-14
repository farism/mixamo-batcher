<script lang="ts">
  import { Preferences } from '../../types'
  import Select from './Select.svelte'

  export let showInplace: boolean = true
  export let inplace: boolean = false
  export let preferences: Preferences = {
    format: 'fbx7_2019',
    skin: 'true',
    fps: '30',
    reducekf: '0',
  }
</script>

{#if showInplace}
  <label>
    <input type="checkbox" bind:checked={inplace} />
    In Place
  </label>
{/if}
<Select label="Format" bind:value={preferences.format} on:change}>
  <option value="fbx7_2019">FBX Binary(.fbx)</option>
  <option value="fbx7_2019_ascii">FBX ASCII(.fbx)</option>
  <option value="fbx7_unity">FBX for Unity(.fbx)</option>
  <option value="fbx7_2014">FBX 7.4(.fbx)</option>
  <option value="fbx6">FBX 6.1(.fbx)</option>
  <option value="dae_mixamo">Collada(.dae)</option>
</Select>
<Select label="Skin" bind:value={preferences.skin} on:change}>
  <option value="true">With Skin</option>
  <option value="false">Without Skin</option>
</Select>
<Select label="Frames per Second" bind:value={preferences.fps} on:change}>
  <option value="24">24</option>
  <option value="30">30</option>
  <option value="60">60</option>
</Select>
<Select label="Keyframe Reduction" bind:value={preferences.reducekf} on:change}>
  <option value="0">None</option>
  <option value="1">Uniform</option>
  <option value="2">Non-Uniform</option>
</Select>
