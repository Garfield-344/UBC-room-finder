<script>
let {name, filters} = $props()

function attributeValue() {
    if (name in filters) {
        if (filters[name] == true) {
            return "true";
        } else {
            return "false";
        }
    } else {
        return "undefined";
    }    
}

function toggle() {
    console.log(filters);
    if (name in filters) {
        if (filters[name] == true) {
            filters[name] = false;
            console.log("false");
        } else {
            delete filters[name];
            console.log("removed");
        }
    } else {
        filters[name] = true;
        console.log("true");
    }
    console.log(filters);
}
</script>

<button class={"filter " + attributeValue()} onclick={toggle}>
    {name}
</button>

<style lang="scss">
    button.filter {
        &.true {
            background: green;
        }
        &.false {
            background: red;
        }
        &.undefined {
            background: grey;
        }
    }
</style>