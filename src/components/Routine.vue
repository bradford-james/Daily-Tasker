<template>
    <div :class="className">
        <div class="routine__name"> {{ this.content.name }} </div>
    </div>
</template>

<script>
export default {
    name: 'Routine',
    props: {
        content: Object,
        status: String
    },
    computed: {
        className() {
            return `routine ${this.status}`
        }
    }
}
</script>

<style scoped>
.routine {
    padding: 4px 10px;
    border:  solid 1px var(--std-routine-border-color);
    border-radius: 10px;
    width: fit-content;
    margin: 0 0 3px 3px;
}
.routine.is-past-due {
    border-color: var(--past-due-border-color);
}
.routine.is-current-timeblock {
    border-color: var(--current-timeblock-border-color);
    background-color: white;
}
.routine__name {
    font-size: 11px;
    font-style: normal;
    color: var(--std-txt-color);
}
.routine.is-past-due > .routine__name {
    color: var(--faded-text-color);
    font-style: italic;
}
</style>