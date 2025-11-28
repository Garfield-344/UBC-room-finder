<script>
import {icon_mapper} from "./iconmapper.js";

let {name, query= $bindable()} = $props();

const valsToState = {
    "-2": "prohibited",
    "-1": "unprefered",
    "0": "undefined",
    "1": "prefered",
    "2": "necessary",
};

let attributeState = $derived(valsToState[String(query[name])]);

function toggle(dir) {
    if (name in query) {
        if (Math.abs(query[name] + dir) < 3) {
            query[name] = query[name] + dir
        }
    } else {
        query[name] = dir;
    }
}
</script>

<div class={"filter " + attributeState}>
    <div class="filter-button-content">
        <img class="filter-icon" title={name} src={icon_mapper[name]} alt={name}/>
        <!--<span class="filter-label">{name}</span>-->
    </div>
    <div class="filter-button--button-container">
        <button class="filter-button-button up" onclick={() => toggle(1)}>
            <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M414 321.94L274.22 158.82a24 24 0 00-36.44 0L98 321.94c-13.34 15.57-2.28 39.62 18.22 39.62h279.6c20.5 0 31.56-24.05 18.18-39.62z"/></svg>
        </button>
        <button class="filter-button-button down" onclick={() => toggle(-1)}>
            <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M98 190.06l139.78 163.12a24 24 0 0036.44 0L414 190.06c13.34-15.57 2.28-39.62-18.22-39.62h-279.6c-20.5 0-31.56 24.05-18.18 39.62z"/></svg>
        </button>
    </div>
</div>

<style lang="scss">
    .filter {
        display: flex;
        gap: 0.5em;
        color: black;

        .filter-button--button-container {
            display: flex;
            flex-direction: column;
        }
        button.filter-button-button {
            padding: 0.25em;
            width: 1.5em;
            border-radius: 0;
            z-index: 20;
            box-shadow: 0 0 0.25em #00000047;
            fill: var(--buttonColour);
        }

        .filter-button-content {
            box-shadow: 0 0 0.25em #00000047;
            z-index: 10;
            border: 2px solid var(--filterColour);
        }

        &.necessary, &.prohibited {
            .filter-button-content {
                background: var(--filterColour);
            }
            .filter-button-button {
                box-shadow: none;
            }
        }

        &.necessary {
            .filter-button-content {
                --filterColour: var(--room-finder-green-2);
            }
            .filter-button-button.up {
                --buttonColour: var(--room-finder-green-1);
                color: transparent;

            }

            .filter-button-button.down {
                --buttonColour: var(--room-finder-green-2);
                z-index: 1;
            }
        }
        &.prohibited {
            .filter-button-content {
                --filterColour: var(--room-finder-red-2);
            }

            .filter-button-button.up {
                --buttonColour: var(--room-finder-red-2);
                z-index: 1;
            }

            .filter-button-button.down {
                --buttonColour: var(--room-finder-red-1);
                color: transparent;
            }
        }

        &.unprefered {
            .filter-button-content {
                --filterColour: var(--room-finder-red-2);
            }

            .filter-button-button.up {
                --buttonColour: var(--room-finder-grey-2);
                box-shadow: none;
                z-index: 1;
            }

            .filter-button-button.down {
                --buttonColour: var(--room-finder-red-1);
            }
        }
        &.prefered {
            .filter-button-content {
                --filterColour: var(--room-finder-green-2);
            }

            .filter-button-button.up {
                --buttonColour: var(--room-finder-green-1);
            }

            .filter-button-button.down {
                --buttonColour: var(--room-finder-grey-2);
                box-shadow: none;
                z-index: 1;
            }
        }

        &.undefined {
            .filter-button-content {
                --filterColour: transparent;
                box-shadow: none;
            }

            .filter-button-button.up {
                --buttonColour: var(--room-finder-green-2);
            }

            .filter-button-button.down {
                --buttonColour: var(--room-finder-red-2);
            }
        }

        .filter-button-button.up {
            border-radius: 1em 1em 0 0;
        }

        .filter-button-button.down {
            border-radius: 0 0 1em 1em;
        }

        > * {
            margin: auto;
        }
        .filter-icon {
            height: 2em;
        }
    }
</style>