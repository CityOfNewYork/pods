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
  iconLib: new IconLib(),
  pointStyle: (feature, resolution) => {
    const zoom = nycOl.TILE_GRID.getZForResolution(resolution)
    const active = feature.getActive()
    const Ops_status = feature.getStatus()
    const icon = feature.get('Icon')
    const radius = facilityStyle.calcRadius(zoom)

    if (icon) {
      return facilityStyle.iconLib.style(icon, radius * 2)
    }

    let fillColor = '#0080A9'

    if (active === 'true') {
      if(Ops_status === 'Open to Public') {
        fillColor = '#19DB17'
      }
      else if (Ops_status === 'Opening Soon') {
        fillColor = '#F3E318'
      }
      else if (Ops_status === 'Closed to Public') {
        fillColor = '#999999'
      }
    }
    
    return new Style({
      image: new Circle({
        fill: new Fill({
          color: fillColor
        }),
        radius: radius,
        stroke: new Stroke({
          width: 1,
          color: '#1A1A1A'
        })
      })
    })
  },
  calcRadius: (zoom) => {
    let radius = 6
    if (zoom > 17) radius = 20
    else if (zoom > 15) radius = 16
    else if (zoom > 13) radius = 12
    else if (zoom > 11) radius = 8
    return radius
  },
  highlightStyle: (feature, resolution) => {
    const zoom = nycOl.TILE_GRID.getZForResolution(resolution)
    const radius = facilityStyle.calcRadius(zoom)
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
      const fontSize = facilityStyle.calcRadius(zoom)
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

  getLabelPositon(feature, zoom) {
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

export default facilityStyle

  