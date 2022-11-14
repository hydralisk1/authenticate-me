import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Switch, Route } from 'react-router-dom';
import { signIn } from './store/session'
import { setLanguage } from './store/language';
import { Redirect } from 'react-router-dom';
import MainPage from './components/MainPage'
import HomePage from './components/HomePage';
import LogOut from './components/LogOut';


function App() {
  const dispatch = useDispatch()
  const [loggedIn, setLoggedIn] = useState(false)
  const user = useSelector(state => state.session.user)

  useEffect(() => {
    // language setting
    const language = Cookies.get('language') || 'EN'
    dispatch(setLanguage(language))
    Cookies.set('language', language, { expires: 30 })

    // session setting
    const user = localStorage.getItem('userPersist')

    if(user){
      dispatch(signIn(JSON.parse(user)))
    }
  }, [dispatch])

  useEffect(() =>{
    setLoggedIn(!!user)
  }, [user])

  return (
    <Switch>
      <Route path='/home'>
        {loggedIn ? <HomePage /> : <Redirect to='/' />}
      </Route>
      <Route path='/logout'>
        <LogOut />
      </Route>
      <Route exact path='/'>
        {loggedIn ? <Redirect to='/home' /> : <MainPage />}
      </Route>
    </Switch>
  );
}

export default App;
