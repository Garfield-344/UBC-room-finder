<script>
    import map from '../assets/ubcMap.svg'

    let left = $state(0);
    let top = $state(0);
    let width = $state(window.screen.width);

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