import styles from './Notification.module.scss';

export function Notification() {
  // Create some variants that function like an inbox component with specific values for scenarios like
  //    - notification system for the mockDb
  //    - chat system
  //    - user account system notifications
  return (
    <div className={styles['container']}>
      <h1>Welcome to Notification!</h1>
    </div>
  );
}

export default Notification;
