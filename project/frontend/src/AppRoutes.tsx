import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { PageLayout } from './common';
import { LoginPage } from './pages';
import {TicketsPage} from "./pages/TicketsPage";

export const AppRoutes = () => {
  return (
    <Router>
      <PageLayout>
        <Switch>
          <Route path="/login" component={LoginPage} />
            <Route path="/tickets" component={TicketsPage} />
        </Switch>
      </PageLayout>
    </Router>
  );
};
