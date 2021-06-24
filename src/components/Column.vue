<template>
    <div class="column">
        <div class="column__header">
            <div class="column__header-title"> {{ this.column.title }} </div>
        </div>
        <div class="column__content">
            <TimeBlock v-for="time of column.timeblocks" :key="time" :time="time" :tasks="tasks" :routines="routines" :weather="weather"/>      
        </div>
    </div>
</template>

<script>
import { getTasks } from '../services/tasks'

export default {
    name: 'Column',
    components: {
        TimeBlock: () => import('@/components/TimeBlock.vue')
    },
    props: {
        column: Object,
        weather: Array
    },
    data() {
        return {
            routines: [],
            tasks: []
        }
    },
    created() {
        this.init()
    },
    methods: {
        async init() {
            this.routines = await getTasks('dailys', true)
            this.tasks = await getTasks('all', true)
        }
    }
}
</script>

<style scoped>
.column {
    border: solid 1px var(--column-border-color);
    border-radius: 8px;
    min-width: 380px;
    margin-right: 20px;
    padding-bottom: 40px;
}
.column__header {
    height: 40px;
    background-color: var(--column-header-bg-color);
    display: flex;
    align-items: center;
    border-radius: 8px 8px 0 0;
    border-bottom: solid 1px var(--column-border-color);
}
.column__header-title {
    color: var(--column-header-text-color);
    text-transform: uppercase;
    font-weight: bold;
    font-size: 14px;
    padding-left: 50px;
}
.column__content {
    padding: 25px 20px 0 15px;
}
</style>