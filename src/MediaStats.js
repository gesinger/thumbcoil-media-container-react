import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MessageContainer from './MessageContainer';
import { FrameList, FrameInfo } from './Frame.js';

const useStyles = makeStyles((theme) => ({
  mediaStats: {
    height: '100%'
  },
  frameStats: {
    display: 'flex',
    height: '100%'
  },
}));

export default function MediaStats(props) {
  const { packets } = props;
  const styles = useStyles();
  const [currentFrame, setCurrentFrame] = useState(0);

  return (
    <div className={styles.mediaStats}>
      <MessageContainer packets={packets} />
      <div className={styles.frameStats}>
        <FrameList
          selectFrame={setCurrentFrame}
          packets={packets}
          currentFrame={currentFrame}
        />
        <FrameInfo box={packets[currentFrame]} />
      </div>
    </div>
  );
};
