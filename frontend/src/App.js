import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Switch, Route } from 'react-router-dom';
// import { signIn } from './store/session'
import { setLanguage } from './store/language';
import { Redirect } from 'react-router-dom';
import { restoreUser } from './store/session';
import MainPage from './components/MainPage'
import HomePage from './components/HomePage';
import LogOut from './components/LogOut';
import EventDetails from './components/EventDetails';


function App() {
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)
  const isLoggedIn = useSelector(state => state.session.isLoggedIn)
  // const user = useSelector(state => state.session.user)

  useEffect(() => {
    const language = Cookies.get('language') || 'EN'
    dispatch(setLanguage(language))
    Cookies.set('language', language, { expires: 30 })
    setIsLoaded(false)
    dispatch(restoreUser())
      .then(() => {
        setIsLoaded(true)
      })
  }, [dispatch])

  // useEffect(() => {
  //   setIsLoggedIn(!!user)
  // }, [user])

  // const user = useSelector(state => state.session.user)
  // const [loggedIn, setLoggedIn] = useState(!!user)
  // const [completeSetting, setCompleteSetting] = useState(false)

  // useEffect(() => {
  //   // language settings
  //   setCompleteSetting(false)
  //   const language = Cookies.get('language') || 'EN'
  //   dispatch(setLanguage(language))
  //   Cookies.set('language', language, { expires: 30 })

  //   // session setting
  //   const user = localStorage.getItem('userPersist')

  //   if(user){
  //     dispatch(signIn(JSON.parse(user)))
  //     setLoggedIn(true)
  //   }else{
  //     setLoggedIn(false)
  //   }

  //   setCompleteSetting(true)
  // }, [dispatch])

  // useEffect(() => {
  //   setLoggedIn(!!user)
  // }, [user])

  return (
    <Switch>
      <Route path='/events/:eventId'>
        {isLoaded && (isLoggedIn ? <EventDetails /> : <Redirect to='/' />)}
      </Route>
      <Route path='/home'>
        {isLoaded && (isLoggedIn ? <HomePage /> : <Redirect to='/' />)}
      </Route>
      <Route path='/logout'>
        <LogOut />
      </Route>
      <Route exact path='/'>
        {isLoaded && (isLoggedIn ? <Redirect to='/home' /> : <MainPage />)}
      </Route>
    </Switch>
  );
}

export default App;
