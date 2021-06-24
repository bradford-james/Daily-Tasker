<template>
    <div class="task-bin__new-task" @click="initTaskFactory">
        <i v-if="!showTaskFactory" class="new-task-icon fas fa-plus"></i>
        <div v-else class="task-bin__task-factory-container">
            <select name="priority" id="priority" class="task-bin__i-task-priority" v-model="newTask.priority">
                <option value="1" selected>1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            </select>
            <input type="text" class="task-bin__i-task-name" v-model="newTask.name" @keyup="doSubmitClick" placeholder="Task Name">
            <button class="task-bin__i-submit" @click="handleCreateTask">Create</button>
        </div>
    </div>
</template>

<script>
import { createTask } from '../services/tasks'

export default {
    name: 'TaskFactory',
    props: {},
    data() {
        return {
            showTaskFactory: false,
            newTask: {name: '', priority: 1}
        }
    },
    methods: {
        initTaskFactory(initEvent) {
            this.showTaskFactory = true

            const resetTaskFactory = nextEvent => {
                if (!initEvent.target.contains(nextEvent.target)) {
                    this.showTaskFactory = false
                    document.removeEventListener('click', resetTaskFactory)
                }
            }
            document.addEventListener('click', resetTaskFactory)
        },
        async handleCreateTask() {
            const newTask = {
                name: this.newTask.name,
                priority: this.newTask.priority
            }
            const newTaskID = await createTask(newTask)
            this.$emit('createTask', {
                id: newTaskID.id,
                ...newTask
            })
            this.newTask.name = ''
            this.newTask.priority = 1
        },
        doSubmitClick(e) {
            if (e.keyCode == 13) this.handleCreateTask()
        }
    }
}
</script>

<style>
.task-bin__new-task {
    margin: 5px 0px; 
    width: 300px; 
    border: dashed 1px var(--task-factory-grey);
    border-radius: 5px;
    padding: 5px 0;
    min-height: 25px;
}
.new-task-icon {
    color: var(--task-factory-grey);
    font-size: 11px;
    width: 100%;
    text-align: center;
    margin-top: 7px;
}
.task-bin__task-factory-container {
    display: flex;
    justify-content: space-evenly;
}
.task-bin__i-task-priority {
    border: none;
    border-radius: 5px;
    color: var(--std-txt-color);
}
.task-bin__i-task-name,
.task-bin__i-task-name:focus-visible {
    border-top: none;
    border-left: none;
    border-right: none;
    border-bottom: solid 1px var(--task-factory-grey);
    border-radius: 0;
    font-size: 12px;
    outline: none;
}
.task-bin__i-submit {
    background-color: white;
    border-radius: 5px;
    border: solid 2px var(--task-factory-grey);
    padding: 3px 10px;
    color: var(--std-txt-color);
}
</style>