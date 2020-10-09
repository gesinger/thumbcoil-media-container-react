import React from 'react';
import thumbcoil from 'thumbcoil';
import { makeStyles } from '@material-ui/core/styles';
import WarningIcon from '@material-ui/icons/warning';
import ErrorIcon from '@material-ui/icons/error';

const useStyles = makeStyles((theme) => ({
  list: {
    listStyleType: 'none'
  },
  error: {
    color: '#f44336'
  },
  warning: {
    color: '#ff9900'
  }
}));

export default function MessageContainer(props) {
  const { packets } = props;
  const styles = useStyles();
  const validationResults = thumbcoil.validateContainers(packets);

  const messageList = (messages, type) => {
    if (messages.length === 0) {
      return null;
    }

    const icon =
      type === 'error' ?
        <ErrorIcon className={styles.error} /> :
        type === 'warning' ? <WarningIcon className={styles.warning} /> : null;

    return (
      <div className="message-container">
        <ul>
        {messages.map((message) => {
          return <li key={message}>{icon} {message}</li>
        })}
        </ul>
      </div>
    );
  };

  if (!validationResults) {
    return null;
  }

  if (validationResults.warnings === 0 && validationResults.errors === 0) {
    return null;
  }

  const warningsRender = messageList(validationResults.warnings, 'warning');
  const errorsRender = messageList(validationResults.errors, 'error');

  return (
    <div className={styles.list}>
      {warningsRender}
      {errorsRender}
    </div>
  );
};
