/**
 * @module pods/App
 */

import $ from 'jquery'
import pods from './pods'
import decorations from './decorations'

import Basemap from 'nyc-lib/nyc/ol/Basemap'
import FinderApp from 'nyc-lib/nyc/ol/FinderApp'
import GeoJson from 'ol/format/GeoJSON'
import CsvPoint from 'nyc-lib/nyc/ol/format/CsvPoint'
import facilityStyle from './facility-style'

import {extend as extentExtend} from 'ol/extent'
import Layer from 'ol/layer/Vector'
import Point from 'ol/geom/Point'

class App extends FinderApp {
  /**
   * @desc Create an instance of App
   * @public
   * @constructor
   * @param {module:nyc-lib/nyc/Content~Content} content The POD content
   */
  constructor(content) {
    const active = content.message('active').toLowerCase() === 'true'
    let format
    let url = content.message('pods_url')
    if (url === '') {
      url = pods.FACILITY_CSV_URL
      format = new CsvPoint({
        x: 'x',
        y: 'y',
        dataProjection: 'EPSG:2263'
      })
    } else {
      format = new GeoJson({
        dataProjection: 'EPSG:2263',
        featureProjection: 'EPSG:3857'
      })
    }

    const filters = [{
      title: 'Borough',
      choices: [
        { name: 'Borough', values: ['Brooklyn'], label: 'Brooklyn', checked: true },
        { name: 'Borough', values: ['Bronx'], label: 'Bronx', checked: true },
        { name: 'Borough', values: ['Queens'], label: 'Queens', checked: true },
        { name: 'Borough', values: ['Staten Island'], label: 'Staten Island', checked: true },
        { name: 'Borough', values: ['Manhattan'], label: 'Manhattan', checked: true }
      ]
    }]
    if (active) {
      filters.push({
        title: 'Status',
        choices: [
          { name: 'Ops_status', values: ['Open to Public'], label: 'Open to Public', checked: true },
          { name: 'Ops_status', values: ['Mobilizing'], label: 'Opening Soon', checked: true },
          { name: 'Ops_status', values: ['Closed to Public', 'Demobilizing', 'Demobilized'], label: 'Closed to Public', checked: true }
        ]
      })
    }

    super({
      title: content.message('title'),
      splashOptions: {
        message: content.message('splash'),
        buttonText: ['Screen reader instructions', 'View map to find your closest POD Site']
      },
      facilityUrl: url,
      facilityFormat: format,
      facilityTabTitle: 'PODs',
      facilityStyle: facilityStyle.pointStyle,
      facilitySearch: { displayField: 'search_label', nameField: 'PODSiteName' },
      decorations: [{content, facilityStyle}, decorations],
      filterChoiceOptions: filters,
      geoclientUrl: pods.GEOCLIENT_URL,
      directionsUrl: pods.DIRECTIONS_URL,
      defaultDirectionsMode: 'WALKING',
      highlightStyle: facilityStyle.highlightStyle
    })

    this.active = active

    this.view.fit(Basemap.EXTENT, {
      size: this.map.getSize(),
      duration: 500
    })
    
    this.remove = []
    this.content = content
    this.addMarquee()
    this.addDescription()
    this.addLegend()
    this.rearrangeLayers()
    this.addLabels()
    this.highlightSite()

    $('.srch input').attr('placeholder', 'Search for an address in NYC...')
    content.applyToDom()
  }

  rearrangeLayers() {
    this.map.getBaseLayers().labels.base.setZIndex(0)
    this.layer.setZIndex(1)
  }

  addLabels() {
    this.map.addLayer(
      new Layer({
        source: this.source,
        style: facilityStyle.textStyle,
        declutter: true,
        zIndex: 2
      })
    )
  }

  highlightSite() {
    const highlight = this.highlightListItem
    const map = this.map
    map.on('pointermove', event => {
      $('.lst-it').removeClass('active')
      map.forEachFeatureAtPixel(event.pixel, highlight)
    })
  }

  highlightListItem(feature) {
    $(`.${feature.getId()}`).parent().addClass('active')
  }

  addMarquee() {
    const marquee = this.content.message('marquee')
    if (this.active) {
      $('body').addClass('alert')
      $('#marquee div>div>div').html(marquee)
    }
  }

  addDescription() {
    let list = $('#facilities .list') 
    const description = this.content.message('description')
    if(description) {
      let description = `<div class="description"><div class="desc">${this.content.message('description')}</div></div>`
      $(description).insertBefore(list)
    }
  }

  addLegend() {
    if (this.active) {
      let list = $('#facilities .list') 
      $('.legend').css('display', 'block')
      $('.legend').insertBefore(list)
    }
  }
  
  located(location) {
    super.located(location)
    this.zoomToExtent(location.coordinate, 3)
  }

  zoomToExtent(coord, limit){
    let extent = new Point(coord).getExtent()
    const features = this.source.nearest(coord, limit)
    features.forEach(f => {
      extent = extentExtend(extent, f.getGeometry().getExtent())
    })
    this.view.fit(extent, {size: this.map.getSize(), duration: 500})
  }

  zoomTo(feature) {
    const popup = this.popup
    popup.hide()
    this.map.once('moveend', () => {
      popup.showFeature(feature)
    })
    if ($('#tabs .btns h2:first-of-type').css('display') !== 'none') {
      this.tabs.open('#map')
    }
    this.zoomToExtent(feature.getGeometry().getCoordinates(), 4)
  }

  ready(features) {
    this.remove.forEach(feature => {
      this.source.removeFeature(feature)
    })
    // this.source.allFeatures = this.source.getFeatures()
    super.ready(this.source.getFeatures())
  }
}

export default App