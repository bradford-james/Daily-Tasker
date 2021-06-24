const https = require('https')
const querystring = require('querystring')

const key = process.env.VUE_APP_WEATHER_TOKEN
const host = 'api.weatherapi.com'
const basePath = 'v1'

const params = querystring.stringify({
    key: key,
    q: 78645,
    aqi: 'no',
    alerts: 'no'
})

const fullPath = `/${basePath}/forecast.json?${params}`
const options = {
    hostname: host,
    path: fullPath,
    port: 443
}

const performGetReqest = (config) => {
    return new Promise((resolve, reject) => {
        https.get(config, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk
            })
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(data)
                    resolve(parsedData)
                } catch (err) {
                    reject(err)
                }
            })
        })
        .on('error', (err) => {
            console.log(err)
        })
        .end()
    })
}

const getHourlyForecast = async () => {
    const config = {...options}
    const { forecast: { forecastday } } = await performGetReqest(config)
    return forecastday[0].hour.map(hr => ({
        "id": hr.time_epoch,
        "dateTime": new Date(hr.time_epoch * 1000),
        "condition": hr.condition.text,
        "icon": hr.condition.icon,
        "temperature": Math.round(hr.temp_f),
        "precipitation": hr.chance_of_rain
    }))
    
        
}

exports.getHourlyForecast = getHourlyForecast