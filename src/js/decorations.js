/**
 * @module pods/decorations
 */

import pods from './pods'

const decorations = {
  extendFeature() {
    this.setId(this.get('DOECode'))
    this.active = this.content.message('active')
    this.set(
      'search_label',
      `<b><span class="srch-lbl-lg">${this.getName()}</span></b><br>
      <span class="srch-lbl-sm">${this.getAddress1()}</span>`
    )
    if (this.active === 'true') {
      const Ops_status = this.get('Ops_status')
      if (!Ops_status || Ops_status === pods.NOT_ACTIVE_STATUS) {
        this.app.remove.push(this)
      }
    }
  },
  getName() {
    return this.get('PODSiteName')
  },
  html() {
    return $('<div class="facility"></div>')
      .addClass(this.getId())
      .addClass(this.active === 'true' ? this.getStatus().replace(/ /g, '-').toLowerCase() : '')
      .append(this.distanceHtml())
      .append(this.nameHtml())
      .append(this.distanceHtml(true))
      .append(this.addressHtml())
      .append(this.detailsHtml())
      .append(this.mapButton())
      .append(this.directionsButton())
      .append(this.prepButton())
      .data('feature', this)
      .mouseover($.proxy(this.handleOver, this))
      .mouseout($.proxy(this.handleOut, this))
  },
  prepButton() {
    const lnk = this.get('DOHMHPODLink')
    if (lnk) {
      return $(`<a class="btn rad-all prep" href="${lnk}" target="_blank">Prepare for your visit</a>`)
    }
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
  getActive() {
    return this.active
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
    return this.get('wait_time')
  },
  detailsHtml() {
    if (this.getActive() === 'true') {
      
      let ul = $('<ul></ul>')

      if (this.getStatus() === 'Open to Public') {
        const wait_time = this.getWaitTime() ? this.getWaitTime() + ' minutes' : 'N/A'
        const waitTime = `<li><b>Wait time: </b>${wait_time}</li>`

        ul.append(waitTime)
      }
      else if(this.getStatus() === 'Opening Soon'){
        const openingTime = `<li><b>Estimated Opening Time: </b>${this.getOpeningTime()||'N/A'}</li>`
        ul.append(openingTime)
      }
    
      const Ops_status = `<li><b>Status: </b>${this.getStatus()}</li>`

      const update = this.getLatestDate()
      const latestUpdate = `<li><b>Last Updated: </b>${update||'N/A'}</li>`
      ul.append(latestUpdate)

      ul.prepend(Ops_status)

      return ul
    }
  }

}

export default decorations