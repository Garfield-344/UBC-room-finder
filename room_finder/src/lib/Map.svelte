<script>
    import map from '../assets/ubcMap.svg'

    let left = $state(0);
    let top = $state(0);
    let width = $state(window.screen.width);

    let latOffset = $state(49.2565);
    let longOffset = $state(-123.24235);

    let degAdj = $state(-0.9);
    let distAdj = $state(4363);

    const buildings = $state([
      { building: 'Irving K. Barber', coordinates: [49.267583221844326, -123.25265292744709]},
      { building: 'Koerner', coordinates: [49.266896897558034, -123.2551561036548]},
      { building: 'Woodward', coordinates: [49.26466620349277, -123.24719473044618]},
      { building: 'Arts Student Centre', coordinates: [49.269435281039385, -123.25306144578848]},
      { building: 'Engineering Student Centre', coordinates: [49.26231460694829, -123.24930974763845]},]);

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
        const delta = e.deltaY * (width/1000);
        const enlarge = (width + delta)/width;
        
        left = e.pageX - enlarge * (e.pageX - left);
        top = e.pageY - enlarge * (e.pageY - top);
        width = width + delta;
    }

    function reorient(lat, long) {
      const deg = Math.atan((long - longOffset)/(lat - latOffset));
      const dist = Math.sqrt((long - longOffset) * (long - longOffset) + (lat - latOffset)*(lat - latOffset));

      let asp = 1;
      if (document.getElementById("map")){
        asp = document.getElementById("map").offsetHeight/document.getElementById("map").offsetWidth;
      }

      const newX = Math.cos(deg + degAdj) * dist * distAdj;
      const newY = Math.sin(deg + degAdj) * dist * distAdj/asp;
      return [newX, newY];
    }
</script>

<div class="window-container" onmousedown={onmousedown} onmouseup={onmouseup} onwheel={onwheel} role="Control panning and scaling for map">
  <div class="map-container"
      style:left={String(left) + "px"}
      style:top={String(top) + "px"}
      style:width={String(width) + "px"}
  >
    
      <img src={map} draggable="false" class="map" id="map" alt="Map of UBC campus"/>

      <div class="map-dots">
      {#each buildings as building}
        <div class="dot"
          style:left={String(50 + reorient(building.coordinates[0], building.coordinates[1])[0]) + "%"}
          style:top={String( 50 + reorient(building.coordinates[0], building.coordinates[1])[1] ) + "%"}>
          {building.building}
        </div>
      {/each}
      </div>
  </div>

    <div class="inputs">

      <p>{latOffset} {longOffset} {distAdj} {degAdj}</p>
      <input bind:value={latOffset} type="number">
      <input bind:value={longOffset} type="number">

      <input bind:value={distAdj} type="number">
      <input bind:value={degAdj} type="number">
    </div>
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
      position: absolute;
      aspect-ratio: 1;
      width: 1em;
      height: auto;
      background: green;
    }
    .inputs {
      position: absolute;
    }
  }
</style>