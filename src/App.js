import { 
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query'


import './App.scss';
import Tasks from './containers/tasks/tasks';

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/"> <Redirect to="/tasks" /> </Route>  
            <Route exact path="/tasks">
              <Tasks />
            </Route>
          </Switch>    
        </Router>
      </div>
    </QueryClientProvider>
  );
}

export default App;
