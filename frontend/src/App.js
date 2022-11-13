import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { Switch, Route } from 'react-router-dom';
import { signIn } from './store/session'
import { setLanguage } from './store/language';
import MainPage from './components/MainPage'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    // language setting
    const language = Cookies.get('language') || 'EN'
    dispatch(setLanguage(language))
    Cookies.set('language', language, { expires: 30 })

    // session setting
    if(Cookies.get('keepLogin') === 'y'){
      const user ={}
      const keys = ['id', 'firstName', 'lastName', 'username', 'email']

      for(const key of keys)
        user[key] = Cookies.get(key)

      dispatch(signIn(user))
    }
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
