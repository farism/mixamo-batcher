<script lang="ts">
  export let label = ''
  export let min = 0
  export let max = 100
  export let step = 1
  export let value = 0

  $: displayValue = Math.round(((value + 1) / 2) * 100)
</script>

<style>
  .slider {
    color: #666768;
    width: 100%;
  }

  .slider:hover {
    color: #333;
  }

  .text {
    display: flex;
    font-size: 12px;
    justify-content: space-between;
    width: 100%;
  }

  input {
    -webkit-appearance: none;
    appearance: none;
    background: none;
    outline: none;
    width: 100%;
  }

  input::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    background-color: #e2e1dd;
    border-radius: 14px;
    height: 7px;
    margin: 5px 0;
    width: 100%;
  }

  input::-webkit-slider-thumb {
    -webkit-appearance: none;
    background: #949696;
    border-radius: 50%;
    border: none;
    height: 14px;
    margin-top: -3px;
    transition: 0.2s background-color, 0.2s box-shadow;
    width: 14px;
  }

  input::-webkit-slider-thumb:hover {
    background: #666;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  }
</style>

<div class="slider">
  <div class="text">
    <span>{label}</span>
    <span>{displayValue}</span>
  </div>
  <input type="range" {min} {max} {step} bind:value on:change />
</div>
