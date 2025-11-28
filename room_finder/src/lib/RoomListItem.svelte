<script>
    let {room, query} = $props();
        
    function QueryAttributesOfRoom(query, validAttributes, room) {
        return Object.keys(query).filter((k) => query[k] != 0 && validAttributes.includes(k) && room[k] != false);
    }

    function judgeRoomAttributeAgainstQuery(query, room, attribute) {
        if (query[attribute] > 0 == room[attribute]) {
            return "good";
        }
        return "bad";
    }

    function roomAttributesString(attributes, room) {
        return Object.keys(room).filter((k) => attributes.includes(k) && room[k] != false).map((k) => {if (k=="capacity") {return k + ": " + room[k]} else {return k.replace("_", " ")}}).join(", ");
    }

    const roomAttributes = ["capacity", "whiteboard", "tv", "outlets"];
    const environmentAttributes = ["quiet"];
    const locationAttributes = ["food_near"];
</script>

<li class="room" style:--score={String(room.score * 100) + "%"}>
    <h3><a href={room.url}>{room.building} - {room.id}</a></h3>

    {#each [["Room", roomAttributes], ["Environment", environmentAttributes], ["Location", locationAttributes]] as [attributeType, attributes]}
    <div class="room--attributes">                
        <div class="room--icon-row">
        {#each QueryAttributesOfRoom(query, attributes, room) as attribute}
            <img class={"icon " + judgeRoomAttributeAgainstQuery(query, room, attribute)} title={attribute} src={"/UBC-room-finder/src/assets/icons/" + attribute + ".svg"} alt={attribute}/>
        {/each}
        </div>
        <dt>{attributeType}</dt>
        <dd>{roomAttributesString(attributes, room)}</dd>
    </div>
    {/each}

</li>

<style lang="scss">
    li {
        padding-bottom: 1em;
        border-bottom: 1px solid var(--room-finder-grey-2);
        //border-left: 2px solid color-mix(in hsl, var(--dotBrightest) var(--score), #ff010175);
        .room--attributes {
        margin-top: 0.5em;
        }
        .room--icon-row {
        .icon {
            margin-right: 0.5em;
            height: 1.5em;
            display: inline;

            background: var(--icon-color);

            &.good {
            --icon-color: var(--room-finder-green-2);
            }
            &.bad {
            --icon-color: var(--room-finder-red-2);
            }
        }
        }
    }
</style>