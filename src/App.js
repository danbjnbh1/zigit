import { Login } from './components/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { useEffect, useState, createContext } from 'react';
import { Info } from './components/Info';

const tokenContext = createContext();

function App() {
  const [token, setToken] = useState();

  useEffect(() => {
    // Check whether token saved in session storage and update token state if yes
    const storageToken = sessionStorage.getItem('token');
    if (storageToken) {
      setToken(storageToken);
    }
  }, []);

  return (
    <div className="App">
      <tokenContext.Provider value={{ token, setToken }}>
        <Router>
          <Route exact path="/">
            <Login />
          </Route>
          <ProtectedRoute exact path="/info" component={Info} />
        </Router>
      </tokenContext.Provider>
    </div>
  );
}

export default App;
export { tokenContext };
