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

        <input
                class="expanded"
                bind:value={searchQuery}
                type="text"
                placeholder="e.g. Quiet room at IKB"
        />
        <button
                onclick={collapse}
        > &lt&lt </button>
    {/if}

    {#if !searchActive}
        <button
                class="collapsed"
                onclick={expand}
        >
            Search >>
        </button>
    {/if}

</div>

<style>
    .expanded {
        width: 200px;
        height: 40px;
        border-radius: 10px;
        border: none;
        text-align: center;
        margin:5px;

    }

    .collapsed {
        border-radius: 10px;
        margin: 5px;
    }
</style>
