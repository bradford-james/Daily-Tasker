const API_KEY = process.env.VUE_APP_GCAL_API_KEY;
const CLIENT_ID = process.env.VUE_APP_GCAL_CLIENT_ID;
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];

let isAuthorized

const initClient = async () => {
    try {
        await window.gapi.client.init({
            api: API_KEY,
            clientId: CLIENT_ID,
            scope: SCOPES,
            discoveryDocs: DISCOVERY_DOCS
        })
        await window.gapi.auth2.getAuthInstance().isSignedIn.listen(isAuthorized)
    } catch (e) {
        console.error(e)
    }
}

const loadEventService = async () => {
    try {
        await window.gapi.load('client:auth2', initClient)
    } catch (e) {
        console.error(e)
    }
}

const logIn = async () => {
    try {
        await window.gapi.auth2.getAuthInstance().signIn()
        const accessToken = await window.gapi.client.getToken()
        process.env.VUE_APP_GAPI_CALENDAR_ACCESS_TOKEN = accessToken
        isAuthorized = true
        return isAuthorized
    } catch (e) {
        console.error(e)
    }
}

const getEvents = async () => {
    try {
        const startTimestamp = new Date()
        startTimestamp.setHours(0)
        startTimestamp.setMinutes(0)
        startTimestamp.setSeconds(0)
        const endTimestamp = new Date()
        endTimestamp.setDate(startTimestamp.getDate() + 1)

        return await window.gapi.client.calendar.events.list({
            calendarId: 'primary',
            timeMax: endTimestamp.toISOString(),
            timeMin: startTimestamp.toISOString()
        })
    } catch(e) {
        console.error(e)
    }
}

exports.loadEventService = loadEventService
exports.logIn = logIn
exports.getEvents = getEvents