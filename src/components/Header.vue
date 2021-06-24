<template>
    <div class="header">
        <div class="header__title">Today</div>
        <div class="header__daywide-tasks">
            <Task v-for="event of daywideEvents" :key="event.id" :content="event" type="event"/>
        </div>
        <div class="header__selections"></div>
    </div>
</template>

<script>
import Task from '@/components/Task.vue';

export default {
    name: 'Header',
    components: {
        Task
    },
    props: {
        daywideEvents: Array
    }
}
</script>

<style>
.header {
    height: 100px;
    background-color: var(--header-bg-color);
    padding-left: 100px;
    display: flex;
    align-items: center;
}
.header__title {
    color: white;
    font-size: 26px;
    text-transform: uppercase;
    font-weight: bold;
}
.header__daywide-tasks {
    padding-left: 25px;
}
</style>