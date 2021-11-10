import React, { useEffect } from 'react';
import {
  useLocation,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import Landing from './features/home/Landing';
import Home from './features/home/Home';
import PreferencesHandler from './features/preferences/PreferencesHandler';
import { useDispatch } from 'react-redux';
import { getCvAsync } from './features/cv/cvSlice';
import i18n from './translations/i18n';

const baseRouteUrl = "/:lang(fr|en)";
export const baseUrl = `/${i18n.language}`;

function App() {

  const location = useLocation();
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getCvAsync())
  }, [dispatch])

  
  return (
    <div lang="">
      <PreferencesHandler/>
      <TransitionGroup>
        <CSSTransition
          timeout={300}
          classNames='fade'
          key={"id"}
        >
          <Switch location={location}>
            <Route exact path="/"><Redirect to="/en" /></Route>
            <Route exact path={`${baseRouteUrl}`} render={props => (
              <Redirect to={`${props.match.params.lang}/home/`} />)} />
            <Route path={`${baseRouteUrl}/landing`} exact={true} component={Landing} />
            <Route path={`${baseRouteUrl}/home`} component={Home} />
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
}

export default App;
