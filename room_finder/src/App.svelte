<script>
  import Map from './lib/Map.svelte';
  import rooms from './assets/rooms.json';
  import FilterButton from './lib/FilterButton.svelte';
  import SearchButton from "./lib/SearchButton.svelte";
  import RoomQueryEngine from './roomQueryEngine/main/roomQueryEngine';
  import RoomListItem from './lib/RoomListItem.svelte';

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

  function filterRankRooms(rooms, filters, preferences, searchActive, searchQuery) {
    if (searchActive) {
      const searchResult = roomQueryEngine.normalizeScoreRooms(searchQuery, rooms);
      console.log(searchResult);
      return searchResult;
    }

    const filteredRooms = rooms.filter((room) => filterRoom(room, filters));
    const rankedRooms = filteredRooms.map((room) => ({...room, "score": rankRoom(room, preferences)})).sort((roomA, roomB) => roomB["score"] - roomA["score"]);
    return rankedRooms;
  }

  function rankBuildings(rankedRooms) {
    const buildings = {
        'Irving K. Barber': { coordinates: [49.267583221844326, -123.25265292744709]},
        'Koerner': { coordinates: [49.266691562352584, -123.255176004471]},
        'Woodward': {coordinates: [49.26466620349277, -123.24719473044618]},
        'Arts Student Centre': {coordinates: [49.269435281039385, -123.25306144578848]},
        'Engineering Student Centre': {coordinates: [49.26231460694829, -123.24930974763845]},
      };
    

    const RoomsByBuilding = Object.groupBy(rankedRooms, ({building}) => building);

    let result = Object.keys(RoomsByBuilding).map((building) => (
      {
        "building": building,
        "coordinates": buildings[building].coordinates,
        "score": RoomsByBuilding[building].reduce((total, {score}) => Math.max(total, score), 0)
      }));

    // Add in filtered out buildings with a score of 0. This is so we can see the dots on the map shrink to nothing instead of immediately disasapearing
    for (let building of Object.keys(buildings)) {
      if (!(building in Object.keys(RoomsByBuilding))) {
        result.push(
          {
            "building": building,
            "coordinates": buildings[building].coordinates,
            "score": 0
          }
        )
      }
    }

    return result;
  }

  function onSearch(query) {
    console.log(query);
    console.log(roomQueryEngine.filterAndOrderRoomsByQuery(query, rooms));
  }

  function queryToFilters(query) {
    const filterKeys = Object.keys(query).filter((k) => Math.abs(query[k]) > 1);
    let filter = {};
    for (let k of filterKeys) {
      filter[k] = (query[k] > 0);
    }
    return filter;
  }

  function queryToPreferences(query) {
    const PreferenceKeys = Object.keys(query).filter((k) => Math.abs(query[k]) == 1);
    let preference = {};
    for (let k of PreferenceKeys) {
      preference[k] = (query[k] > 0);
    }
    return preference;
  }

  const defaultQuery = {
    "quiet": 1,
    "outlets": 2,
  }

  let searchQuery = $state("");
  let searchActive = $state(false);
  let query = $state(defaultQuery);
  let filters = $derived(queryToFilters(query));
  let preferences = $derived(queryToPreferences(query));
  let selectedBuilding = $state("all");

  let filterRankedRooms = $derived(filterRankRooms(rooms, filters, preferences, searchActive, searchQuery));
  let filterRankedBuildings = $derived(rankBuildings(filterRankedRooms)); 
</script>

<main>
    <Map buildings={filterRankedBuildings} bind:selectedBuilding={selectedBuilding} />
    <div class="ui">
      <div class="top-inputs">
        <div class="filters">
          <FilterButton name={"outlets"} bind:query={query} />
          <FilterButton name={"whiteboard"} bind:query={query} />
          <FilterButton name={"tv"} bind:query={query} />
          <FilterButton name={"quiet"} bind:query={query} />
          <FilterButton name={"food_near"} bind:query={query} />
        </div>
        <SearchButton bind:searchQuery={searchQuery} bind:searchActive={searchActive} />
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
            <RoomListItem room={room} query={query} />
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
    > * {
      filter: drop-shadow(0 0 0.25em rgba(0, 0, 0, 0.3137254902));
    }
    .top-inputs {
      display: flex;
      gap: 0.5em;
      
      position: absolute;
      top: 1em;
      left: 1em;
    }
    .filters {
      padding: 0.5em;
      display: flex;
      gap: 0.5em;

      background: var(--room-finder-grey);
      border-radius: 1em;
    }
    .floating-sidebar {
      padding: 1em;
      width: 400px;

      position: absolute;
      top: 1em;
      right: 1em;
      bottom: 1em;

      overflow: auto;

      background: var(--room-finder-grey);
      border-radius: 1em;

      color: black;
      text-align: left;
      ul {
        padding: 0;
        list-style: none;
      }
    }
  }
</style>