import decorations from '../src/js/decorations'
import OlFeature from 'ol/Feature'
import {mockApp, examplePOD1, examplePOD2, examplePOD3, examplePOD4, examplePOD6, icon} from './test-features'
import nyc from 'nyc-lib/nyc'
import pods from '../src/js/pods'
import facilityStyle from '../src/js/facility-style'
import Style from 'ol/style/Style'
import Icon from 'ol/style/Icon'

let container, extendedDecorations
beforeEach(() => {
  $.resetMocks()
  container = $('<div></div>')
  $('body').append(container)
  extendedDecorations = {
    addressHtml() {
      return '<p>An Address</p>'
    },
    distanceHtml(screen) {
      return (screen ? '<p>screen</p>' : '<p>A Distance</p>')
    },
    mapButton() {
      return '<p>Map</p>'
    },
    directionsButton() {
      return '<p>Directions</p>'
    },
    handleOver() {
      return 'over'
    },
    handleOut() {
      return 'out'
    },
    app: {
      remove: []
    }
  }
  $.extend(examplePOD1, extendedDecorations)
  $.extend(examplePOD4, extendedDecorations)
  
})
afterEach(() => {
  container.remove()
  jest.resetModules()
})

describe('extendFeature', () => {
  beforeEach(() => {
    examplePOD1.content.messages.active = 'true'
    examplePOD1.set('ActivePOD', '1')
    examplePOD1.set('Ops_status', 'Closed to Public')
    examplePOD1.app.remove = []
  })
  afterEach(() => {
    examplePOD1.content.messages.active = 'true'
    examplePOD1.set('ActivePOD', '1')
    examplePOD1.set('Ops_status', 'Closed to Public')
    examplePOD1.app.remove = []
  })

  test('extendFeature ActivePOD=1 active=true', () => {
    expect.assertions(5)

    examplePOD1.extendFeature()
    expect(examplePOD1.active).toBe(true)
    expect(examplePOD1.getId()).toBe(examplePOD1.get('DOECode'))
    expect(examplePOD1.get('search_label')).not.toBeNull()
    expect(examplePOD1.get('search_label')).toBe(`<b><span class="srch-lbl-lg">${examplePOD1.get('PODSiteName')}</span></b><br><span class="srch-lbl-sm">${examplePOD1.get('Address')}</span>`)
    expect(examplePOD1.app.remove.length).toBe(0)
  })

  test('extendFeature ActivePOD=1 active=false', () => {
    expect.assertions(5)

    examplePOD1.content.messages.active = 'false'

    examplePOD1.extendFeature()
    expect(examplePOD1.active).toBe(false)
    expect(examplePOD1.getId()).toBe(examplePOD1.get('DOECode'))
    expect(examplePOD1.get('search_label')).not.toBeNull()
    expect(examplePOD1.get('search_label')).toBe(`<b><span class="srch-lbl-lg">${examplePOD1.get('PODSiteName')}</span></b><br><span class="srch-lbl-sm">${examplePOD1.get('Address')}</span>`)
    expect(examplePOD1.app.remove.length).toBe(0)
  })

  test('extendFeature ActivePOD=0 active=false', () => {
    expect.assertions(6)

    examplePOD1.set('ActivePOD', '0')
    examplePOD1.content.messages.active = 'false'

    examplePOD1.extendFeature()
    expect(examplePOD1.active).toBe(false)
    expect(examplePOD1.getId()).toBe(examplePOD1.get('DOECode'))
    expect(examplePOD1.get('search_label')).not.toBeNull()
    expect(examplePOD1.get('search_label')).toBe(`<b><span class="srch-lbl-lg">${examplePOD1.get('PODSiteName')}</span></b><br><span class="srch-lbl-sm">${examplePOD1.get('Address')}</span>`)
    expect(examplePOD1.app.remove.length).toBe(1)
    expect(examplePOD1.app.remove[0]).toBe(examplePOD1)
  })

  test('extendFeature ActivePOD=0 active=true', () => {
    expect.assertions(6)

    examplePOD1.set('ActivePOD', '0')

    examplePOD1.extendFeature()
    expect(examplePOD1.active).toBe(true)
    expect(examplePOD1.getId()).toBe(examplePOD1.get('DOECode'))
    expect(examplePOD1.get('search_label')).not.toBeNull()
    expect(examplePOD1.get('search_label')).toBe(`<b><span class="srch-lbl-lg">${examplePOD1.get('PODSiteName')}</span></b><br><span class="srch-lbl-sm">${examplePOD1.get('Address')}</span>`)
    expect(examplePOD1.app.remove.length).toBe(1)
    expect(examplePOD1.app.remove[0]).toBe(examplePOD1)
  })

  test('extendFeature ActivePOD=1 active=true Ops_status undefined', () => {
    expect.assertions(6)

    examplePOD1.set('Ops_status', undefined)

    examplePOD1.extendFeature()
    expect(examplePOD1.active).toBe(true)
    expect(examplePOD1.getId()).toBe(examplePOD1.get('DOECode'))
    expect(examplePOD1.get('search_label')).not.toBeNull()
    expect(examplePOD1.get('search_label')).toBe(`<b><span class="srch-lbl-lg">${examplePOD1.get('PODSiteName')}</span></b><br><span class="srch-lbl-sm">${examplePOD1.get('Address')}</span>`)
    expect(examplePOD1.app.remove.length).toBe(1)
    expect(examplePOD1.app.remove[0]).toBe(examplePOD1)
  })

  test('extendFeature ActivePOD=1 active=true Ops_status=pods.NOT_ACTIVE_STATUS', () => {
    expect.assertions(6)

    examplePOD1.set('Ops_status', pods.NOT_ACTIVE_STATUS)

    examplePOD1.extendFeature()
    expect(examplePOD1.active).toBe(true)
    expect(examplePOD1.getId()).toBe(examplePOD1.get('DOECode'))
    expect(examplePOD1.get('search_label')).not.toBeNull()
    expect(examplePOD1.get('search_label')).toBe(`<b><span class="srch-lbl-lg">${examplePOD1.get('PODSiteName')}</span></b><br><span class="srch-lbl-sm">${examplePOD1.get('Address')}</span>`)
    expect(examplePOD1.app.remove.length).toBe(1)
    expect(examplePOD1.app.remove[0]).toBe(examplePOD1)
  })
})

describe('icon', () => {
  let div 
  const iconLib = examplePOD1.iconLib
  let library, name, fill
  beforeEach(() => {
    div = $(`<div class="${examplePOD1.getId()}"><h3><img></h3></div>`)
    $('body').append(div)
    examplePOD1.icon = icon 
    examplePOD1.iconLib = {
      icons: {
        'library-name-icon-name-fill-name': 'mock-src'
      },
      parseIcon: jest.fn().mockImplementation(() => {
        return {
          library,
          name,
          fill
        }
      }),
      off: jest.fn()
    }
  })
  afterEach(() => {
    div.remove()
    examplePOD1.icon = jest.fn() 
  })
  test('icon - no img', () => {
    expect.assertions(1)
    examplePOD1.icon(new Style({}))
    expect(examplePOD1.iconSrc).toBeUndefined()
  })
  test('icon w/ iconSrc', () => {
    expect.assertions(6)
    library = 'library-name', name = 'icon-name', fill = 'fill-name'
    examplePOD1.icon(new Style({
      image: new Icon({
        src: 'src'
      })
    }))
    expect(examplePOD1.iconSrc).toBe('mock-src')
    expect(examplePOD1.iconLib.off).toHaveBeenCalledTimes(1)
    expect(examplePOD1.iconLib.off.mock.calls[0][0]).toBe('icon-loaded')
    expect(examplePOD1.iconLib.off.mock.calls[0][1]).toBe(examplePOD1.icon)
    expect(examplePOD1.iconLib.off.mock.calls[0][2]).toBe(examplePOD1)
    expect(div.find('img').attr('src')).toBe('mock-src')
  })

  test('icon w/o iconSrc', () => {
    expect.assertions(3)
    library = 'library2-name', name = 'icon2-name', fill = 'fill2-name'
    examplePOD1.icon(new Style({
      image: new Icon({
        src: 'src'
      })
    }))
    expect(examplePOD1.iconSrc).toBeUndefined()
    expect(examplePOD1.iconLib.off).toHaveBeenCalledTimes(0)
    expect(div.find('img').attr('src')).toBeUndefined()
  })
})

test('html - active true', () => {
  expect.assertions(8)

  let date = new Date(examplePOD1.get('LatestDate'))
  const time = date.toLocaleTimeString()
  date = date.toLocaleDateString()

  examplePOD1.iconSrc = 'iconSrc'
  examplePOD1.extendFeature()

  expect($('<div></div>').html(examplePOD1.html()).html()).toEqual(`<div class="facility POD_ID-1"><p>A Distance</p><h3 class="name notranslate"><img src="iconSrc">POD_Site_Name</h3><p>screen</p><p>An Address</p><ul><li><b>Status: </b>Closed to Public</li><li><b>Last Updated: </b>${date} ${time}</li></ul><p>Map</p><p>Directions</p><a class="btn rad-all prep" href="DOHMHPODLink-1" target="_blank">Prepare for your visit</a><a class="btn rad-all prep" href="Link1-1" target="_blank">Label1-1</a><a class="btn rad-all prep" href="Link2-1" target="_blank">Label2-1</a><a class="btn rad-all prep" href="Link3-1" target="_blank">Label3-1</a><div class="extra"><div class="lbl">extra1:</div><div class="val">Extra1</div><div class="lbl">extra2:</div><div class="val">Extra2</div></div></div>`)
  expect(examplePOD1.html().data('feature')).toBe(examplePOD1)
  expect(examplePOD1.html()).not.toBeNull()  

  $.resetMocks()
  
  $(examplePOD1.html()).trigger('mouseover')

  expect($.proxy).toHaveBeenCalledTimes(2)

  expect($.proxy.mock.calls[0][0]).toBe(examplePOD1.handleOver)
  expect($.proxy.mock.calls[0][1]).toBe(examplePOD1)

  expect($.proxy.mock.calls[1][0]).toBe(examplePOD1.handleOut)
  expect($.proxy.mock.calls[1][1]).toBe(examplePOD1)

})

test('html - active false', () => {
  expect.assertions(8)
 
  examplePOD4.extendFeature()

  expect($('<div></div>').html(examplePOD4.html()).html()).toEqual('<div class="facility POD_ID-4"><p>A Distance</p><h3 class="name notranslate"><img src="">POD_Site_Name</h3><p>screen</p><p>An Address</p><p>Map</p><p>Directions</p><a class="btn rad-all prep" href="Link" target="_blank">Prepare for your visit</a></div>')
  expect(examplePOD4.html().data('feature')).toBe(examplePOD4)
  expect(examplePOD4.html()).not.toBeNull()

  $.resetMocks()
  
  $(examplePOD4.html()).trigger('mouseover')

  expect($.proxy).toHaveBeenCalledTimes(2)

  expect($.proxy.mock.calls[0][0]).toBe(examplePOD4.handleOver)
  expect($.proxy.mock.calls[0][1]).toBe(examplePOD4)

  expect($.proxy.mock.calls[1][0]).toBe(examplePOD4.handleOut)
  expect($.proxy.mock.calls[1][1]).toBe(examplePOD4)
})

test('prepButton', () => {
  expect.assertions(4)

  expect(examplePOD1.prepButton('DOHMHPODLink').html()).toEqual('Prepare for your visit')
  expect(examplePOD1.prepButton('DOHMHPODLink').attr('href')).toEqual(examplePOD1.get('DOHMHPODLink'))

  expect(examplePOD2.prepButton('DOHMHPODLink').html()).toEqual('Prepare for your visit')
  expect(examplePOD2.prepButton('DOHMHPODLink').attr('href')).toEqual(examplePOD2.get('DOHMHPODLink'))
})

test('getTip', () => {
  expect.assertions(2)

  let date = new Date(examplePOD1.get('LatestDate'))
  const time = date.toLocaleTimeString()
  date = date.toLocaleDateString()

  examplePOD1.extendFeature()
  expect(examplePOD1.getTip()).toEqual($(`<div><h3 class="name notranslate"><img src="iconSrc">POD_Site_Name</h3><p>An Address</p><ul><li><b>Status: </b>Closed to Public</li><li><b>Last Updated: </b>${date} ${time}</li></ul><i class="dir-tip">Click on site for directions</i></div>`))
  expect(examplePOD1.getTip()).not.toBeNull()
})

test('getAddress1', () => {
  expect.assertions(2)
  expect(examplePOD1.getAddress1()).toBe(`${examplePOD1.get('Address')}`)
  expect(examplePOD1.getAddress1()).not.toBeNull()
})

test('getCityStateZip', () => {
  expect.assertions(2)
  expect(examplePOD1.getCityStateZip()).toBe(`${examplePOD1.get('Borough')}, NY ${examplePOD1.get('ZIP')}`)
  expect(examplePOD1.getCityStateZip()).not.toBeNull()
})

test('getName', () => {
  expect.assertions(2)
  expect(examplePOD1.getName()).toBe(`${examplePOD1.get('PODSiteName')}`)
  expect(examplePOD1.getName()).not.toBeNull()
})

test('getIcon', () => {
  expect.assertions(2)
  expect(examplePOD1.getIcon()).toBe('library-name/icon-name-1#ff0000')
  expect(examplePOD2.getIcon()).toBe(facilityStyle.CIRCLE_ICON)
})

describe('nameHtml', () => {
  beforeEach(() => {
    examplePOD1.iconSrc = 'iconSrc'
  })
  test('nameHtml', () => {
    expect(examplePOD1.nameHtml()).toEqual($('<h3 class="name notranslate"></h3>')
    .append(`<img src="iconSrc">`)
    .append(examplePOD1.getName()))
  })
})
describe('getStatus', () => {
  afterEach(() => {
    examplePOD1.set('Ops_status', 'Closed to Public')
  })

  test('getStatus - open soon', () => {
    expect.assertions(3)
    examplePOD1.set('Ops_status', 'Mobilizing')
    expect(examplePOD1.get('Ops_status')).toBe('Mobilizing')
    expect(examplePOD1.getStatus()).toBe('Opening Soon')
    expect(examplePOD1.getStatus()).not.toBeNull()
  })

  test('getStatus - closed', () => {
    expect.assertions(7)

    examplePOD1.set('Ops_status', 'Demobilizing')
    expect(examplePOD1.get('Ops_status')).toBe('Demobilizing')
    expect(examplePOD1.getStatus()).toBe('Closed to Public')

    examplePOD1.set('Ops_status', 'Demobilized')
    expect(examplePOD1.get('Ops_status')).toBe('Demobilized')
    expect(examplePOD1.getStatus()).toBe('Closed to Public')

    examplePOD1.set('Ops_status', 'Closed to Public')
    expect(examplePOD1.get('Ops_status')).toBe('Closed to Public')
    expect(examplePOD1.getStatus()).toBe('Closed to Public')

    expect(examplePOD1.getStatus()).not.toBeNull()
  })

  test('getStatus - open', () => {
    expect.assertions(2)
    examplePOD1.set('Ops_status', 'Open to Public')
    expect(examplePOD1.getStatus()).toBe('Open to Public')
    expect(examplePOD1.getStatus()).not.toBeNull()
  })

  test('getStatus - inactive', () => {
    expect.assertions(2)
    examplePOD1.set('Ops_status', '')
    expect(examplePOD1.getStatus()).toBe('Inactive')
    expect(examplePOD1.getStatus()).not.toBeNull()
  })
})

test('getLatestDate', () => {
  expect.assertions(2)
  let date = new Date(examplePOD1.get('LatestDate'))
  let formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  expect(examplePOD1.getLatestDate()).toBe(formattedDate)
  expect(examplePOD1.getLatestDate()).not.toBeNull()
})

test('getLatestDate - no date', () => {
  expect.assertions(1)
  expect(examplePOD6.getLatestDate()).toBeUndefined()
})

test('getOpeningTime', () => {
  expect.assertions(1)
  expect(examplePOD1.getOpeningTime()).not.toBeNull()
})

test('getOpeningTime - no time', () => {
  expect.assertions(1)
  expect(examplePOD6.getOpeningTime()).toBeUndefined()
})

describe('getWaitTime', () => {
  afterEach(() => {
    examplePOD1.set('wait_time', 'Wait_Time')
  })
  test('getWaitTime - waitTime is number 0', () => {
    expect.assertions(2)
    examplePOD1.set('wait_time', 0)
    
    expect(examplePOD1.getWaitTime()).toBe(0)
    expect(examplePOD1.getWaitTime()).not.toBeNull()
  })
  test('getWaitTime - waitTime is number != 0', () => {
    expect.assertions(1)
    examplePOD1.set('wait_time', 30)
    
    expect(examplePOD1.getWaitTime()).toBe(30)
  })
  test('getWaitTime - waitTime is undefined', () => {
    expect.assertions(1)
    examplePOD1.set('wait_time', undefined)
    
    expect(examplePOD1.getWaitTime()).toBe(undefined)
  })
  test('getWaitTime - waitTime is empty string', () => {
    expect.assertions(1)
    examplePOD1.set('wait_time', '')
    
    expect(examplePOD1.getWaitTime()).toBe(undefined)
  })
  test('getWaitTime - waitTime is null', () => {
    expect.assertions(1)
    examplePOD1.set('wait_time', null)
    
    expect(examplePOD1.getWaitTime()).toBe(undefined)
  })
  test('getWaitTime - waitTime is nonempty string number', () => {
    expect.assertions(1)
    examplePOD1.set('wait_time', '0')
    
    expect(examplePOD1.getWaitTime()).toBe(0)
  })
  test('getWaitTime - waitTime is nonempty string number != 0', () => {
    expect.assertions(1)
    examplePOD1.set('wait_time', '30')
    
    expect(examplePOD1.getWaitTime()).toBe(30)
  })
  test('getWaitTime - waitTime is nonempty string but not a number', () => {
    expect.assertions(1)
    examplePOD1.set('wait_time', 'Wait_Time')
    
    expect(examplePOD1.getWaitTime()).toBe(undefined)
  })
})

describe('detailsHtml', () => {
  afterEach(() => {
    examplePOD1.set('LatestDate', '1/10/2019,3:54 PM')
    examplePOD2.set('wait_time', 'Wait_Time')
    examplePOD3.set('OpeningTime', '1/10/2019,3:55 PM')
  })

  test('detailsHtml - active is false', () => {
    expect.assertions(1)
    expect(examplePOD4.detailsHtml()).toBeUndefined()
  })

  test('detailsHtml - active is true, Ops_status is open to public', () => {
    expect.assertions(4)
    examplePOD2.set('wait_time', '0')
    const update = new Date(examplePOD2.get('LatestDate'))
    let ul = $('<ul></ul>')
      .append(`<li><b>Status: </b>${examplePOD2.getStatus()}</li>`)
      .append(`<li><b>Wait time: </b>${examplePOD2.get('wait_time')} minutes</li>`)
      .append(`<li><b>Last Updated: </b>${update.toLocaleDateString()} ${update.toLocaleTimeString()}</li>`)

    expect(examplePOD2.detailsHtml()).toEqual(ul)
    expect(examplePOD2.detailsHtml().children().length).toBe(3)

    examplePOD2.set('wait_time', '')

    ul = $('<ul></ul>')
      .append(`<li><b>Status: </b>${examplePOD2.getStatus()}</li>`)
      .append(`<li><b>Wait time: </b>N/A</li>`)
      .append(`<li><b>Last Updated: </b>${update.toLocaleDateString()} ${update.toLocaleTimeString()}</li>`)

      expect(examplePOD2.detailsHtml()).toEqual(ul)
      expect(examplePOD2.detailsHtml().children().length).toBe(3)
  })

  test('detailsHtml - active is true, Ops_status is OpeningTime soon', () => {
    expect.assertions(4)
    const update = new Date(examplePOD3.get('LatestDate'))
    const OpeningTime = new Date(examplePOD3.get('OpeningTime'))

    let ul = $('<ul></ul>')
      .append(`<li><b>Status: </b>${examplePOD3.getStatus()}</li>`)
      .append(`<li><b>Estimated Opening Time: </b>${OpeningTime.toLocaleDateString()} ${OpeningTime.toLocaleTimeString()}</li>`)
      .append(`<li><b>Last Updated: </b>${update.toLocaleDateString()} ${update.toLocaleTimeString()}</li>`)

    expect(examplePOD3.detailsHtml()).toEqual(ul)
    expect(examplePOD3.detailsHtml().children().length).toBe(3)

    examplePOD3.set('OpeningTime', '')

    ul = $('<ul></ul>')
      .append(`<li><b>Status: </b>${examplePOD3.getStatus()}</li>`)
      .append(`<li><b>Estimated Opening Time: </b>N/A</li>`)        
      .append(`<li><b>Last Updated: </b>${update.toLocaleDateString()} ${update.toLocaleTimeString()}</li>`)

      expect(examplePOD3.detailsHtml()).toEqual(ul)
      expect(examplePOD3.detailsHtml().children().length).toBe(3)
  })

  test('detailsHtml - active is true, Ops_status is closed', () => {
    expect.assertions(4)
    const update = new Date(examplePOD1.get('LatestDate'))
    let ul = $('<ul></ul>').append(`<li><b>Status: </b>${examplePOD1.getStatus()}</li>`)
    .append(`<li><b>Last Updated: </b>${update.toLocaleDateString()} ${update.toLocaleTimeString()}</li>`)

    expect(examplePOD1.detailsHtml()).toEqual(ul)
    expect(examplePOD1.detailsHtml().children().length).toBe(2)

    examplePOD1.set('LatestDate', '')

    ul = $('<ul></ul>')
      .append(`<li><b>Status: </b>${examplePOD1.getStatus()}</li>`)
      .append(`<li><b>Last Updated: </b>N/A</li>`)

    expect(examplePOD1.detailsHtml()).toEqual(ul)
    expect(examplePOD1.detailsHtml().children().length).toBe(2)
    
  })
})
