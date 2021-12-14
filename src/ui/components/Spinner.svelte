<div class="lds-ellipsis">
  <div />
  <div />
  <div />
  <div />
</div>

<style>
  .lds-ellipsis {
    display: inline-block;
    position: relative;
    width: 28px;
    height: 6px;
  }

  .lds-ellipsis div {
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #333;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }

  .lds-ellipsis div:nth-child(1) {
    left: 0;
    animation: lds-ellipsis1 0.6s infinite;
  }

  .lds-ellipsis div:nth-child(2) {
    left: 0;
    animation: lds-ellipsis2 0.6s infinite;
  }

  .lds-ellipsis div:nth-child(3) {
    left: 12px;
    animation: lds-ellipsis2 0.6s infinite;
  }

  .lds-ellipsis div:nth-child(4) {
    left: 24px;
    animation: lds-ellipsis3 0.6s infinite;
  }

  @keyframes lds-ellipsis1 {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes lds-ellipsis3 {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }

  @keyframes lds-ellipsis2 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(12px, 0);
    }
  }
</style>
