import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

const attributes = ['size', 'flags', 'type', 'version'];
const specialProperties = ['boxes', 'nals', 'samples', 'packetCount'];

const isObj = function(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const useStyles = makeStyles((theme) => ({
  frameList: {
    flex: '0 0 200px',
    height: '100%',
    marginRight: '10px',
    paddingRight: '15px',
    overflow: 'auto'
  },
  frameInfo: {
    height: '100%',
    padding: '12px 20px',
    overflow: 'auto',
    flexGrow: 1
  },
  frameInfoType: {
    fontWeight: 'bold',
    color: '#515151',
    fontSize: '24px',
  },
  boxProperties: {
    margin: '24px 0'
  },
  boxProperty: {
    display: 'flex'
  },
  boxPropertyName: {
    flex: '0 0 300px'
  },
  boxPropertyValue: {
    flexGrow: 1
  },
  frameListItem: {
    '&:before': {
      content: '',
      margin: '8px 0',
      width: '10px',
      height: '32px',
      backgroundColor: '#717171',
      position: 'absolute',
      right: 0,
      transition: 'width 0.3s'
    }
  },
  frameListItemActive: {
    '&:before': {
      width: '50px'
    }
  },
  frameListItemVideo: {
    '&:before': {
      backgroundColor: '#b1c647'
    }
  },
  frameListItemAudio: {
    '&:before': {
      backgroundColor: '#b43665'
    }
  },
  frameListItemTypePat: {
    '&:before': {
      backgroundColor: '#77b3bb'
    }
  },
  frameListItemTypePmt: {
    '&:before': {
      backgroundColor: '#77b3bb'
    }
  },
  frameListItemTypeMetadata: {
    '&:before': {
      backgroundColor: '#77b3bb'
    }
  }
}));

export function FrameInfo(props) {
  const { box } = props;
  const styles = useStyles();

  const boxProperties = Object.keys(box).filter((key) => {
    return isObj(box[key]) || (Array.isArray(box[key]) && isObj(box[key][0]));
  });
  const exclusions = attributes.concat(specialProperties).concat(boxProperties);

  const subProperties = Object.keys(box).filter((key) => {
    return exclusions.indexOf(key) === -1;
  }).map((key, index) => {
    return (
      <div className={styles.boxProperty} key={index}>
        <div className={styles.boxPropertyName}>{key.toString()}</div>
        <div className={styles.boxPropertyValue}>{box[key].toString()}</div>
      </div>
    );
  });

  const subBoxes = [];

  if (box.boxes && box.boxes.length) {
    box.boxes.forEach((subBox, index) => {
      subBoxes.push(<FrameInfo box={subBox} key={index} />);
    });
  } else if (boxProperties.length) {
    boxProperties.forEach((key, index) => {
      if (Array.isArray(box[key])) {
        let subBox = {
          type: key,
          boxes: box[key],
          size: box[key].size
        };

        subBoxes.push(<FrameInfo box={subBox} key={index} />);
      } else {
        subBoxes.push(<FrameInfo box={box[key]} key={index} />);
      }
    });
  }

  return (
    <div className={styles.frameInfo}>
      <div className={styles.frameInfoType}>{props.box.type}</div>
      {subProperties.length ?
        (<div className={styles.boxProperties}>
          {subProperties}
        </div>) : null
      }
      {subBoxes.length ?
        (<div>
          {subBoxes}
        </div>) : null
      }
    </div>
  );
};

export function FrameListItem(props) {
  const { selectFrame, type, index, active } = props;
  const styles = useStyles();

  const handleClick = () => {
    selectFrame(index);
  }

  const classes = [styles.frameListItem, `frameListItemType${capitalize(type)}`];

  if (active) {
    classes.push(styles.frameListItemActive);
  }

  return (
    <ListItem
      className={classes.join(' ')}
      onClick={handleClick}
    >
      {type}
    </ListItem>
  );
};

export function FrameList(props) {
  const { packets, selectFrame, currentFrame } = props;
  const styles = useStyles();

  const frames = packets.map((packet, index) => {
    return (
      <FrameListItem
        type={packet.type}
        key={index}
        index={index}
        selectFrame={selectFrame}
        active={index === currentFrame}
      />
    );
  });

  return (
    <div className={styles.frameList}>
      <List>{frames}</List>
    </div>
  );
};

export default {
  FrameList,
  FrameInfo
};
