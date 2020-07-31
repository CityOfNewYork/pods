import $ from 'jquery'
import facilityStyle from '../src/js/facility-style'
import decorations from '../src/js/decorations'
import pods from '../src/js/pods'
import FinderApp from 'nyc-lib/nyc/ol/FinderApp'
import App from '../src/js/App';
import GeoJson from 'ol/format/GeoJSON'
import CsvPoint from 'nyc-lib/nyc/ol/format/CsvPoint'
import Layer from 'ol/layer/Vector'
import {examplePOD1, examplePOD2, examplePOD3, examplePOD5} from './test-features'
import Basemap from 'nyc-lib/nyc/ol/Basemap'

jest.mock('nyc-lib/nyc/ol/format/CsvPoint')
jest.mock('nyc-lib/nyc/ol/FinderApp')
jest.mock('ol/format/GeoJSON')
jest.mock('ol/layer/Vector')

const mockContent = {
  messages: {
    title: 'app title',
    splash: 'splash content',
    marquee: 'marquee msg',
    description: 'description text',
    pods_url: 'http://pods-endpoint'
  },
  message: (key) => {
    return mockContent.messages[key]
  },
  applyToDom: jest.fn()
}

const addMarquee = App.prototype.addMarquee
const addDescription = App.prototype.addDescription
const addLegend = App.prototype.addLegend
const rearrangeLayers = App.prototype.rearrangeLayers
const addLabels = App.prototype.addLabels
const highlightSite = App.prototype.highlightSite

beforeEach(() => {
  FinderApp.mockClear()
  FinderApp.prototype.map = {getSize: jest.fn().mockImplementation(() => {return 'mock-size'})}
  FinderApp.prototype.view = {fit: jest.fn()}
  GeoJson.mockClear()
  Layer.mockClear()
  App.prototype.addMarquee = jest.fn()
  App.prototype.addDescription = jest.fn()
  App.prototype.addLegend = jest.fn()
  App.prototype.rearrangeLayers = jest.fn()
  App.prototype.addLabels = jest.fn()
  App.prototype.highlightSite = jest.fn()
  mockContent.applyToDom.mockClear()
})

afterEach(() => {
  App.prototype.addMarquee = addMarquee
  App.prototype.addDescription = addDescription
  App.prototype.addLegend = addLegend
  App.prototype.rearrangeLayers = rearrangeLayers
  App.prototype.addLabels = addLabels
  App.prototype.highlightSite = highlightSite
})



describe('constructor', () => {

  test('constructor active  (using provided REST URL)', () => {
    expect.assertions(65)

    mockContent.messages.active = 'true'

    const app = new App(mockContent)

    expect(app instanceof FinderApp).toBe(true)
    expect(FinderApp).toHaveBeenCalledTimes(1)

    expect(FinderApp.mock.calls[0][0].title).toBe('app title')
    expect(FinderApp.mock.calls[0][0].splashOptions.message).toBe('splash content')
    expect(FinderApp.mock.calls[0][0].splashOptions.buttonText).toEqual(['Screen reader instructions', 'View map to find your closest POD Site'])
    expect(FinderApp.mock.calls[0][0].facilityUrl).toBe('http://pods-endpoint')
    
    expect(GeoJson).toHaveBeenCalledTimes(1)
    expect(CsvPoint).toHaveBeenCalledTimes(0)
    expect(GeoJson.mock.calls[0][0].dataProjection).toBe('EPSG:2263')
    expect(GeoJson.mock.calls[0][0].featureProjection).toBe('EPSG:3857')
    expect(FinderApp.mock.calls[0][0].facilityFormat).toBe(GeoJson.mock.instances[0])
    
    expect(FinderApp.mock.calls[0][0].facilityTabTitle).toBe('PODs')
    expect(FinderApp.mock.calls[0][0].facilityStyle).toBe(facilityStyle.pointStyle)
    expect(FinderApp.mock.calls[0][0].facilitySearch.displayField).toBe('search_label')
    expect(FinderApp.mock.calls[0][0].facilitySearch.nameField).toBe('PODSiteName')
    
    expect(FinderApp.mock.calls[0][0].decorations.length).toBe(2)
    expect(FinderApp.mock.calls[0][0].decorations[0].content).toBe(mockContent)
    expect(FinderApp.mock.calls[0][0].decorations[0].facilityStyle).toBe(facilityStyle)
    expect(FinderApp.mock.calls[0][0].decorations[1]).toBe(decorations)

    expect(FinderApp.mock.calls[0][0].geoclientUrl).toBe(pods.GEOCLIENT_URL)
    expect(FinderApp.mock.calls[0][0].directionsUrl).toBe(pods.DIRECTIONS_URL)

    expect(FinderApp.mock.calls[0][0].highlightStyle).toBe(facilityStyle.highlightStyle)

    expect(FinderApp.mock.calls[0][0].filterChoiceOptions.length).toBe(2)
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].title).toBe('Borough')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices.length).toBe(5)

    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[0].name).toBe('Borough')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[0].values).toEqual(['Brooklyn'])
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[0].label).toBe('Brooklyn')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[0].checked).toBe(true)

    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[1].name).toBe('Borough')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[1].values).toEqual(['Bronx'])
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[1].label).toBe('Bronx')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[1].checked).toBe(true)

    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[2].name).toBe('Borough')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[2].values).toEqual(['Queens'])
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[2].label).toBe('Queens')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[2].checked).toBe(true)

    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[3].name).toBe('Borough')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[3].values).toEqual(['Staten Island'])
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[3].label).toBe('Staten Island')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[3].checked).toBe(true)

    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[4].name).toBe('Borough')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[4].values).toEqual(['Manhattan'])
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[4].label).toBe('Manhattan')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[4].checked).toBe(true)

    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[1].title).toBe('Status')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[1].choices.length).toBe(3)

    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[1].choices[0].name).toBe('Ops_status')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[1].choices[0].values).toEqual(['Open to Public'])
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[1].choices[0].label).toBe('Open to Public')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[1].choices[0].checked).toBe(true)

    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[1].choices[1].name).toBe('Ops_status')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[1].choices[1].values).toEqual(['Mobilizing'])
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[1].choices[1].label).toBe('Opening Soon')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[1].choices[1].checked).toBe(true)

    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[1].choices[2].name).toBe('Ops_status')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[1].choices[2].values).toEqual(['Closed to Public', 'Demobilizing', 'Demobilized'])
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[1].choices[2].label).toBe('Closed to Public')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[1].choices[2].checked).toBe(true)
    
    expect(App.prototype.addMarquee).toHaveBeenCalledTimes(1)
    expect(App.prototype.addDescription).toHaveBeenCalledTimes(1)
    expect(App.prototype.addLegend).toHaveBeenCalledTimes(1)
    expect(App.prototype.rearrangeLayers).toHaveBeenCalledTimes(1)
    expect(App.prototype.addLabels).toHaveBeenCalledTimes(1)
    expect(App.prototype.highlightSite).toHaveBeenCalledTimes(1)

  })

  test('constructor not active  (no REST URL provided)', () => {
    expect.assertions(56)

    mockContent.messages.active = 'false'
    mockContent.messages.pods_url = ''

    const app = new App(mockContent)

    expect(app instanceof FinderApp).toBe(true)
    expect(FinderApp).toHaveBeenCalledTimes(1)

    expect(FinderApp.prototype.map.getSize).toHaveBeenCalledTimes(1)
    expect(FinderApp.prototype.view.fit).toHaveBeenCalledTimes(1)
    expect(FinderApp.prototype.view.fit.mock.calls[0][0]).toBe(Basemap.EXTENT)
    expect(FinderApp.prototype.view.fit.mock.calls[0][1]).toEqual({size: 'mock-size', duration: 500})

    expect(FinderApp.mock.calls[0][0].title).toBe('app title')
    expect(FinderApp.mock.calls[0][0].splashOptions.message).toBe('splash content')
    expect(FinderApp.mock.calls[0][0].splashOptions.buttonText).toEqual(['Screen reader instructions', 'View map to find your closest POD Site'])
    expect(FinderApp.mock.calls[0][0].facilityUrl).toBe(pods.FACILITY_CSV_URL)
    
    expect(GeoJson).toHaveBeenCalledTimes(0)
    expect(CsvPoint).toHaveBeenCalledTimes(1)
    expect(CsvPoint.mock.calls[0][0].dataProjection).toBe('EPSG:2263')
    expect(CsvPoint.mock.calls[0][0].x).toBe('x')
    expect(CsvPoint.mock.calls[0][0].y).toBe('y')
    expect(FinderApp.mock.calls[0][0].facilityFormat).toBe(CsvPoint.mock.instances[0])
    
    expect(FinderApp.mock.calls[0][0].facilityTabTitle).toBe('PODs')
    expect(FinderApp.mock.calls[0][0].facilityStyle).toBe(facilityStyle.pointStyle)
    expect(FinderApp.mock.calls[0][0].facilitySearch.displayField).toBe('search_label')
    expect(FinderApp.mock.calls[0][0].facilitySearch.nameField).toBe('PODSiteName')
    
    expect(FinderApp.mock.calls[0][0].decorations.length).toBe(2)
    expect(FinderApp.mock.calls[0][0].decorations[0].content).toBe(mockContent)
    expect(FinderApp.mock.calls[0][0].decorations[0].facilityStyle).toBe(facilityStyle)
    expect(FinderApp.mock.calls[0][0].decorations[1]).toBe(decorations)

    expect(FinderApp.mock.calls[0][0].geoclientUrl).toBe(pods.GEOCLIENT_URL)
    expect(FinderApp.mock.calls[0][0].directionsUrl).toBe(pods.DIRECTIONS_URL)

    expect(FinderApp.mock.calls[0][0].highlightStyle).toBe(facilityStyle.highlightStyle)

    expect(FinderApp.mock.calls[0][0].filterChoiceOptions.length).toBe(1)
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].title).toBe('Borough')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices.length).toBe(5)

    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[0].name).toBe('Borough')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[0].values).toEqual(['Brooklyn'])
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[0].label).toBe('Brooklyn')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[0].checked).toBe(true)

    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[1].name).toBe('Borough')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[1].values).toEqual(['Bronx'])
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[1].label).toBe('Bronx')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[1].checked).toBe(true)

    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[2].name).toBe('Borough')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[2].values).toEqual(['Queens'])
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[2].label).toBe('Queens')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[2].checked).toBe(true)

    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[3].name).toBe('Borough')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[3].values).toEqual(['Staten Island'])
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[3].label).toBe('Staten Island')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[3].checked).toBe(true)

    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[4].name).toBe('Borough')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[4].values).toEqual(['Manhattan'])
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[4].label).toBe('Manhattan')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[4].checked).toBe(true)

    expect(App.prototype.addMarquee).toHaveBeenCalledTimes(1)
    expect(App.prototype.addDescription).toHaveBeenCalledTimes(1)
    expect(App.prototype.addLegend).toHaveBeenCalledTimes(1)
    expect(App.prototype.rearrangeLayers).toHaveBeenCalledTimes(1)
    expect(App.prototype.addLabels).toHaveBeenCalledTimes(1)
    expect(App.prototype.highlightSite).toHaveBeenCalledTimes(1)

  })
})

describe('addMarquee', () => {
  let marquee
  
  beforeEach(() => {
    marquee = $('<div id="marquee"><div><div><div></div></div></div></div>')
    $('body').append(marquee).removeClass('alert')
  })

  afterEach(() => {
    marquee.remove()
  })

  test('addMarquee active', () => {
    expect.assertions(2)

    mockContent.messages.active = 'true'

    const app = new App(mockContent)

    app.addMarquee = addMarquee

    app.addMarquee()

    expect($('#marquee div>div>div').html()).toBe('marquee msg')
    expect($('body').hasClass('alert')).toBe(true)
  })

  test('addMarquee not active', () => {
    expect.assertions(2)

    mockContent.messages.active = 'false'

    const app = new App(mockContent)

    app.addMarquee = addMarquee

    app.addMarquee()

    expect($('#marquee div>div>div').html()).toBe('')
    expect($('body').hasClass('alert')).toBe(false)
  })
})

describe('addDescription', () => {
  let facilityList
  // const description = mockContent.messages.description
  beforeEach(() => {
    facilityList = $('<div id="facilities"><div class="list"></div></div>')
    $('body').append(facilityList)
  })

  afterEach(() => {
    facilityList.remove()
  })

  test('addDescription', () => {
    expect.assertions(4)

    mockContent.messages.active = 'true'

    const app = new App(mockContent)

    app.addDescription = addDescription
    
    expect($('#facilities .list').prev()[0]).toBe(undefined)
    expect($('div.description').length).toBe(0)

    app.addDescription()
    expect($('#facilities .list').prev()[0]).not.toBe(undefined)
    expect($('div.description')).toEqual($('<div class="description"><div class="desc">description text</div></div>'))
  })

  test('addDescription - description false', () => {
    expect.assertions(4)

    mockContent.messages.description = ''

    const app = new App(mockContent)

    app.addDescription = addDescription
    
    expect($('#facilities .list').prev()[0]).toBe(undefined)
    expect($('div.description').length).toBe(0)

    app.addDescription()
    expect($('#facilities .list').prev()[0]).toBe(undefined)
    expect($('div.description').length).toBe(0)
  })
})

describe('rearrangeLayers', () => {
  const setZ = jest.fn()
  const mockMap = {
    getBaseLayers: () => {
      return {
        labels: {
          base: {
            setZIndex: setZ
          }
        }
      }
    }
  }
  const mockLayer = {
    setZIndex: setZ
  }

  beforeEach(() => {
    setZ.mockClear()
  })

  test('rearrangeLayers', () => {
    expect.assertions(3)

    mockContent.messages.active = 'true'

    const app = new App(mockContent)
    app.map = mockMap
    app.layer = mockLayer

    app.rearrangeLayers = rearrangeLayers

    app.rearrangeLayers()

    expect(setZ).toHaveBeenCalledTimes(2)
    expect(setZ.mock.calls[0][0]).toBe(0)
    expect(setZ.mock.calls[1][0]).toBe(1)
  })
})

describe('addLabels', () => {
  const mockMap = {
    addLayer: jest.fn()
  }

  test('addLabels', () => {
    expect.assertions(5)

    mockContent.messages.active = 'true'

    const app = new App(mockContent)
    app.map = mockMap
    app.source = 'mock-source'

    app.addLabels = addLabels

    app.addLabels()

    expect(Layer).toHaveBeenCalledTimes(1)
    expect(Layer.mock.calls[0][0].source).toBe(app.source)
    expect(Layer.mock.calls[0][0].style).toBe(facilityStyle.textStyle)
    expect(Layer.mock.calls[0][0].declutter).toBe(true)
    expect(Layer.mock.calls[0][0].zIndex).toBe(2)
  })
})

describe('highlightSite', () => {
  const mockMap = {
    handlers: {},
    forEachFeatureAtPixel: jest.fn(),
    on: (event, handler) => {
      mockMap.handlers[event] = handler
    },
    trigger: (event) => {
      mockMap.handlers[event]({pixel: 'mock-pixel'})
    }
  }
  let listIt

  beforeEach(() => {
    listIt = $('<div class="lst-it active"></div>')
    $('body').append(listIt)
    mockMap.forEachFeatureAtPixel.mockClear()
  })

  afterEach(() => {
    listIt.remove()
  })

  test('highlightSite', () => {
    expect.assertions(6)

    mockContent.messages.active = 'true'

    const app = new App(mockContent)
    app.map = mockMap

    app.highlightSite = highlightSite

    expect(listIt.hasClass('active')).toBe(true)

    app.highlightSite()

    expect(typeof mockMap.handlers.pointermove).toBe('function')

    mockMap.trigger('pointermove')

    expect(mockMap.forEachFeatureAtPixel).toHaveBeenCalledTimes(1)
    expect(mockMap.forEachFeatureAtPixel.mock.calls[0][0]).toBe('mock-pixel')
    expect(mockMap.forEachFeatureAtPixel.mock.calls[0][1]).toBe(app.highlightListItem)
    expect(listIt.hasClass('active')).toBe(false)
  })
})

describe('highlightListItem', () => {
  let feature1Div, feature2Div

  const feature1 = {
    getId: jest.fn().mockImplementation(() => {
      return 'feature1'
    })
  }
  const feature2 = {
    getId: jest.fn().mockImplementation(() => {
      return 'feature2'
    })
  }

  beforeEach(() => {
    feature1.getId.mockClear()
    feature2.getId.mockClear()
    feature1Div = $('<div class="lst-it"><div class="feature1"></div></div>')
    feature2Div = $('<div class="lst-it"><div class="feature2"></div></div>')
    $('body').append(feature1Div).append(feature2Div)
  })

  afterEach(() => {
    feature1Div.remove()
    feature2Div.remove()
  })

  test('highlightListItem', () => {
    expect.assertions(4)
    mockContent.messages.active = 'true'

    const app = new App(mockContent)
  
    expect($('.feature1').parent().hasClass('active')).toBe(false)
    expect($('.feature2').parent().hasClass('active')).toBe(false)

    app.highlightListItem(feature1)
    expect($('.feature1').parent().hasClass('active')).toBe(true)
    app.highlightListItem(feature2)
    expect($('.feature2').parent().hasClass('active')).toBe(true)
  
  })
})


describe('addLegend', () => {
  let legend
  beforeEach(() => {
    // mockContent.messages.description = 'description text'
    legend = $(pods.LEGEND_HTML)
    legend.css('display', 'none')
    $('body').append(legend)
  })

  afterEach(() => {
    legend.remove()
  })

  test('addLegend - active true', () => {
    expect.assertions(2)
    mockContent.messages.active = 'true'

    const app = new App(mockContent)
    app.addLegend = addLegend

    expect($('.legend').css('display')).toBe('none')

    app.addLegend()
    expect($('.legend').css('display')).toBe('block')

  })

  test('addLegend - active false', () => {
    expect.assertions(2)
    mockContent.messages.active = 'false'

    const app = new App(mockContent)
    app.addLegend = addLegend

    expect($('.legend').css('display')).toBe('none')

    app.addLegend()
    expect($('.legend').css('display')).toBe('none')

  })

})


describe('located', () => {
  const zoomToExtent = App.prototype.zoomToExtent

beforeEach(() => {
  App.prototype.zoomToExtent = jest.fn()
})

afterEach(() => {
  App.prototype.zoomToExtent = zoomToExtent
})

  test('located', () => {
    expect.assertions(6)

    mockContent.messages.active = 'true'

    const app = new App(mockContent)
    const loc = {
      coordinate: 'mock-coordinate'
    }

    app.located(loc)

    expect(FinderApp).toHaveBeenCalledTimes(1)
    expect(FinderApp.mock.instances[0].located).toHaveBeenCalledTimes(1)
    expect(FinderApp.mock.instances[0].located.mock.calls[0][0]).toBe(loc)

    expect(App.prototype.zoomToExtent).toHaveBeenCalledTimes(1)
    expect(App.prototype.zoomToExtent.mock.calls[0][0]).toBe(loc.coordinate)
    expect(App.prototype.zoomToExtent.mock.calls[0][1]).toBe(3)

  })
})

describe('zoomToExtent', () => {
  const mockSource = {
    nearest: jest.fn().mockImplementation((coord, limit) => {
      return [examplePOD1, examplePOD2, examplePOD3, examplePOD5]
    })
  }
  const mockMap = {
    getSize: jest.fn().mockImplementation(() => {
      return 'mock-size'
    })
  }
  const mockView = {
    fit: jest.fn()
  }

  test('zoomToExtent', () => {
    expect.assertions(8)

    mockContent.messages.active = 'true'

    const app = new App(mockContent)
    app.source = mockSource
    app.map = mockMap
    app.view = mockView

    app.zoomToExtent([100, 150], 3)

    expect(mockSource.nearest).toHaveBeenCalledTimes(1)
    expect(mockSource.nearest.mock.calls[0][0]).toEqual([100, 150])
    expect(mockSource.nearest.mock.calls[0][1]).toBe(3)

    expect(mockMap.getSize).toHaveBeenCalledTimes(1)
    expect(mockView.fit).toHaveBeenCalledTimes(1)

    expect(mockView.fit.mock.calls[0][0]).toEqual([100, 0, 300, 200])
    expect(mockView.fit.mock.calls[0][1].size).toBe('mock-size')
    expect(mockView.fit.mock.calls[0][1].duration).toBe(500)

  })
})

describe('zoomTo', () => {
  const mockPopup = {
    hide: jest.fn(),
    showFeature: jest.fn()
  }
  const mockTabs = {
    open: jest.fn()
  }
  const mockMap = {
    handlers: {},
    once: (event, handler) => {
      mockMap.handlers[event] = handler
    },
    trigger: (event) => {
      if (mockMap.handlers[event]) {
        mockMap.handlers[event]({pixel: 'mock-pixel'})
        delete mockMap.handlers[event]
      }
    }
  }
  let tabs

  beforeEach(() => {
    tabs = $('<div id="tabs"><div class="btns"><h2></h2><h2></h2></div></div>')
    $('body').append(tabs)
    mockPopup.hide.mockClear()
    mockPopup.showFeature.mockClear()
    mockTabs.open.mockClear()
    mockMap.handlers = {}
  })

  afterEach(() => {
    tabs.remove()
  })

  test('zoomTo', () => {
    expect.assertions(15)

    mockContent.messages.active = 'true'

    const app = new App(mockContent)
    app.popup = mockPopup
    app.tabs = mockTabs
    app.map = mockMap
    app.zoomToExtent = jest.fn()

    $('#tabs .btns h2:first-of-type').css('display', 'block')
    app.zoomTo(examplePOD1)

    expect(mockPopup.hide).toHaveBeenCalledTimes(1)
    expect(app.zoomToExtent).toHaveBeenCalledTimes(1)
    expect(app.zoomToExtent.mock.calls[0][0]).toEqual([100, 200])
    expect(app.zoomToExtent.mock.calls[0][1]).toBe(4)
    expect(app.tabs.open).toHaveBeenCalledTimes(1)
    expect(app.tabs.open.mock.calls[0][0]).toBe('#map')

    mockMap.trigger('moveend')

    expect(app.popup.showFeature).toHaveBeenCalledTimes(1)
    expect(app.popup.showFeature.mock.calls[0][0]).toBe(examplePOD1)
    
    $('#tabs .btns h2:first-of-type').css('display', 'none')
    app.zoomTo(examplePOD2)

    expect(mockPopup.hide).toHaveBeenCalledTimes(2)
    expect(app.zoomToExtent).toHaveBeenCalledTimes(2)
    expect(app.zoomToExtent.mock.calls[1][0]).toEqual([100, 100])
    expect(app.zoomToExtent.mock.calls[1][1]).toBe(4)
    expect(app.tabs.open).toHaveBeenCalledTimes(1)

    mockMap.trigger('moveend')

    expect(app.popup.showFeature).toHaveBeenCalledTimes(2)
    expect(app.popup.showFeature.mock.calls[1][0]).toBe(examplePOD2)

  })
})

test('ready', () => {
  expect.assertions(5)

  const app = new App(mockContent)
  
  app.remove = ['mock-feature-0', 'mock-feature-1']
  app.source = {
    removeFeature: jest.fn(),
    getFeatures: jest.fn()
  }

  app.ready()

  expect(app.source.removeFeature).toHaveBeenCalledTimes(2)
  expect(app.source.removeFeature.mock.calls[0][0]).toBe('mock-feature-0')
  expect(app.source.removeFeature.mock.calls[1][0]).toBe('mock-feature-1')

  expect(app.source.getFeatures).toHaveBeenCalledTimes(1)
  expect(FinderApp.mock.instances[0].ready).toHaveBeenCalledTimes(1)
})