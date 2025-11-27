<script>
    let { onSearch = () => {} } = $props();

    let expanded = $state(false);
    let text = $state("");

    function expand() {
        expanded = true;
    }

    function collapse() {
        expanded = false;
        text = "";
    }

    function submit() {
        if (text.trim() === "") {
            // collapse();
        } else if (text.trim()) {
            onSearch(text);
        }
    }
</script>

<div>

    {#if expanded}

        <input
                class="expanded"
                bind:value={text}
                type="text"
                placeholder="e.g. I want a quiet room."
                onkeydown={(e) => e.key === 'Enter' && submit()}
        />
        <button
                onclick={collapse}
        > &lt&lt </button>
    {/if}

    {#if !expanded}
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
