import {examplePOD1,examplePOD2,examplePOD3,examplePOD4,examplePOD5,examplePOD7, pointStyle} from './test-features'
import facilityStyle from '../src/js/facility-style'
import Circle from 'ol/style/Circle'
import nycOl from 'nyc-lib/nyc/ol'

test('getFillColor', () => {
  expect.assertions(5)

  expect(facilityStyle.getFillColor(examplePOD1)).toBe(facilityStyle.ACTIVE_COLORS['Closed to Public'])
  expect(facilityStyle.getFillColor(examplePOD2)).toBe(facilityStyle.ACTIVE_COLORS['Open to Public'])
  expect(facilityStyle.getFillColor(examplePOD3)).toBe(facilityStyle.ACTIVE_COLORS['Opening Soon'])
  expect(facilityStyle.getFillColor(examplePOD4)).toBe(facilityStyle.INACTIVE_COLOR)
  //active app, inactive pod
  expect(facilityStyle.getFillColor(examplePOD5)).toBe(facilityStyle.INACTIVE_COLOR)
})

test('getStroke', () => {
  expect.assertions(2)

  expect(facilityStyle.getStroke(facilityStyle.CIRCLE_ICON)).toEqual({width: 1, color: '#000'})
  expect(facilityStyle.getStroke('LITERALLY-ANYTHING-ELSE')).toBeUndefined()
})

test('getRadius', () => {
  expect.assertions(5)

  expect(facilityStyle.getRadius(18)).toBe(20)
  expect(facilityStyle.getRadius(16)).toBe(16)
  expect(facilityStyle.getRadius(14)).toBe(12)
  expect(facilityStyle.getRadius(12)).toBe(8)
  expect(facilityStyle.getRadius(11)).toBe(6)
})

test('highlightStyle', () => {
  expect.assertions(4)

  const style = facilityStyle.highlightStyle(examplePOD1, 305.748113140705)

  expect(style.getImage() instanceof Circle).toBe(true)
  expect(style.getImage().getStroke().getColor()).toBe('#58A7FA')
  expect(style.getImage().getStroke().getWidth()).toBe(6)
  expect(style.getImage().getRadius()).toBe(9)
})

describe('textStyle', () => {
  const getRadius = facilityStyle.getRadius
  const stringDivider = facilityStyle.stringDivider

  beforeEach(() => {
    $.resetMocks()
    facilityStyle.getRadius = jest.fn().mockImplementation(() => {
      return 10
    })
    facilityStyle.stringDivider = jest.fn().mockImplementation(() => {
      return 'siteName'
    })
  })
  afterEach(() => {
    facilityStyle.getRadius = getRadius
    facilityStyle.stringDivider = stringDivider
  })
  

  test('no style - low zoom', () => {
    expect.assertions(3)

    const style = facilityStyle.textStyle(examplePOD1, nycOl.TILE_GRID.getResolutions()[9])

    expect(facilityStyle.getRadius).toHaveBeenCalledTimes(0)
    expect(facilityStyle.stringDivider).toHaveBeenCalledTimes(0)
    expect(style).toBeUndefined()
  })

  test('LabelPos - N', () => {
    expect.assertions(14)

    const style = facilityStyle.textStyle(examplePOD1, nycOl.TILE_GRID.getResolutions()[14])

    expect(facilityStyle.getRadius).toHaveBeenCalledTimes(1)
    expect(facilityStyle.getRadius.mock.calls[0][0]).toBe(14)

    expect(facilityStyle.stringDivider).toHaveBeenCalledTimes(1)
    expect(facilityStyle.stringDivider.mock.calls[0][0]).toBe(examplePOD1.getName())
    expect(facilityStyle.stringDivider.mock.calls[0][1]).toBe(24)
    expect(facilityStyle.stringDivider.mock.calls[0][2]).toBe('\n')

    expect(style.getText().getFill().getColor()).toBe('#000')
    expect(style.getText().getFont()).toBe('bold 10px sans-serif')
    expect(style.getText().getText()).toBe('siteName')
    expect(style.getText().getOffsetX()).toBe(0)
    expect(style.getText().getOffsetY()).toBe(-2.5 * 10)
    expect(style.getText().getTextAlign()).toBe('center')
    expect(style.getText().getStroke().getColor()).toBe('rgb(254,252,213)')
    expect(style.getText().getStroke().getWidth()).toBe(5)


    
  })

  test('LabelPos - S', () => {
    expect.assertions(14)

    const style = facilityStyle.textStyle(examplePOD2, nycOl.TILE_GRID.getResolutions()[15])

    expect(facilityStyle.getRadius).toHaveBeenCalledTimes(1)
    expect(facilityStyle.getRadius.mock.calls[0][0]).toBe(15)

    expect(facilityStyle.stringDivider).toHaveBeenCalledTimes(1)
    expect(facilityStyle.stringDivider.mock.calls[0][0]).toBe(examplePOD2.getName())
    expect(facilityStyle.stringDivider.mock.calls[0][1]).toBe(24)
    expect(facilityStyle.stringDivider.mock.calls[0][2]).toBe('\n')

    expect(style.getText().getFill().getColor()).toBe('#000')
    expect(style.getText().getFont()).toBe('bold 10px sans-serif')
    expect(style.getText().getText()).toBe('siteName')
    expect(style.getText().getOffsetX()).toBe(0)
    expect(style.getText().getOffsetY()).toBe(2.5 * 10)
    expect(style.getText().getTextAlign()).toBe('center')
    expect(style.getText().getStroke().getColor()).toBe('rgb(254,252,213)')
    expect(style.getText().getStroke().getWidth()).toBe(5)
  })

  test('LabelPos - E', () => {
    expect.assertions(14)

    const style = facilityStyle.textStyle(examplePOD1, nycOl.TILE_GRID.getResolutions()[16])

    expect(facilityStyle.getRadius).toHaveBeenCalledTimes(1)
    expect(facilityStyle.getRadius.mock.calls[0][0]).toBe(16)

    expect(facilityStyle.stringDivider).toHaveBeenCalledTimes(1)
    expect(facilityStyle.stringDivider.mock.calls[0][0]).toBe(examplePOD1.getName())
    expect(facilityStyle.stringDivider.mock.calls[0][1]).toBe(24)
    expect(facilityStyle.stringDivider.mock.calls[0][2]).toBe('\n')

    expect(style.getText().getFill().getColor()).toBe('#000')
    expect(style.getText().getFont()).toBe('bold 10px sans-serif')
    expect(style.getText().getText()).toBe('siteName')
    expect(style.getText().getOffsetX()).toBe(1.5 * 10)
    expect(style.getText().getOffsetY()).toBe(0)
    expect(style.getText().getTextAlign()).toBe('left')
    expect(style.getText().getStroke().getColor()).toBe('rgb(254,252,213)')
    expect(style.getText().getStroke().getWidth()).toBe(5)
  })

  test('LabelPos - W', () => {
    expect.assertions(15)

    const style = facilityStyle.textStyle(examplePOD4, nycOl.TILE_GRID.getResolutions()[14])

    expect(examplePOD4.get('LabelPos')).toBe('W')

    expect(facilityStyle.getRadius).toHaveBeenCalledTimes(1)
    expect(facilityStyle.getRadius.mock.calls[0][0]).toBe(14)

    expect(facilityStyle.stringDivider).toHaveBeenCalledTimes(1)
    expect(facilityStyle.stringDivider.mock.calls[0][0]).toBe(examplePOD4.getName())
    expect(facilityStyle.stringDivider.mock.calls[0][1]).toBe(24)
    expect(facilityStyle.stringDivider.mock.calls[0][2]).toBe('\n')

    expect(style.getText().getFill().getColor()).toBe('#000')
    expect(style.getText().getFont()).toBe('bold 10px sans-serif')
    expect(style.getText().getText()).toBe('siteName')
    expect(style.getText().getOffsetX()).toBe(-1.5 * 10)
    expect(style.getText().getOffsetY()).toBe(0)
    expect(style.getText().getTextAlign()).toBe('right')
    expect(style.getText().getStroke().getColor()).toBe('rgb(254,252,213)')
    expect(style.getText().getStroke().getWidth()).toBe(5)
  })

  test('LabelPos - not provided(default)', () => {
    expect.assertions(28)

    let style = facilityStyle.textStyle(examplePOD5, nycOl.TILE_GRID.getResolutions()[14])

    expect(facilityStyle.getRadius).toHaveBeenCalledTimes(1)
    expect(facilityStyle.getRadius.mock.calls[0][0]).toBe(14)

    expect(facilityStyle.stringDivider).toHaveBeenCalledTimes(1)
    expect(facilityStyle.stringDivider.mock.calls[0][0]).toBe(examplePOD5.getName())
    expect(facilityStyle.stringDivider.mock.calls[0][1]).toBe(24)
    expect(facilityStyle.stringDivider.mock.calls[0][2]).toBe('\n')

    expect(style.getText().getFill().getColor()).toBe('#000')
    expect(style.getText().getFont()).toBe('bold 10px sans-serif')
    expect(style.getText().getText()).toBe('siteName')
    expect(style.getText().getOffsetX()).toBe(1.5 * 10)
    expect(style.getText().getOffsetY()).toBe(0)
    expect(style.getText().getTextAlign()).toBe('left')
    expect(style.getText().getStroke().getColor()).toBe('rgb(254,252,213)')
    expect(style.getText().getStroke().getWidth()).toBe(5)


    let z = 1
    style = facilityStyle.textStyle(examplePOD2, nycOl.TILE_GRID.getResolutions()[16])

    expect(facilityStyle.getRadius).toHaveBeenCalledTimes(2)
    expect(facilityStyle.getRadius.mock.calls[1][0]).toBe(16)

    expect(facilityStyle.stringDivider).toHaveBeenCalledTimes(2)
    expect(facilityStyle.stringDivider.mock.calls[1][0]).toBe(examplePOD2.getName())
    expect(facilityStyle.stringDivider.mock.calls[1][1]).toBe(24)
    expect(facilityStyle.stringDivider.mock.calls[1][2]).toBe('\n')

    expect(style.getText().getFill().getColor()).toBe('#000')
    expect(style.getText().getFont()).toBe('bold 10px sans-serif')
    expect(style.getText().getText()).toBe('siteName')
    expect(style.getText().getOffsetX()).toBe(0)
    expect(style.getText().getOffsetY()).toBe(2.5 * 10)
    expect(style.getText().getTextAlign()).toBe('center')
    expect(style.getText().getStroke().getColor()).toBe('rgb(254,252,213)')
    expect(style.getText().getStroke().getWidth()).toBe(5)  
  })

})

describe('stringDivider', () => {
  test('str length less than desired width', () => {
    expect.assertions(1)

    let str = 'siteName'
    let width = 20 
    let spaceReplacer = '\n'

    expect(facilityStyle.stringDivider(str,width,spaceReplacer)).toBe(str)
  })

  test('divides string 2 new lines - doesnt replace first space', () => {
    expect.assertions(1)

    let str = 'siteName siteName-siteName'
    let width = 20 
    let spaceReplacer = '\n'

    expect(facilityStyle.stringDivider(str,width,spaceReplacer)).toBe('siteName siteName-\nsiteName')
  })

  test('divides string 3 new lines - replace all spaces', () => {
    expect.assertions(1)

    let str = 'siteName siteName siteName'
    let width = 8
    let spaceReplacer = '\n'

    expect(facilityStyle.stringDivider(str,width,spaceReplacer)).toBe('siteName\nsiteName\nsiteName')
  })

  test('divides string with dashes', () => {
    expect.assertions(1)

    let str = 'siteName-siteName-siteName'
    let width = 10
    let spaceReplacer = '\n'

    expect(facilityStyle.stringDivider(str,width,spaceReplacer)).toBe('siteName-\nsiteName-\nsiteName')
  })

  test('width too small', () => {
    expect.assertions(1)

    let str = 'siteName-siteName-siteName'
    let width = 7
    let spaceReplacer = '\n'

    expect(facilityStyle.stringDivider(str,width,spaceReplacer)).toBe(str)
  })

})

describe('pointStyle', () => {
  const iconLib = facilityStyle.iconLib
  beforeEach(() => {
    facilityStyle.pointStyle = pointStyle
    facilityStyle.iconLib = {
      style: jest.fn().mockImplementation(() => {
        return 'mock-style'
      })
    }
  })
  afterEach(() => {
    facilityStyle.pointStyle = jest.fn()
    facilityStyle.iconLib = iconLib
  })

  test('pointStyle', () => {
    expect.assertions(6)

    expect(facilityStyle.pointStyle(examplePOD1, 120.12241480526231)).toBe('mock-style')
    expect(facilityStyle.iconLib.style).toHaveBeenCalledTimes(1)
    expect(facilityStyle.iconLib.style.mock.calls[0][0].icon).toBe('library-name/icon-name-1#ff0000')
    expect(facilityStyle.iconLib.style.mock.calls[0][0].width).toBe(12)
    expect(facilityStyle.iconLib.style.mock.calls[0][0].fill).toBe('#999999')
    expect(facilityStyle.iconLib.style.mock.calls[0][0].stroke).toBeUndefined()
  })
})

describe('eventTriggers', () => {
  beforeEach(() => {
    global.finderApp = {
      source: {
        changed: jest.fn()
      }
    }
  })
  afterEach(() => {
    delete global.finderApp
  })

  test('icon-loaded', () => {
    facilityStyle.iconLib.trigger('icon-loaded')
    expect(global.finderApp.source.changed).toHaveBeenCalledTimes(1)
  })
  test('icon-loaded', () => {
    facilityStyle.iconLib.trigger('icon-not-found')
    expect(global.finderApp.source.changed).toHaveBeenCalledTimes(1)
  })
})