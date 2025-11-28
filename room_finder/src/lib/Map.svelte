<script>
    import map from '../assets/ubcMap.png';
    let {buildings, selectedBuilding=$bindable()} = $props();

    let left = $state(0);
    let top = $state(0);
    let width = $state(window.screen.width);

    let latOffset = $state(49.2565);
    let longOffset = $state(-123.24235);

    let degAdj = $state(-0.9);
    let distAdj = $state(43);

    function onmousedown(e) {
        const initialX = left;
        const initialY = top;

        const startX = e.pageX;
        const startY = e.pageY;

        e.target.onmousemove = (moveEvent)=> {
            left = initialX + moveEvent.pageX - startX;
            top = initialY + moveEvent.pageY - startY;
        }
    }

    function onmouseup(e) {
        e.target.onmousemove = null;
    }

    function onwheel(e) {
        const delta = -1 * e.deltaY * (width/1000);
        const enlarge = (width + delta)/width;
        
        left = e.pageX - enlarge * (e.pageX - left);
        top = e.pageY - enlarge * (e.pageY - top);
        width = width + delta;
    }

    function reorient(lat, long) {
      const deg = Math.atan((long - longOffset)/(lat - latOffset));
      const dist = Math.sqrt((long - longOffset) * (long - longOffset) + (lat - latOffset)*(lat - latOffset));

      const newX = Math.cos(deg + degAdj) * dist * distAdj * width;
      const newY = Math.sin(deg + degAdj) * dist * distAdj * width;
      return [newX, newY];
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="window-container" onmousedown={onmousedown} onmouseup={onmouseup} onwheel={onwheel} role="Control panning and scaling for map">
  <div class="map-container"
      style:left={String(left) + "px"}
      style:top={String(top) + "px"}
      style:width={String(width) + "px"}
  >
    
      <img src={map} draggable="false" class="map" id="map" alt="Map of UBC campus"/>

      <div class="map-dots">
      {#each buildings as building}
        <button class="dot"
          style:left={"calc(50% + " + reorient(building.coordinates[0], building.coordinates[1])[0] + "px)"}
          style:top={"calc(50% + " + reorient(building.coordinates[0], building.coordinates[1])[1] + "px)"}
          style:--score={String(100* building.score) + "%"} 
          style:--title={"'" + building.building + "'"}
          onclick={() => selectedBuilding = building.building}
          aria-label={building.building}>
        </button>
      {/each}
      </div>
  </div>

  <!-- 
    <div class="inputs">

      <p>{latOffset} {longOffset} {distAdj} {degAdj}</p>
      <input bind:value={latOffset} type="number">
      <input bind:value={longOffset} type="number">

      <input bind:value={distAdj} type="number">
      <input bind:value={degAdj} type="number">
    </div>
  -->
</div>

<style lang="scss">
  .window-container {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    position: relative;
    .map-container {
      position: absolute;
    }
    .map {
      width: 100%;
    }
    .map-dots {
      display: contents;
    }
    .dot {
      padding: 0;
      
      position: absolute;
      aspect-ratio: 1;
      width: calc(var(--score) / 25);
      height: auto;
      border-radius: 100%;
      border: none;
      transform: translate(-50%, -50%);

      --dotColour: color-mix(in hsl, var(--dotBrightest) var(--score), #ff010175);

      background: radial-gradient(var(--dotColour) 50%, transparent);

      transition: width 1s, background 1s;
      
      &:hover {
        cursor: pointer;
        z-index: 500;
      }
      &:hover::after {
        content: var(--title);
        position: absolute;
        bottom: calc(100% + 1em);
        background: white;
        color: black;
        padding: 0.25em;

      }
    }
    .inputs {
      position: absolute;
    }
  }
</style>