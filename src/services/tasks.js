const https = require('https')
const querystring = require('querystring')

const token = process.env.VUE_APP_TODOIST_TOKEN
const host = 'api.todoist.com'
const basePath = '/rest/v1'

const options = {
    hostname: host,
    port: 443,
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
}

const taskFilters = {
    tasks: 'today & #Tasks',
    dailys: 'today & #Routines & /Daily',
    routines: 'today & #Routines & !/Daily &!/Reminders',
    projects: 'today & #Projects',
    new: 'today & #Inbox',
    completed: 'today & #Completed',
    all: 'today & (#Tasks | #Inbox | #Projects | #Completed | (#Routines & !/Daily & !/Reminders))'
}

const performRequest = (config, data = '{}') => new Promise((resolve, reject) => {
    const req = https.request(config, res => {
        let data = '';
        res.on('data', chunk => {
            data += chunk
        })
        res.on('end', () => {
            try {
                if(data) {
                    const parsedData = JSON.parse(data)
                    resolve(parsedData)
                } else {
                    resolve()
                }
            } catch (err) {
                reject(err)
            }
        })
    })
    req.on('error', err => console.log(err))
    req.write(data)
    req.end()
})

const getProjectIdByName = async name => {
    const config = {
        ...options, 
        path: `${basePath}/projects`, 
        method: 'GET'
    }
    const sections = await performRequest(config)
    const section = sections.find(sec => sec.name == name)
    return (section) ? section.id : ''
}

const getSections = async () => {
    const config = {
        ...options, 
        path: `${basePath}/sections`, 
        method: 'GET'
    }
    return await performRequest(config)
}


const getTasks = async (type='', isScheduled=false) => {
    const filter = taskFilters[type]
    const params = querystring.stringify({filter})
    const config = {
        ...options, 
        path: `${basePath}/tasks?${params}`, 
        method: 'GET'
    }

    let completedProjId
    if (type=='all') completedProjId = await getProjectIdByName('Completed')

    return (await performRequest(config))
        .filter(task => {
            if (task.due && task.due.datetime) {
                const hasHourAssignment = (new Date(task.due.datetime)).getHours() > 0
                return isScheduled ? hasHourAssignment : !hasHourAssignment 
            } else {
                return !isScheduled
            }
        })
        .map(task => {
            const dateRef = (!task.due) ? null : (task.due.datetime) ? new Date(task.due.datetime) : (task.due.datetime) ? new Date(task.due.date) : null
            return {
                id: task.id, 
                name: task.content.replace(/\*/g, ''), 
                priority: task.priority,
                dateTime: dateRef,
                sectionId: task.section_id,
                projectId: task.project_id,
                isCompleted: (task.project_id == completedProjId)
            }
        })
}


const updateTaskTiming = async (taskID, timing, type='dateTime') => {
    const config = {
        ...options, 
        path: `${basePath}/tasks/${taskID}`, 
        method: 'POST'
    }

    let body
    switch (type) {
        case 'dateTime':
            body = { due_datetime: timing.toISOString() }
            break
        case 'date':
            body = { due_date: timing.toISOString(), due_datetime: null }
            break
        case 'string':
            body = { due_string: timing }
    }
    
    return await performRequest(config, JSON.stringify(body))
}

const updateTaskComplete = async (task, isComplete) => {
    const projectId = await getProjectIdByName('Completed')

    if (projectId) {
        const config = {
            ...options, 
            path: `${basePath}/tasks/${task.id}/${isComplete? 'close' : 'reopen'}`, 
            method: 'POST'
        }
        await performRequest(config)
    
        task.projectId = projectId
        const newTask = await createTask(task)
        return newTask
    }
}

const createTask = async task => {
    const config = {
        ...options, 
        path: `${basePath}/tasks`, 
        method: 'POST'
    }

    const body = {
        content: task.name,
        priority: parseInt(task.priority),
    }
    if (task.dateTime) { 
        body.due_datetime = task.dateTime.toISOString() 
    } else {
        body.due_string = 'today'
    }
    if (task.projectId) body.project_id = task.projectId

    return await performRequest(config, JSON.stringify(body))
}

const deleteTask = async taskID => {
    const config = {
        ...options, 
        path: `${basePath}/tasks/${taskID}`, 
        method: 'DELETE'
    }
    return await performRequest(config)
}

exports.getTasks = getTasks
exports.getSections = getSections
exports.getProjectIdByName = getProjectIdByName
exports.createTask = createTask
exports.updateTaskTiming = updateTaskTiming
exports.updateTaskComplete = updateTaskComplete
exports.deleteTask = deleteTask