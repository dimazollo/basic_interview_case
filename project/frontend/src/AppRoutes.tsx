import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { PageLayout } from './common';
import { LoginPage } from './pages';

export const AppRoutes = () => {
  return (
    <Router>
      <PageLayout>
        <Switch>
          <Route path="/login" component={LoginPage} />
        </Switch>
      </PageLayout>
    </Router>
  );
};
