<script>
    import map from '../assets/ubcMap.svg'

    let left = $state(0);
    let top = $state(0);
    let width = $state(100);

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
        const delta = e.deltaY * -0.1;
        const enlarge = (width + delta)/width;
        
        left = left + e.pageX * (1 - enlarge);
        //top = top + e.pageY - (e.pageY * enlarge);
        width = width + delta;
    }
</script>

<div class="map-container" onmousedown={onmousedown} onmouseup={onmouseup} onwheel={onwheel}>
    <img src={map} draggable="false" class="map" id="map" alt="Map of UBC campus"
    style:left={String(left) + "px"}
    style:top={String(top) + "px"}
    style:width={String(width) + "px"}
    />
</div>

<style lang="scss">
  .map-container {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    position: relative;

    .map {
      position: absolute;
    }
  }
</style>