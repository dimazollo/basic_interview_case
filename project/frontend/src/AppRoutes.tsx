import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { PageLayout } from './common';
import { LoginPage } from './pages';
import { TicketsPage } from './pages/TicketsPage';
import { TicketDetailPage } from './pages/TicketDetailPage';

export const AppRoutes = () => {
  return (
    <Router>
      <PageLayout>
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/ticket/:id" component={TicketDetailPage} />
          <Route path="/tickets" component={TicketsPage} />
        </Switch>
      </PageLayout>
    </Router>
  );
};
