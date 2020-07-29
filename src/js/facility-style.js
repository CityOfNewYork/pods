/**
 * @module pods/facility-style
 */

import Style from 'ol/style/Style'
import nycOl from 'nyc-lib/nyc/ol' 
import IconLib from 'nyc-lib/nyc/ol/style/IconLib'
import Circle from 'ol/style/Circle'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import Text from 'ol/style/Text'

const facilityStyle = {
  INACTIVE_COLOR: '#0080A9',
  ACTIVE_COLORS: {
    'Open to Public': '#19DB17',
    'Opening Soon': '#F3E318',
    'Closed to Public': '#999999'
  },
  CIRCLE_ICON: 'mapbox-maki/circle#fff',
  iconLib: new IconLib(),
  getFillColor: (feature) => {
    let fillColor = facilityStyle.INACTIVE_COLOR
    if (feature.active) {
      fillColor = facilityStyle.ACTIVE_COLORS[feature.getStatus()] || fillColor
    }
    return fillColor
  },
  pointStyle: (feature, resolution) => {
    const zoom = nycOl.TILE_GRID.getZForResolution(resolution)
    const icon = feature.getIcon()
    const radius = facilityStyle.getRadius(zoom)
    return facilityStyle.iconLib.style({
      icon, 
      width: radius * 2, 
      fill: facilityStyle.getFillColor(feature),
      stroke: facilityStyle.getStroke(icon)
    })
  },
  getStroke: (icon) => {
    if (icon === facilityStyle.CIRCLE_ICON) {
      return {width: 1, color: '#000'}
    }
  },
  getRadius: (zoom) => {
    let radius = 6
    if (zoom > 17) radius = 20
    else if (zoom > 15) radius = 16
    else if (zoom > 13) radius = 12
    else if (zoom > 11) radius = 8
    return radius
  },
  highlightStyle: (feature, resolution) => {
    const zoom = nycOl.TILE_GRID.getZForResolution(resolution)
    const radius = facilityStyle.getRadius(zoom)
    return new Style({
      image: new Circle({
        radius: radius * 1.5,
        stroke: new Stroke({
          color: '#58A7FA',
          width: radius
        })
      })
    })
  },
  textStyle: (feature, resolution) => {
    const zoom = nycOl.TILE_GRID.getZForResolution(resolution)
    const pos = facilityStyle.getLabelPositon(feature, zoom)
    let offsetX = 0
    let offsetY = 0
    let textAlign = 'center'
    switch (pos) {
      case 'N': 
        offsetY = -2.5
        break
      case 'S': 
        offsetY = 2.5
        break
      case 'E': 
        offsetX = 1.5
        textAlign = 'left'
        break
      case 'W': 
        offsetX = -1.5
        textAlign = 'right'
        break
    }
    if (zoom > 13) {
      const fontSize = facilityStyle.getRadius(zoom)
      const siteName = facilityStyle.stringDivider(feature.getName(), 24, '\n')
      return new Style({
        text: new Text({
          fill: new Fill({color: '#000'}),
          font: `bold ${fontSize}px sans-serif`,
          text: siteName,
          offsetX: offsetX * fontSize,
          offsetY: offsetY * fontSize,
          textAlign: textAlign,
          stroke: new Stroke({color: 'rgb(254,252,213)', width: fontSize / 2})
        })
      })
    }
  },
  stringDivider: (str, width, spaceReplacer) => {
    if (str.length > width) {
      let p = width
      while (p > 0 && (str[p] != ' ' && str[p] != '-')) {
        p--
      }
      if (p > 0) {
        let left;
        if (str.substring(p, p + 1) == '-') {
          left = str.substring(0, p + 1)
        } else {
          left = str.substring(0, p);
        }
        let right = str.substring(p + 1)
        return left + spaceReplacer + facilityStyle.stringDivider(right, width, spaceReplacer)
      }
    }
    return str
  },
  getLabelPositon: (feature, zoom) => {
    let pos = 'E'
    for (let z = zoom - 14; z >= 0; z--) {
      const p = feature.get('LabelPos').split(' ')[z]
      if (p) {
        pos = p
        break
      }
    }
    return pos
  }
}

facilityStyle.iconLib.on('icon-loaded', () => {
  global.finderApp.source.changed()
})
facilityStyle.iconLib.on('icon-not-found', () => {
  global.finderApp.source.changed()
})

export default facilityStyle

  