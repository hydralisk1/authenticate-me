import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { Switch, Route } from 'react-router-dom';
import { setLanguage } from './store/language';
import MainPage from './components/MainPage'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const language = Cookies.get('language') || 'EN'
    dispatch(setLanguage(language))
    Cookies.set('language', language, { expires: 30 })
  }, [dispatch])

  return (
    <Switch>
      <Route exact path='/'>
        <MainPage />
      </Route>
    </Switch>
  );
}

export default App;
