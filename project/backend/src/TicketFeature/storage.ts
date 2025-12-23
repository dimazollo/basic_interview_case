import { randomUUID } from 'crypto';
import { users } from '../UserFeature/storage';
import { TicketEntity, TicketStatus } from './types';

const ticketTitles = [
  'Cannot login to my account',
  'Password reset not working',
  'Application crashes on startup',
  'Page loading very slow',
  'Error message when submitting form',
  'Unable to upload files',
  'Email notifications not received',
  'Dashboard displays incorrect data',
  'Search function returns no results',
  'Payment processing failed',
  'Profile picture not updating',
  'Cannot access admin panel',
  'Mobile app not syncing',
  'Export feature not working',
  'Charts not displaying correctly',
  'Session timeout too short',
  'Unable to delete account',
  'Forgot password link broken',
  'API integration error',
  'Database connection timeout',
  'PDF generation failing',
  'Calendar events not saving',
  'Notification settings not saving',
  'Two-factor authentication issues',
  'Account locked after failed login',
  'Cannot update billing information',
  'Report generation takes too long',
  'Filter options not working',
  'Pagination not functioning',
  'Sort feature broken',
  'Duplicate entries in database',
  'Missing data in export',
  'Import CSV feature error',
  'Backup restore failed',
  'Email verification not sent',
  'Account activation link expired',
  'Cannot change email address',
  'Subscription cancellation not working',
  'Refund request not processed',
  'Invoice download error',
];

const descriptionTemplates = [
  'User reports that {issue}. This started happening {timeframe}. Tried {action} but issue persists.',
  'Customer experiencing {issue}. Error occurs when {trigger}. Urgently needs resolution.',
  'Multiple users reporting {issue}. Appears to be affecting {scope}. Priority fix needed.',
  '{issue} since last update. Users unable to {action}. Business impact is high.',
  'Intermittent issue with {issue}. Happens approximately {frequency}. Logs attached.',
  'Critical: {issue} preventing {action}. Affecting {scope}. Immediate attention required.',
  'User complaint about {issue}. Started after {trigger}. Requesting urgent fix.',
  '{issue} on {platform}. Works fine on other platforms. Browser/device specific issue.',
  'Performance degradation: {issue}. Response time increased significantly. Users frustrated.',
  'Security concern: {issue}. Potential data exposure. Needs immediate investigation.',
];

const issues = [
  'system timeout',
  'data not loading',
  'incorrect calculations',
  'broken links',
  'formatting issues',
  'authentication failures',
  'permission denied errors',
  'connection drops',
  'slow response times',
  'data inconsistencies',
];

const timeframes = [
  'yesterday',
  'this morning',
  'last week',
  'after the latest update',
  '3 days ago',
  'over the weekend',
  'since Monday',
  'for the past hour',
];

const actions = [
  'clearing cache',
  'restarting browser',
  'logging out and back in',
  'using different browser',
  'disabling extensions',
  'updating to latest version',
  'contacting support multiple times',
  'following troubleshooting guide',
];

const triggers = [
  'clicking submit button',
  'navigating to settings page',
  'trying to save changes',
  'uploading large files',
  'accessing reports section',
  'switching between tabs',
  'using search functionality',
  'attempting bulk operations',
];

const scopes = [
  'all users in organization',
  'mobile users only',
  'premium subscribers',
  'users in specific region',
  'enterprise accounts',
  'new signups',
  'admin users',
  'power users',
];

const frequencies = [
  'every 2-3 hours',
  'once per day',
  'multiple times daily',
  'randomly throughout the day',
  'during peak hours',
  'overnight only',
  'on weekends',
  'during business hours',
];

const platforms = [
  'iOS mobile app',
  'Android device',
  'Chrome browser',
  'Safari on Mac',
  'Edge browser',
  'Firefox',
  'mobile web',
  'desktop application',
];

const statuses: TicketStatus[] = ['new', 'in_progress', 'resolved', 'declined'];

const randomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateDescription = (): string => {
  const template = randomElement(descriptionTemplates);
  return template
    .replace('{issue}', randomElement(issues))
    .replace('{timeframe}', randomElement(timeframes))
    .replace('{action}', randomElement(actions))
    .replace('{trigger}', randomElement(triggers))
    .replace('{scope}', randomElement(scopes))
    .replace('{frequency}', randomElement(frequencies))
    .replace('{platform}', randomElement(platforms));
};

const generateTickets = (): TicketEntity[] => {
  const tickets: TicketEntity[] = [];
  const userIds = users.map(u => u.id);

  for (let i = 0; i < 1000; i++) {
    tickets.push({
      id: randomUUID(),
      title: randomElement(ticketTitles),
      description: generateDescription(),
      status: randomElement(statuses),
      assignee: randomElement(userIds),
    });
  }

  return tickets;
};

export const tickets: TicketEntity[] = generateTickets();

export const findTicketsByAssignee = (assigneeId: string): TicketEntity[] => {
  return tickets.filter(ticket => ticket.assignee === assigneeId);
};
