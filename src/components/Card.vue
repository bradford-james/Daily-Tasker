<template>
    <div class="card">
        <div class="card__title">{{ title.toUpperCase() }}</div>
        <div class="card__content">
                <ul class="card__list">
                    <li v-if="!hasListItems"><span style="color:#aaa; font-style:italic;">Click to type...</span></li>
                    <li class="card__bullet-point" :key="items.indexOf(item)" v-for="item of items">{{ item }}</li>
                </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Card',
    props: {
        title: String,
        items: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            hasListItems: (this.items.length > 0)
        }
    }
}
</script>

<style scoped>
.card {
    /* border: solid 1px var(--std-border-color); */
    border-radius: 8px;
    width: 175px;
    min-height: 90px;
    font-size: 12px;
    line-height: 1.6;
}
.card__title {
    font-weight: bold;
    font-size: 14px;
    margin-left: 18px;
    margin-top: 10px;
    color: var(--std-label-color);
}
.card__content {
    margin-top: 5px;
    margin-bottom: 15px;
}
.card__list {
    margin: 0;
}
</style>