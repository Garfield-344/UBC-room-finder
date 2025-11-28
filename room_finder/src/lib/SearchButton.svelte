<script>
    let { searchQuery=$bindable(), searchActive=$bindable() } = $props();

    function expand() {
        searchActive = true;
    }

    function collapse() {
        searchActive = false;
    }
</script>

<div style="display:contents">

    {#if searchActive}

        <div class="search--input-container">
            <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M338.29 338.29L448 448"/></svg>
            <input
                class="expanded"
                bind:value={searchQuery}
                type="text"
                placeholder="e.g. Quiet room at IKB"
            />
        </div>
        <button
            class="collapse"
            onclick={collapse}
            title="Close search"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368L144 144M368 144L144 368"/></svg>

        </button>
    {/if}

    {#if !searchActive}
        <button
                class="collapsed"
                onclick={expand}
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M338.29 338.29L448 448"/></svg> Search
        </button>
    {/if}

</div>

<style>
    .search--input-container {
        padding: 1em;

        display: flex;

        border: 2px solid var(--room-finder-grey-2);
        border-radius: 1em;        
        background: var(--room-finder-grey);

        > * {
            margin-block: auto;
        }

        input {
            margin-right: 1em;

            border-bottom: 1px solid var(--room-finder-grey-2);
            background: transparent;
        }

        svg {
            margin-right: 0.5em;
            color: var(--room-finder-grey-3);
        }
    }
    .expanded {
        width: 200px;
        border: none;
        color: black;
    }
    .collapse {
        padding: 0;
        margin: auto;
        height: 3em;

        border-radius: 100%;
        aspect-ratio: 1;

        background-color: var(--room-finder-grey);
        color: black;
    }
    .collapsed {
        padding-inline: 1em;
        border-radius: 1em;

        background: var(--room-finder-grey);
        color: black;
    }
    svg {
        height: 1.5em;
        vertical-align: bottom;
    }
</style>
