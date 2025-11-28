<script>
  import Map from './lib/Map.svelte';
  import rooms from './assets/rooms.json';
  import FilterButton from './lib/FilterButton.svelte';
  import SearchButton from "./lib/SearchButton.svelte";
  import RoomQueryEngine from './roomQueryEngine/main/roomQueryEngine';

  const roomQueryEngine = new RoomQueryEngine();

  function filterRoom(room, filters) {
    return !Object.keys(filters).map((attribute) => {
      if (attribute in room){
        return room[attribute] == filters[attribute];
      }
      return false;
    }).includes(false);
  }
  function rankRoom(room, preferences) {
    return (Object.keys(preferences).filter((attribute) => {
      if (attribute in room){
        return room[attribute] == preferences[attribute];
      }
      return false;
    }).length+1)/(Object.keys(preferences).length + 1);
  }

  function filterRankRooms(rooms, filters, preferences) {
    const filteredRooms = rooms.filter((room) => filterRoom(room, filters));
    const rankedRooms = filteredRooms.map((room) => ({...room, "score": rankRoom(room, preferences)}));
    return rankedRooms;
  }

  function filterRankBuildings(rooms, filters, preferences) {
    const buildings = {
        'Irving K. Barber': { coordinates: [49.267583221844326, -123.25265292744709]},
        'Koerner': { coordinates: [49.266691562352584, -123.255176004471]},
        'Woodward': {coordinates: [49.26466620349277, -123.24719473044618]},
        'Arts Student Centre': {coordinates: [49.269435281039385, -123.25306144578848]},
        'Engineering Student Centre': {coordinates: [49.26231460694829, -123.24930974763845]},
      };
    
    const rankedRooms = filterRankRooms(rooms, filters, preferences);

    const RoomsByBuilding = Object.groupBy(rankedRooms, ({building}) => building);

    const result = Object.keys(RoomsByBuilding).map((building) => (
      {
        "building": building,
        "coordinates": buildings[building].coordinates,
        "score": RoomsByBuilding[building].reduce((total, {score}) => Math.max(total, score), 0)
      }));

    return result;
  }

  function onSearch(query) {
    console.log(query);
  }

  let filters = $state({});
  let preferences = $state({})
  let selectedBuilding = $state("all");

  let filterRankedRooms = $derived(filterRankRooms(rooms, filters, preferences));
  let filterRankedBuildings = $derived(filterRankBuildings(rooms, filters, preferences)); 
</script>

<main>
    <Map buildings={filterRankedBuildings} />
    <div class="ui">
      <div class="filters">
        <FilterButton name={"outlets"} filters={filters} />
        <FilterButton name={"whiteboard"} filters={filters} />
        <FilterButton name={"tv"} filters={filters} />
        <FilterButton name={"quiet"} filters={filters} />
        <FilterButton name={"food_near"} filters={filters} />
        <SearchButton onSearch="{onSearch}" />

      </div>
      <div class="floating-sidebar">
        <!--
        "building": "Irving K. Barber",
        "capacity": 8,
        "whiteboard": true,
        "tv": false,
        "outlets": true,
        "url": "https://libcal.library.ubc.ca/space/18999",
        "quiet": false,
        "food_near": true
        -->
        <div style="font-weight: bold; font-size: 30px; margin: 5px;">
          Your Best Rooms
        </div>


        <b style="margin: 5px">Building:</b>
        <select bind:value={selectedBuilding}>
          <option value="all">All</option>
          {#each filterRankedBuildings as building}
            <option value={building.building}>{building.building}</option>
          {/each}
        </select>
        <ul>
          {#each filterRankedRooms.filter(({building}) => building==selectedBuilding || selectedBuilding == "all") as room}
            <li>
              <h3><a href={room.url}>{room.building} - {room.id}</a></h3>
              <dl>
                <dt>Room</dt>
                <dd>{Object.keys(room).filter((k) => ["capacity", "whiteboard", "tv", "outlets"].includes(k) && room[k] != false).join(", ")}</dd>
                <dt>Environment</dt>
                <dd>{Object.keys(room).filter((k) => ["quiet"].includes(k) && room[k] != false).join(", ")}</dd>
                <dt>Location</dt>
                <dd>{Object.keys(room).filter((k) => ["food_near"].includes(k) && room[k] != false).join(", ")}</dd>
              </dl>
            </li>
          {/each}
        </ul>
      </div>
    </div>
</main>

<style lang="scss">
  .ui {
    display: contents;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .filters {
      position: absolute;
      top: 1em;
      left: 1em;
    }
    .floating-sidebar {
      padding: 1em;
      width: 400px;

      position: absolute;
      top: 1em;
      right: 1em;
      bottom: 1em;

      overflow: auto;

      background: white;
      color: black;
      text-align: left;
      ul {
        padding: 0;
        list-style: none;
        li {
          padding-bottom: 1em;
          border-bottom: 1px solid;
        }
      }

      // ===
      //border-radius: 15px;
      background: #E6E6E6;

    }
  }
</style>