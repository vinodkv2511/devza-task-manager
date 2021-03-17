import client from './client';

export const fetchTasks = (cancelToken) => client.get('/tasks/list', {
    cancelToken: cancelToken.token
});

export const postTaskUpdate = (data) => {

    let parsedData = new FormData();
    for( let key in data) {
        parsedData.append(key, `${data[key]}`);
    }
    return client.post('/tasks/update', parsedData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })   
}


export const postTaskDelete = (data) => {

    let parsedData = new FormData();
    for( let key in data) {
        parsedData.append(key, `${data[key]}`);
    }
    return client.post('/tasks/delete', parsedData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })   
}
