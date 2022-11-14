import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { Switch, Route } from 'react-router-dom';
import { signIn } from './store/session'
import { setLanguage } from './store/language';
import MainPage from './components/MainPage'
import TopMenuLayout from './components/MainPage/TopMenuLayout';

function App() {
  const dispatch = useDispatch()

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

  return (
    <>
      <TopMenuLayout />
      <Switch>
        <Route exact path='/'>
          <MainPage />
        </Route>
      </Switch>
    </>
  );
}

export default App;
