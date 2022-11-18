const actions = ['GET', 'POST', 'DELETE'];

export async function ValidateEvent(event: any) {
    if (!event && !event.body) {
        return {
            statusCode: 422,
            body: 'message: event is not provided or body is empty'
        }
    }

    if (!JSON.parse(event.body).botToken) {
        return {
            statusCode: 422,
            body: 'message: token is missing'
        } 
    }

    if (!JSON.parse(event.body).admin) {
        return {
            statusCode: 422,
            body: 'message: you must specify at least one admin'
        } 
    }
    

    return {
        statusCode: 200,
        body:  'ok'
    }
}
