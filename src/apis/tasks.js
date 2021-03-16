import client from './client';

export const fetchTasks = (cancelToken) => client.get('/tasks/list', {
    cancelToken: cancelToken.token
});
