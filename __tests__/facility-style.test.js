import {examplePOD1,examplePOD2,examplePOD3,examplePOD4,examplePOD5,examplePOD7} from './test-features'
import OlStyleCircle from 'ol/style/Circle'
import OlStyle from 'ol/style/Style'
import OlStyleIcon from 'ol/style/Icon'
import facilityStyle from '../src/js/facility-style'
import nycOl from 'nyc-lib/nyc/ol'

describe('pointStyle', () => {
  const calcRadius = facilityStyle.calcRadius
  beforeEach(() => {
    facilityStyle.iconLib.style = jest.fn().mockImplementation(() => {
      return new OlStyle({})
    })
    $.resetMocks()
    facilityStyle.calcRadius = jest.fn().mockImplementation(() => {
      return 1
    })
  })
  afterEach(() => {
    facilityStyle.calcRadius = calcRadius
  })
  test('active is true, facility is closed', () => {
    expect.assertions(14)

    let style = facilityStyle.pointStyle(examplePOD1, 305.748113140705)

    expect(examplePOD1.getStatus()).toBe('Closed to Public')
    expect(examplePOD1.active).toBe(true)
    expect(facilityStyle.iconLib.style).toHaveBeenCalledTimes(1)
    expect(facilityStyle.iconLib.style.mock.calls[0][0]).toBe(examplePOD1.get('Icon'))
    expect(facilityStyle.iconLib.style.mock.calls[0][1]).toBe(2 * facilityStyle.calcRadius.mock.results[0].value)
    expect(facilityStyle.calcRadius).toHaveBeenCalledTimes(1)
    expect(facilityStyle.calcRadius.mock.calls[0][0]).toBe(9)

    style = facilityStyle.pointStyle(examplePOD7, 305.748113140705)
    
    expect(style.getImage() instanceof OlStyleCircle).toBe(true)
    expect(style.getImage().getFill().getColor()).toBe('#999999')
    expect(style.getImage().getStroke().getColor()).toBe('#1A1A1A')
    expect(style.getImage().getStroke().getWidth()).toBe(1)
    expect(style.getImage().getRadius()).toBe(facilityStyle.calcRadius.mock.results[1].value)
    expect(facilityStyle.calcRadius).toHaveBeenCalledTimes(2)
    expect(facilityStyle.calcRadius.mock.calls[0][0]).toBe(9)
  })

  test('active is true, facility is open', () => {
    expect.assertions(9)

    const style = facilityStyle.pointStyle(examplePOD2, 305.748113140705)

    expect(examplePOD2.getStatus()).toBe('Open to Public')
    expect(examplePOD2.active).toBe(true)
    expect(style.getImage() instanceof OlStyleCircle).toBe(true)
    expect(style.getImage().getFill().getColor()).toBe('#19DB17')
    expect(style.getImage().getStroke().getColor()).toBe('#1A1A1A')
    expect(style.getImage().getStroke().getWidth()).toBe(1)
    expect(style.getImage().getRadius()).toBe(facilityStyle.calcRadius.mock.results[0].value)
    expect(facilityStyle.calcRadius).toHaveBeenCalledTimes(1)
    expect(facilityStyle.calcRadius.mock.calls[0][0]).toBe(9)
  })

  test('active is true, facility OpeningTime soon', () => {
    expect.assertions(9)

    const style = facilityStyle.pointStyle(examplePOD3, 305.748113140705)

    expect(examplePOD3.getStatus()).toBe('Opening Soon')
    expect(examplePOD3.active).toBe(true)

    expect(style.getImage() instanceof OlStyleCircle).toBe(true)
    expect(style.getImage().getFill().getColor()).toBe('#F3E318')
    expect(style.getImage().getStroke().getColor()).toBe('#1A1A1A')
    expect(style.getImage().getStroke().getWidth()).toBe(1)
    expect(style.getImage().getRadius()).toBe(facilityStyle.calcRadius.mock.results[0].value)
    expect(facilityStyle.calcRadius).toHaveBeenCalledTimes(1)
    expect(facilityStyle.calcRadius.mock.calls[0][0]).toBe(9)
    
  })

  test('active is true, Ops_status unknown', () => {
    expect.assertions(9)

    const style = facilityStyle.pointStyle(examplePOD5, 305.748113140705)

    expect(examplePOD5.getStatus()).toBe('Inactive')
    expect(examplePOD5.active).toBe(true)
    expect(style.getImage() instanceof OlStyleCircle).toBe(true)
    expect(style.getImage().getFill().getColor()).toBe('#0080A9')
    expect(style.getImage().getStroke().getColor()).toBe('#1A1A1A')
    expect(style.getImage().getStroke().getWidth()).toBe(1)
    expect(style.getImage().getRadius()).toBe(facilityStyle.calcRadius.mock.results[0].value)
    expect(facilityStyle.calcRadius).toHaveBeenCalledTimes(1)
    expect(facilityStyle.calcRadius.mock.calls[0][0]).toBe(9)
    
  })

  test('active is false', () => {
    expect.assertions(8)

    const style = facilityStyle.pointStyle(examplePOD4, 305.748113140705)

    expect(examplePOD4.active).toBe(false)
    expect(style.getImage() instanceof OlStyleCircle).toBe(true)
    expect(style.getImage().getFill().getColor()).toBe('#0080A9')
    expect(style.getImage().getStroke().getColor()).toBe('#1A1A1A')
    expect(style.getImage().getStroke().getWidth()).toBe(1)
    expect(style.getImage().getRadius()).toBe(facilityStyle.calcRadius.mock.results[0].value)
    expect(facilityStyle.calcRadius).toHaveBeenCalledTimes(1)
    expect(facilityStyle.calcRadius.mock.calls[0][0]).toBe(9)

  })

})

describe('calcRadius', () => {
  test('zoom > 11', () => {
    expect(facilityStyle.calcRadius(12)).toBe(8)
  })

  test('zoom > 13', () => {
    expect(facilityStyle.calcRadius(14)).toBe(12)
  })

  test('zoom > 15', () => {
    expect(facilityStyle.calcRadius(16)).toBe(16)
  })

  test('zoom > 17', () => {
    expect(facilityStyle.calcRadius(18)).toBe(20)
  })

  test('zoom < 11', () => {
    expect(facilityStyle.calcRadius(10)).toBe(6)
  })
})

describe('highlightStyle', () => {
  const calcRadius = facilityStyle.calcRadius
  beforeEach(() => {
    $.resetMocks()
    facilityStyle.calcRadius = jest.fn().mockImplementation(() => {
      return 1
    })
  })
  afterEach(() => {
    facilityStyle.calcRadius = calcRadius
  })

  test('highlightStyle', () => {
    expect.assertions(6)

    const style = facilityStyle.highlightStyle(examplePOD1, 305.748113140705)

    expect(style.getImage() instanceof OlStyleCircle).toBe(true)
    expect(style.getImage().getStroke().getColor()).toBe('#58A7FA')
    expect(style.getImage().getStroke().getWidth()).toBe(1)
    expect(style.getImage().getStroke().getWidth()).toBe(facilityStyle.calcRadius.mock.results[0].value)
    expect(facilityStyle.calcRadius).toHaveBeenCalledTimes(1)
    expect(style.getImage().getRadius()).toBe(1.5)
  })

})

describe('textStyle', () => {
  const calcRadius = facilityStyle.calcRadius
  const stringDivider = facilityStyle.stringDivider

  beforeEach(() => {
    $.resetMocks()
    facilityStyle.calcRadius = jest.fn().mockImplementation(() => {
      return 10
    })
    facilityStyle.stringDivider = jest.fn().mockImplementation(() => {
      return 'siteName'
    })
  })
  afterEach(() => {
    facilityStyle.calcRadius = calcRadius
    facilityStyle.stringDivider = stringDivider
  })
  

  test('no style - low zoom', () => {
    expect.assertions(3)

    const style = facilityStyle.textStyle(examplePOD1, nycOl.TILE_GRID.getResolutions()[9])

    expect(facilityStyle.calcRadius).toHaveBeenCalledTimes(0)
    expect(facilityStyle.stringDivider).toHaveBeenCalledTimes(0)
    expect(style).toBeUndefined()
  })

  test('LabelPos - N', () => {
    expect.assertions(14)

    const style = facilityStyle.textStyle(examplePOD1, nycOl.TILE_GRID.getResolutions()[14])

    expect(facilityStyle.calcRadius).toHaveBeenCalledTimes(1)
    expect(facilityStyle.calcRadius.mock.calls[0][0]).toBe(14)

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

    expect(facilityStyle.calcRadius).toHaveBeenCalledTimes(1)
    expect(facilityStyle.calcRadius.mock.calls[0][0]).toBe(15)

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

    expect(facilityStyle.calcRadius).toHaveBeenCalledTimes(1)
    expect(facilityStyle.calcRadius.mock.calls[0][0]).toBe(16)

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

    expect(facilityStyle.calcRadius).toHaveBeenCalledTimes(1)
    expect(facilityStyle.calcRadius.mock.calls[0][0]).toBe(14)

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

    expect(facilityStyle.calcRadius).toHaveBeenCalledTimes(1)
    expect(facilityStyle.calcRadius.mock.calls[0][0]).toBe(14)

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

    expect(facilityStyle.calcRadius).toHaveBeenCalledTimes(2)
    expect(facilityStyle.calcRadius.mock.calls[1][0]).toBe(16)

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
