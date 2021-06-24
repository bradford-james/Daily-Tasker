<template>
    <div :class="className">
        <div class="timeblock__weather-comp">
            <Weather :content="timeblockWeather"/>
        </div>
        <div class="timeblock__schedule-comp">
            <div class="timeblock__title">
                <div class="timeblock__title-time"> {{ fmtTime }} </div>
                <div v-if="status=='is-current-timeblock'" class="timeblock__title-time-line"></div>
            </div>
            <div v-if="hasRoutines" class="timeblock__routines">
                <div class="timeblock__routines-symbol">R</div>
                <Routine v-for="routine of timeblockRoutines" :key="routine.id" :content="routine" :status="status"/>
            </div>
            <div class="timeblock__tasks">
                <draggable v-model="timeblockTasks" group="tasks" @start="startDrag" @end="endDrag" @change="handleDragEvent">
                    <Task v-for="task of timeblockTasks" :key="task.id" :content="task" type="task" :status="status"/>
                </draggable>
            </div>
        </div>
    </div>
</template>

<script>
import Routine from '@/components/Routine.vue';
import Task from '@/components/Task.vue';
import Weather from '@/components/Weather.vue';

import draggable from 'vuedraggable'
import { updateTaskTiming } from '../services/tasks'

export default {
    name: 'TimeBlock',
    components: {
        Routine,
        Task,
        Weather,
        draggable
    },
    props: {
        routines: Array,
        tasks: Array,
        weather: Array,
        time: Number
    },
    data() {
        const currentHour = (new Date()).getHours()      
        return {
            timeblockRoutines: [],
            timeblockTasks: [],
            timeblockWeather: [],
            hasRoutines: false,
            status: (this.time === currentHour) ? 'is-current-timeblock' : (this.time < currentHour) ? 'is-past-due' : 'is-scheduled',
            currentHour: currentHour
        }
    },
    computed: {
        className() {
            return `timeblock ${this.status}`
        },
        fmtTime() {
            if (!(this.time > 0)) return ''
            let adjTime, suffix
            if (this.time>=12) {
                adjTime = this.time - 12
                suffix = 'PM'
            } else {
                adjTime = this.time
                suffix = 'AM'
            }
            if (adjTime == 0) adjTime = 12
            return `${adjTime}:00${suffix}`
        }
    },
    methods: {
        handleDragEvent(e) {
            if (e.added) {
                const sourceTask = this.timeblockTasks.find(task => task.id == e.added.element.id)

                const dateTime = new Date()
                dateTime.setHours(this.time)
                dateTime.setMinutes(0)
                dateTime.setSeconds(0)

                sourceTask.dateTime = dateTime
                updateTaskTiming(e.added.element.id, dateTime)
            }
        },
        startDrag() {
            this.$root.$emit('task-drag', true)
        },
        endDrag() {
            this.$root.$emit('task-drag', false)
        }
    },
    watch: {
        routines: function(newVal) {
            this.timeblockRoutines = newVal.filter(routine => routine.dateTime.getHours() == this.time)
            this.hasRoutines = (this.timeblockRoutines) ? (this.timeblockRoutines.length > 0) : false
        },
        tasks: function(newVal) {
            this.timeblockTasks = newVal.filter(task => (task.dateTime) ? task.dateTime.getHours() == this.time : false)
        },
        weather: function(newVal) {
            const result = newVal.filter(weather => (weather.dateTime) ? weather.dateTime.getHours() == this.time : false)
            if (result.length == 1) this.timeblockWeather = result[0]
        }
    }
}
</script>

<style>
.timeblock {
    display: flex;
}
.timeblock__weather-comp {
    margin-top: 5px;
    margin-right: 8px;
}
.timeblock__schedule-comp {
    width: fit-content;
    min-width: 270px;
    min-height: 60px;
    border-radius: 8px;
    padding: 5px 7px 6px 7px;
}
.timeblock.is-current-timeblock .timeblock__schedule-comp {
    background-color: var(--current-timeblock-bg-color);
    padding-top: 8px;
    margin-bottom: 8px;
}
.timeblock__title,
.timeblock__routines {
    display: flex;
}
.timeblock__title {
    margin-bottom: 8px;
    margin-left: 2px;
}
.timeblock__routines {
    margin-bottom: 6px;
    max-width: 300px;
    flex-wrap: wrap;
}
.timeblock.is-past-due .timeblock__title-time {
    color: var(--faded-text-color);
}
.timeblock__title-time {
    font-size: 11px;
    font-weight: bold;
    color: var(--std-txt-color);
}
.timeblock.is-current-timeblock .timeblock__title-time {
    color: var(--current-timeblock-txt-color);
}
.timeblock__title-time-line {
    margin: 4px 12px 0px 12px;
    border-bottom: solid 1px var(--current-timeblock-highlight-color);
    height: 2px;
    width: 100%;
}
.timeblock__routines-symbol {
    font-weight: bold;
    font-size: 14px;
    margin: 2px 8px 0px 10px;
}
.timeblock.is-past-due .timeblock__routines-symbol {
    color: var(--faded-text-color);
}
</style>