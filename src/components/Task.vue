<template>
    <div :class="className">
        <i v-if="this.type == 'event'" class="far fa-calendar-alt"></i>
        <div v-else class="task__priority-icon"></div>
        <div class="task__name" :style="fontSizing"> {{ this.content.name ? this.content.name : 'Error' }} </div>
        <div v-if="this.status" class="task__is-complete">
            <input class="task__checkbox" type="checkbox" :value="this.isCompleted" id="task-checkbox" @change="handleCheckBox()" v-bind:checked="isCompleted">
            <label for="task-checkbox" style="display: none">Task Checkbox</label>
        </div>
    </div>
</template>

<script>
import { updateTaskComplete } from '../services/tasks'
export default {
    name: 'Task',
    props: {
        content: Object,
        type: String,
        status: String
    },
    data() {
        const sized = this.content.name.length > 30 ? 11 : 12
        return {
            isCompleted: this.content.isCompleted,
            fontSizing: `font-size: ${sized}px`,
        }
    },
    computed: {
        className() {
            let className = 'task'
            if (this.content.priority) className +=  ` p${this.content.priority}`
            if (this.status) {
                className += ` ${this.status} ${this.isCompleted?'is-completed':''}`
            } else {
                if (this.type == 'event') className += ' is-daywide'
            }
            return className
        }
    },
    methods: {
        async handleCheckBox() {
            this.isCompleted = !this.isCompleted
            await updateTaskComplete(this.content, this.isCompleted)
        }
    }
}
</script>

<style>
.task {
    display: flex;
    align-items: center;
    border-radius: 5px;
    width: fit-content;
    max-width: 250px;
    padding: 2px 0;
}
.task.is-daywide {
    padding: 9px 12px 10px 9px;
    border-radius: 8px;
    max-width: unset;
    min-width: 120px;
    border: solid 1px var(--daywide-task-color);
    background-color: white;
    box-shadow: var(--daywide-task-box-shadow);
}
.task.is-scheduled,
.task.is-past-due {
    max-width: unset;
    padding: 3px 0;
}
.task.is-current-timeblock {
    margin-bottom: 4px;
    max-width: unset;
    padding: 5px 0;
}
.task.is-scheduled > .task__name,
.task.is-past-due > .task__name,
.task.is-current-timeblock > .task__name {
    width: 194px;
}
.task.is-past-due.is-completed > .task__name {
    font-style: italic;
    font-weight: normal;
    color: var(--faded-text-color);
}
.task.is-past-due > .task__name {
    color: var(--overdue-task-color);
    font-weight: bold;
}
.far.fa-calendar-alt {
    color: var(--calendar-blue);
    margin-left: 8px;
    font-size: 14px;
}
.task.task.is-daywide > .far.fa-calendar-alt {
    font-size: 18px;
    padding-right: 5px;
}
.task__priority-icon {
    background-color: var(--default-priority-color);
    height: 8px;
    width: 8px;
    border-radius: 50%;
    margin-left: 10px;
    margin-right: 2px;
}
.task.p1 > .task__priority-icon {
    background-color: var(--p1-color);  
}
.task.p2 > .task__priority-icon {
    background-color: var(--p2-color);   
}
.task.p3 > .task__priority-icon {
    background-color: var(--p3-color);   
}
.task.p4 > .task__priority-icon {
    background-color: var(--p4-color);   
}
.task.p4 > .task__name {
    font-weight: bold;
}
.task.is-current-timeblock {
    border: solid 1px var(--current-timeblock-border-color);
    background-color: white;
}
.task__name {
    padding-left: 10px;
    padding-right: 12px;
    width: fit-content;
    font-size: 14px;
    color: var(--std-txt-color);
}
.task.is-daywide > .task__name {
    color: var(--daywide-task-color);
    margin-top: 2px;
}
.task__is-complete {
    padding-left: 5px;
    padding-right: 8px;
}
.task__checkbox {
    height: 11px;
    width: 11px;
    border-color: var(--std-border-color);
} 
</style>