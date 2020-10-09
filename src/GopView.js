import React, { useState } from 'react';
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  HorizontalBarSeries,
  VerticalBarSeries,
  makeWidthFlexible,
  LineSeries,
  MarkSeries,
  Crosshair,
  Hint,
  VerticalRectSeries
} from 'react-vis';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  gopview: {
    position: 'relative'
  },
  /*
  rvCrosshair: {
    position: absolute;
    margin-top: -300px;
  },
  */
  crosshair: {
    '& p': {
      padding: 0,
      margin: 0
    }
  },
  gops: {
    '& rect': {
      rx: '8px',
      ry: '8px'
    }
  }
}));

const FlexibleXYPlot = makeWidthFlexible(XYPlot);

const sliceType = [
  'P',
  'B',
  'I',
  'SP',
  'SI',
  'P',
  'B',
  'I',
  'SP',
  'SI',
];

const sliceTypeColor = [
  '#77b3bb',
  '#b43665',
  '#b1c647',
  '#77b3bb',
  '#b1c647',
  '#77b3bb',
  '#b43665',
  '#b1c647',
  '#77b3bb',
  '#b1c647',
];

export default function GopView(props) {
  const { packets, name } = props;
  const styles = useStyles();
  const [crosshairValues, setCrosshairValues] = useState([]);

  const videoFrames = packets.filter(es => es.type === 'video');

  const largestFrame = videoFrames.reduce((a, b) => Math.max(a, b.data.length), 0);
  const frameGops = videoFrames
    .sort((a, b) => {
      return props.sortDts ? a.dts - b.dts : a.pts - b.pts;
    })
    .reduce((arr, es, index) => {
      let last = arr[arr.length - 1];

      let obj = {
        x0: index,
        x: index + 1, //arr.length,
        y0: 0,
        y: es.data.length,
        color: es.nals.reduce((type, nal) => {
          if (type) return type;
          if (typeof nal.slice_type === 'number') {
            return sliceTypeColor[nal.slice_type];
          }
          return null;
        }, null),
        type:  es.nals.reduce((type, nal) => {
          if (type) return type;
          if (typeof nal.slice_type === 'number') {
            return sliceType[nal.slice_type];
          }
          return null;
        }, null)
      };

      if (!last) {
        last = [obj];
        arr.push(last);
        return arr;
      }

      if (obj.type === 'I') {
        last = [obj];
        arr.push(last);
        return arr;
      }

      last.push(obj);
      return arr;
    }, []);

  const frames = frameGops.reduce((a, b) => a.concat(b), []);
  let offset = 0;
  const gops = frameGops.map((g, i) => {
    const obj = {
      title: 'GOP ' + i,
      color: (g[0].type === 'I' ? '#88CC88' : '#EE8888'),
      y0: 0,
      y: -largestFrame / 20,
      x0: offset,
      x: offset + g.length
    };

    offset += g.length;
    return obj;
  });

  /**
   * Event handler for onNearestX.
   * @param {Object} value Selected value.
   * @param {number} index Index of the series.
   */
  const nearestXHandler = (value, {index}) => {
    setCrosshairValues([frames[index]]);
  }

  /**
   * Event handler for onMouseLeave.
   */
  const mouseLeaveHandler = () => {
    setCrosshairValues([]);
  }

  return (
    <div>
      <FlexibleXYPlot
        className={styles.gopview}
        height={500}
        onMouseLeave={mouseLeaveHandler}
        colorType="literal">
        <VerticalRectSeries
          strokeWidth='1px'
          stroke='#ffffff'
          xAdjust={false}
          onNearestX={nearestXHandler}
          data={frames}/>
        <VerticalRectSeries
          className={styles.gops}
          strokeWidth='1px'
          stroke='#ffffff'
          xAdjust={false}
          data={gops}/>
        <Crosshair
          values={crosshairValues}
          xAdjust={false}>
            <div className={styles.crosshair}>
              <h4>Frame Info</h4>
              <p>Number: {crosshairValues[0] && crosshairValues[0].x}</p>
              <p>Type: {crosshairValues[0] && crosshairValues[0].type}</p>
              <p>Size: {crosshairValues[0] && crosshairValues[0].y + ' bytes'}</p>
            </div>
        </Crosshair>
      </FlexibleXYPlot>
    </div>
  );
};
