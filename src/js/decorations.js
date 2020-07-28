/**
 * @module pods/decorations
 */

import pods from './pods'
import facilityStyle from './facility-style'

const FIELDS = [
  'OBJECTID',
  'geometry',
  'ActivePOD',
  'DOECode',
  'PODSiteName',
  'Address',
  'Borough',
  'ZIP',
  'Ops_status',
  'OpeningTime',
  'wait_time',
  'LatestDate',
  'LabelPos',
  'x',
  'y',
  'DOHMHPODLink',
  'Link1',
  'Label1',
  'Link2',
  'Label2',
  'Link3',
  'Label3',
  'Icon',
  'search_label',
  '__distance'
]

const decorations = {
  extendFeature() {
    this.setId(this.get('DOECode'))
    this.active = this.content.message('active').toLowerCase() === 'true'
    this.set(
      'search_label',
      `<b><span class="srch-lbl-lg">${this.getName()}</span></b><br><span class="srch-lbl-sm">${this.getAddress1()}</span>`
    )

    const ActivePOD = this.get('ActivePOD')
    let removed = false
    if (`${ActivePOD}` !== '1') {
      this.app.remove.push(this)
      removed = true
    }
    if (!removed && this.active) {
      const Ops_status = this.get('Ops_status')
      if (!Ops_status || Ops_status === pods.NOT_ACTIVE_STATUS) {
        this.app.remove.push(this)
      }
    }

    this.iconLib = this.facilityStyle.iconLib
    this.iconLib.on('icon-loaded', this.icon, this)
    this.icon(this.facilityStyle.pointStyle(this))
  },
  icon(style) {
    const img = style.getImage()
    if (img) {
      const icon = this.getIcon()
      const parsed = this.iconLib.parseIcon({
        icon, 
        fill: facilityStyle.getFillColor(this)
      })
      const key = `${parsed.library}-${parsed.name}-${parsed.fill}`
      this.iconSrc = this.iconLib.icons[key]
      if (this.iconSrc) {
        this.iconLib.off('icon-loaded', this.icon, this)
        $(`.${this.getId()} h3 img`).attr('src', this.iconSrc)
      }
    }
  },
  nameHtml() {
    return $('<h3 class="name notranslate"></h3>')
      .append(`<img src="${this.iconSrc || ''}">`)
      .append(this.getName())
  },
  getName() {
    return this.get('PODSiteName')
  },
  getIcon() {
    const icon = this.get('Icon')
    if (icon) {
      return icon
    }
    return facilityStyle.CIRCLE_ICON
  },
  html() {
    return $('<div class="facility"></div>')
      .addClass(this.getId())
      .append(this.distanceHtml())
      .append(this.nameHtml())
      .append(this.distanceHtml(true))
      .append(this.addressHtml())
      .append(this.detailsHtml())
      .append(this.mapButton())
      .append(this.directionsButton())
      .append(this.prepButton('DOHMHPODLink'))
      .append(this.extraButtons())
      .append(this.extraAnything())
      .data('feature', this)
      .mouseover($.proxy(this.handleOver, this))
      .mouseout($.proxy(this.handleOut, this))
  },
  extraAnything() {
    const html = $('<div class="extra"></div>')
    const props = this.getProperties()
    Object.keys(props).forEach(prop => {
      if ($.inArray(prop, FIELDS) === -1 && props[prop]) {
        html.append(`<div class="lbl">${prop}:</div><div class="val">${props[prop]}</div>`)
      }
    })
    if (html.html()) {
      return html
    }
  },
  prepButton(lnkProp, lblProp) {
    const lnk = this.get(lnkProp)
    if (lnk) {
      const lbl = this.get(`${lblProp}`) || 'Prepare for your visit'
      return $(`<a class="btn rad-all prep" href="${lnk}" target="_blank">${lbl}</a>`)
    }
  },
  extraButtons() {
    const buttons = []
    for (let i = 1; i < 4; i++) {
      buttons.push(this.prepButton(`Link${i}`, `Label${i}`))
    }
    return buttons
  },
  getTip() {
    return $('<div></div>')
      .append(this.nameHtml())
      .append(this.addressHtml())
      .append(this.detailsHtml())
      .append('<i class="dir-tip">Click on site for directions</i>')
  },
  getAddress1() {
    return this.get('Address')
  },
  getCityStateZip() {
    return `${this.get('Borough')}, NY ${this.get('ZIP')}`
  },
  getStatus() {
    const Ops_status = this.get('Ops_status')
    switch(Ops_status) {
      case 'Mobilizing':
        return 'Opening Soon'
      case 'Open to Public':
        return 'Open to Public'
      case 'Demobilizing':
        return 'Closed to Public'
      case 'Demobilized':
        return 'Closed to Public'
      case 'Closed to Public':
        return 'Closed to Public'
    }
    return 'Inactive'
  },
  getLatestDate() {
    const date = this.get('LatestDate')

    if(date){
      const date_convert = new Date(date)
      return `${date_convert.toLocaleDateString()} ${date_convert.toLocaleTimeString()}` 
    }
  },
  getOpeningTime() {
    const time = this.get('OpeningTime')

    if(time){
      const time_convert = new Date(time)
      return `${time_convert.toLocaleDateString()} ${time_convert.toLocaleTimeString()}` 
    }
  },
  getWaitTime() {
    const wait = this.get('wait_time')
    if (wait === undefined || wait === null || wait === '' || isNaN(wait)) {
      return undefined
    } else {
      return wait * 1
    }
  },
  detailsHtml() {
    if (this.active) {
      const ul = $('<ul></ul>')

      const Ops_status = `<li><b>Status: </b>${this.getStatus()}</li>`
      ul.append(Ops_status)

      if (this.getStatus() === 'Open to Public') {
        const wait = this.getWaitTime() !== undefined ? `${this.getWaitTime()} minutes` : 'N/A'
        const waitTime = `<li><b>Wait time: </b>${wait}</li>`
        ul.append(waitTime)
      } else if (this.getStatus() === 'Opening Soon') {
        const openingTime = `<li><b>Estimated Opening Time: </b>${this.getOpeningTime()||'N/A'}</li>`
        ul.append(openingTime)
      }

      const update = this.getLatestDate()
      const latestUpdate = `<li><b>Last Updated: </b>${update||'N/A'}</li>`
      ul.append(latestUpdate)

      return ul
    }
  }

}

export default decorations