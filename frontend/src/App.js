import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Switch, Route } from 'react-router-dom';
import { setLanguage } from './store/language';
import { Redirect } from 'react-router-dom';
import { restoreUser } from './store/session';
import MainPage from './components/MainPage'
import HomePage from './components/HomePage';
import LogOut from './components/LogOut';
import EventDetail from './components/EventDetail';
import GroupDetail from './components/GroupDetail';
import Footer from './components/Footer';

function App() {
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)
  const isLoggedIn = useSelector(state => state.session.isLoggedIn)

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

  return (
    <>
      <Switch>
        <Route path='/events/:eventId'>
          {isLoaded && (isLoggedIn ? <EventDetail /> : <Redirect to='/' />)}
        </Route>
        <Route path='/groups/:groupId'>
          {isLoaded && (isLoggedIn ? <GroupDetail /> : <Redirect to='/' />)}
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
      <Footer />
    </>
  );
}

export default App;
