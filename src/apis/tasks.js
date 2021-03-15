import client from './client';

export const fetchTasks = () => client.get('/tasks/list');
