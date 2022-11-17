import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Switch, Route } from 'react-router-dom';
import { setLanguage } from './store/language';
import { Redirect } from 'react-router-dom';
import { restoreUser, getMyGroups, getGroups } from './store/session';
import MainPage from './components/MainPage'
import HomePage from './components/HomePage';
import LogOut from './components/LogOut';
import EventDetail from './components/EventDetail';
import GroupDetail from './components/GroupDetail';
import CreateGroup from './components/CreateGroup';
import MyGroup from './components/MyGroup';
import GroupSetting from './components/GroupSetting'
import GroupRemove from './components/GroupRemove';

function App() {
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)
  const isLoggedIn = useSelector(state => state.session.isLoggedIn)
  const user = useSelector(state => state.session.user)

  useEffect(() => {
    const language = Cookies.get('language') || 'EN'
    dispatch(setLanguage(language))
    Cookies.set('language', language, { expires: 30 })
    setIsLoaded(false)

    if(!isLoggedIn)
      dispatch(restoreUser())
        .then(() => {setIsLoaded(true)})
  }, [dispatch])

  useEffect(() => {
    if(isLoggedIn){
      const groups = Cookies.get('groups')
      if(groups === undefined) dispatch(getMyGroups(user.id))
      else dispatch(getGroups(JSON.parse(groups)))
    }
  }, [isLoggedIn, user, dispatch])

  return (
    <>
      <Switch>
        <Route path='/events/:eventId'>
          {isLoaded && (isLoggedIn ? <EventDetail /> : <Redirect to='/' />)}
        </Route>
        <Route exact path='/groups/new'>
          {isLoaded && (isLoggedIn ? <CreateGroup /> : <Redirect to='/' />)}
        </Route>
        <Route path = '/groups/:groupId/close'>
          {isLoaded && (isLoggedIn ? <GroupRemove /> : <Redirect to='/' />)}
        </Route>
        <Route path = '/groups/:groupId/settings'>
        {isLoaded && (isLoggedIn ? <GroupSetting /> : <Redirect to='/' />)}
        </Route>
        <Route path='/groups/:groupId'>
          {isLoaded && (isLoggedIn ? <GroupDetail /> : <Redirect to='/' />)}
        </Route>
        <Route path='/groups'>
          {isLoaded && (isLoggedIn ? <MyGroup /> : <Redirect to='/' />)}
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
    </>
  );
}

export default App;
