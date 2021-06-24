<template>
    <div class="status-bin">
        <draggable class="status-bin__tasks-container" group="tasks" v-model="tasks" @change="handleDragEvent"></draggable>
        <div class="status-bin__label"> {{ this.label }} </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import { updateTaskComplete, updateTaskTiming, deleteTask } from '../services/tasks'

export default {
    name: 'StatusBin',
    props: {
        label: String,
        type: String
    },
    data() {
        return {
            tasks: []
        }
    },
    components: {
        draggable
    },
    methods: {
        handleDragEvent(e) {
            if (e.added) {
                const sourceTask = this.tasks.find(task => task.id = e.added.element.id)
                if (this.type == 'complete') updateTaskComplete(sourceTask.id, true)
                if (this.type == 'postpone') updateTaskTiming(sourceTask.id, 'tomorrow', 'string')
                if (this.type == 'delete') deleteTask(sourceTask.id)
            }
        }
    }
}
</script>

<style scoped>
.status-bin__tasks-container {
    border: dashed 1px var(--faded-text-color);
    height: 150px;
    width: 529px;
    border-radius: 5px;
    align-items: center;
}
.status-bin__label {
    color: var(--faded-text-color);
    font-size: 40px;
    font-weight: bold;
    position: relative;
    top: -95px;
    width: 100%;
    text-align: center;
}
</style>