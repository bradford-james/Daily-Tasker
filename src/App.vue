<template>
    <div id="app">
        <Header :daywideEvents="events"/>
        <div @click="test" style="height: 10px; width: 10px; background-color: black;"></div>
        <div class="dd__meta-row">
            <div class="dd__task-bin-spacer"></div>
            <div class="dd__task-bin-container">
                <TaskBin label="Tasks" type="tasks"/>
                <TaskBin label="Routines" type="routines"/>
                <TaskBin label="Projects" type="projects" :hasSections="true"/>
                <TaskBin label="New Tasks" type="new"/>
            </div>
        </div>
        <div class="dd__meta-row">
            <ScheduleColumn v-for="column of columns" :key="column.id" :column="column" :weather="weatherData"/>
        </div>
        <div v-if="showStatusBins" class="dd__meta-row">
            <StatusBin label="Complete Task" type="complete"/>
            <StatusBin label="Postpone Task" type="postpone"/>
            <StatusBin label="Delete Task" type="delete"/>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue'
import TaskBin from '@/components/TaskBin.vue'
import ScheduleColumn from '@/components/Column.vue'
import StatusBin from '@/components/StatusBin.vue'

import columnData from './assets/testData.json'
import { getHourlyForecast } from './services/weather.js'
import { loadEventService, logIn, getEvents } from './services/events.js'

export default {
    name: 'App',
    components: {
        Header,
        ScheduleColumn,
        TaskBin,
        StatusBin,
    },
    data() {
        return {
            columns: columnData.columns,
            events: columnData.events,
            weatherData: [],
            showStatusBins: false
        }
    },
    async mounted() {
        this.$root.$on('task-drag', show => this.showStatusBins = show)
        this.$root.$on('get-event-data', async () => this.events = await getEvents())
        this.weatherData = await getHourlyForecast()
        await loadEventService()
    },
    methods: {
        async test() {
            if (await logIn) console.log(await getEvents())
        }
    }
}
</script>

<style>
body {
    margin: 0;
}
#app {
    font-family: Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
:root {
    --header-bg-color: #3d8af7;
    --std-txt-color: #606060;
    --std-border-color: #606060;
    --std-routine-border-color: #a7a6a6;
    --std-label-color: #444444;
    --faded-text-color: #aaaaaa;
    --p4-color: #ff5d55;
    --p3-color: #ffa834;
    --p2-color: #75a9f9;
    --p1-color: #7a7a7a;
    --default-priority-color: #7a7a7a;
    --overdue-task-color: #dc4c18;
    --daywide-task-color: #0c59cf;
    --past-due-border-color: #d8d8d8;
    --calendar-blue: #75a9f9;
    --current-timeblock-border-color: #ffe3ae;
    --current-timeblock-bg-color: #fff3db;
    --current-timeblock-highlight-color: #cab6a0;
    --current-timeblock-txt-color: #7b4812;
    --daywide-task-box-shadow: 1px 2px 7px 1px #3074dc;
    --column-border-color: #a8c6fa;
    --column-header-bg-color: #c8e3fd;
    --column-header-text-color: #006e8c;
    --task-factory-grey: #9c9a9a;
}
.dd__meta-row {
    display: flex; 
    margin: 20px 0 30px 55px;
}
.dd__task-bin-container {
    display: flex;
    justify-content: space-between;
    width: 1500px;
}
.dd__task-bin-spacer {
    width: 45px;
}
</style>
