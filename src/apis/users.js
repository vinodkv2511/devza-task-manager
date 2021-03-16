import client from './client';

export const fetchUsers = (cancelToken) => client.get('/tasks/listusers', {
    cancelToken: cancelToken.token
});
