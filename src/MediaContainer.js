import React, { useState } from 'react';
import thumbcoil from 'thumbcoil';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Box from '@material-ui/core/Box';
import MediaStats from './MediaStats';
import GopView from './GopView';

const useStyles = makeStyles((theme) => ({
  mediaContainer: {
    width: '100%',
    // overflow: 'hidden',
    '& div': {
      height: '100%'
    }
  },
  tab: {
    backgroundColor: '#eee',
    height: '50px'
  }
}));

const TabPanel = (props) => {
  const { children, selectedIndex, index, ...other } = props;

  return (
    <div
      hidden={selectedIndex !== index}
      {...other}
    >
      {selectedIndex === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
};

const parse = (name, bytes) => {
  if (!bytes) {
    return null;
  }

  if (!(/\.ts/i.test(name))) {
    // only parse ts segments for now
    return null;
  }

  return thumbcoil.tsInspector.inspect(bytes);
};

export default function MediaContainer(props) {
  const { name, bytes } = props;
  const parsed = parse(name, bytes);
  const styles = useStyles();
  const [selectedToolIndex, setSelectedToolIndex] = useState(0);

  if (!bytes) {
    return null;
  }

  const handleChange = (event, index) => {
    setSelectedToolIndex(index);
  };

  return (
    <div className={styles.mediaContainer}>
      <Tabs onChange={handleChange} value={selectedToolIndex} >
        <Tab className={styles.tab} label="Overview" key={0} />
        <Tab className={styles.tab} label="Gop Structure" key={1} />
      </Tabs>
      <div>
        <TabPanel
          selectedIndex={selectedToolIndex}
          index={0}
        >
          <MediaStats packets={parsed.esMap} />
        </TabPanel>
        <TabPanel
          selectedIndex={selectedToolIndex}
          index={1}
        >
          <GopView name={name} packets={parsed.esMap} />
        </TabPanel>
      </div>
    </div>
  );
};
