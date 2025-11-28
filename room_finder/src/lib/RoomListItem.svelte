<script>
    let {room, query, searchActive} = $props();
        
    function QueryAttributesOfRoom(query, validAttributes, room) {
        return Object.keys(query).filter((k) => query[k] != 0 && validAttributes.includes(k) && room[k] != false);
    }

    function judgeRoomAttributeAgainstQuery(query, room, attribute) {
        if (query[attribute] > 0 == room[attribute]) {
            return "good";
        }
        return "bad";
    }

    function getAttributesFromRoom(attributes, room) {
        return Object.keys(room).filter((k) => attributes.includes(k) && room[k] != false);
    }
    function getAttributesFromRoomString(attributes, room) {
        return getAttributesFromRoom(attributes, room).map((k) => {if (k=="capacity") {return k + ": " + room[k]} else {return k.replace("_", " ")}}).join(", ");
    }

    const roomAttributes = ["capacity", "whiteboard", "tv", "outlets"];
    const environmentAttributes = ["quiet"];
    const locationAttributes = ["food_near"];
</script>

<li class="room" style:--score={String(room.score * 100) + "%"}>
    <div class="room--left">
        {#if room.img}
        <img class="room--image" src={room.img} alt={room.title} />
        {/if}
        <p class="room--link"><a href={room.url}>See webpage</a></p>
    </div>
    <div class="room--right">
        <h3><a href={room.url}>{room.title}</a></h3>
        {#each [["Room", roomAttributes], ["Environment", environmentAttributes], ["Location", locationAttributes]] as [attributeType, attributes]}
        {#if getAttributesFromRoom(attributes, room).length > 0}
        <div class="room--attributes">                
            <div class="room--icon-row">
            {#if !searchActive}
            {#each QueryAttributesOfRoom(query, attributes, room) as attribute}
                <img class={"icon " + judgeRoomAttributeAgainstQuery(query, room, attribute)} title={attribute} src={"/UBC-room-finder/src/assets/icons/" + attribute + ".svg"} alt={attribute}/>
            {/each}
            {/if}
            </div>
            <dt>{attributeType}</dt>
            <dd>{getAttributesFromRoomString(attributes, room)}</dd>
        </div>
        {/if}
        {/each}
    </div>

</li>

<style lang="scss">
    li.room {
        padding-block: 1em;
        border-bottom: 1px solid var(--room-finder-grey-2);
        display: flex;
        gap: 1em;
        //border-left: 2px solid color-mix(in hsl, var(--dotBrightest) var(--score), #ff010175);
        
        .room--left {
            width: 150px;
            flex-shrink: 0;
        }
        .room--image {
            aspect-ratio: 1;
            width: 100%;
            height: auto;
            object-fit: cover;
        }
        .room--link {
            text-decoration: underline;
            color: var(--room-finder-grey-3);
            margin: 0.25em 0;
            font-size: 0.8em;
            text-align: right;
        }
        .room--attributes {
            margin-top: 0.5em;
        }

        h3 {
            margin-block: 0 0.5em;
            font-size: 0.95em;
            font-weight: 700;
        }

        .room--icon-row {
        .icon {
            margin-right: 0.5em;
            height: 1.25em;
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