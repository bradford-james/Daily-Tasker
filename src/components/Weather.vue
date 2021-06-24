<template>
    <div :class="className">
        <div class="weather__row-1">
            <div class="weather__temp"> {{ this.content.temperature }}<span style="vertical-align: super; font-size: 10px;">o</span></div>
            <img :src="conditionIcon" class="weather__icon">
            <!-- <i v-if="condition == 'cloudy'" class="fas fa-cloud"></i>
            <i v-else-if="condition == 'partly-cloudy-day'" class="fas fa-cloud-sun weather-icon yellow"></i>
            <i v-else-if="condition == 'partly-cloudy-night'" class="fas fa-cloud-moon weather-icon"></i>
            <i v-else-if="condition == 'sunny'" class="fas fa-sun weather-icon yellow"></i>
            <i v-else-if="condition == 'night'" class="fas fa-moon weather-icon"></i>
            <i v-else-if="condition == 'rain'" class="fas fa-cloud-rain weather-icon"></i>
            <i v-else-if="condition == 'storm'" class="fas fa-cloud-showers-heavy weather-icon"></i>
            <i v-else-if="condition == 'freezing'" class="fas fa-snowflake weather-icon"></i> -->
        </div>
        <div v-if="hasChanceOfRain" class="weather__row-2">
            <i class="fas fa-tint blue"></i>
            <div class="weather__precip"> {{ this.content.precipitation }}% </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Weather',
    props: {
        content: Object,
    },
    computed: {
        className() {
            return `weather ${this.content.condition}`
        },
        conditionIcon() {
            return `https:${this.content.icon}`
        },
        hasChanceOfRain() {
            return this.content.precipitation > 0
        }
    },
}
</script>

<style scoped>
.weather {
    margin-left: 5px;
}
.weather__row-1,
.weather__row-2 {
    display: flex;
}
.weather__row-2 {
    margin-left: 25px;
}
.weather__temp {
    color: var(--std-txt-color);
    font-size: 12px;
    margin-right: 5px;
}
.weather__icon {
    height: 30px;
}
.fas.fa-tint {
    font-size: 7px;
}
.weather__precip {
    color: var(--std-txt-color);
    margin-left: 2px;
    font-size: 8px;
}
.yellow {
    color: #fed164;
}
.blue {
    color: #1a73f8;
}
</style>