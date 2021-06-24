<template>
    <div class="task-bin">
        <div v-if="!hasSections" class="task-bin__label"> {{ label }} </div>
        <div v-if="loading">Loading...</div>
        <div v-else :class="`task-bin__tasks-container ${hasSections ? 'section' : ''}`">
            <TaskFactory v-if="type=='new'" @createTask="addNewTask"/>
            <draggable v-if="!hasSections" class="task-bin__tasks" v-model="taskList" group="tasks" @start="startDrag" @end="endDrag" @change="handleDragEvent">
                <Task v-for="task in taskList" :key="task.id" :content="task" type="task"/>
            </draggable>
            <div v-else class="task-bin__section-tasks" v-for="section in sectionTaskList" :key="section.sectionName">
                <div class="task-bin__section-tasks-label"> {{ section.sectionName }} </div>
                <draggable class="task-bin__tasks" v-model="section.tasks" group="tasks" @start="startDrag" @end="endDrag" @change="handleDragEvent">
                    <Task v-for="task in section.tasks" :key="task.id" :content="task" type="task"/>
                </draggable>
            </div>
        </div>
    </div>
</template>

<script>
import Task from '@/components/Task.vue'
import TaskFactory from '@/components/TaskFactory.vue'

import draggable from 'vuedraggable'
import { getTasks, updateTaskTiming, getSections } from '../services/tasks'

export default {
    name: 'TaskBin',
    props: {
        label: String,
        type: String,
        hasSections: {
            type: Boolean,
            default: false
        }
    },
    components: {
        Task,
        TaskFactory,
        draggable
    },
    data() {
        return {
            loading: false,
            taskList: [],
            sectionTaskList: [],
        }
    },
    created() {
        this.init()
    },
    methods: {
        async init() {
            this.loading = true
            this.taskList = (await getTasks(this.type, false)).sort((a,b) => b.priority - a.priority)
            this.loading = false
            if (this.hasSections) {
                const sections = await getSections()
                let tmpArr = []
                for (const task of this.taskList) {
                    const sectionName = (task.sectionId) ? sections.find(sec => sec.id == task.sectionId && sec.project_id == task.projectId).name : 'Other'
                    if (!tmpArr[sectionName]) tmpArr[sectionName] = []
                    tmpArr[sectionName].push(task)
                }
                for (const [sectionName, tasks] of Object.entries(tmpArr)) {
                    this.sectionTaskList.push({sectionName, tasks})
                }
            }
        },
        async handleDragEvent(e) {
            if (e.added) {
                const sourceTask = this.taskList.find(task => task.id = e.added.element.id)
                const d = new Date()
                const dateTime = new Date(d.getFullYear(), d.getMonth(), d.getDate())
                sourceTask.dateTime = dateTime
                await updateTaskTiming(e.added.element.id, 'today', 'string')
                this.taskList = this.taskList.sort((a, b) => b.priority - a.priority)
            }
        },
        addNewTask(task) {
            this.taskList.push(task)
        },
        startDrag() {
            this.$root.$emit('task-drag', true)
        },
        endDrag() {
            this.$root.$emit('task-drag', false)
        }
    }
}
</script>

<style scoped>
.task-bin {
    margin-left: 5px 0;
    padding: 10px 5px;
    max-width: 1200px;
}
.task-bin__label,
.task-bin__section-tasks-label {
    font-weight: bold;
    font-size: 14px;
    color: var(--std-label-color);
    text-transform: uppercase;
    line-height: 1.6;
    margin-bottom: 3px;
    padding-left: 8px;
}
.task-bin__tasks-container.section {
    display: flex
}
.task-bin__section-tasks {
    margin: 0px 5px;
}
</style>