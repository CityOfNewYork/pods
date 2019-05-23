/**
 * @module pods/decorations
 */

import pods from './pods'
import nyc from 'nyc-lib/nyc'

const decorations = {
  extendFeature() {
    this.setId(this.get('id'))
    this.active = this.content.message('active')
    this.set(
      'search_label',
      `<b><span class="srch-lbl-lg">${this.getName()}</span></b><br>
      <span class="srch-lbl-sm">${this.getAddress1()}</span>`
    )
  },
  getName() {
    return this.get('name')
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
    return $('<a class="btn rad-all prep" target="_blank"></a>')
      .html('Prepare For Your Visit')
      .attr('href', this.getPODLink())
  },
  getTip() {
    return $('<div></div>')
      .append(this.nameHtml())
      .append(this.addressHtml())
      .append(this.detailsHtml())
      .append('<i class="dir-tip">Click on site for directions</i>')
  },
  getAddress1() {
    return this.get('addr')
  },
  getCityStateZip() {
    return `${this.get('boro')}, NY ${this.get('zip')}`
  },
  getActive() {
    return this.active
  },
  getStatus() {
    const status = this.get('status')
    switch(status) {
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
    let date = this.get('updated')

    if(date){
      let date_convert = new Date(date)
      return `${date_convert.toLocaleDateString()} ${date_convert.toLocaleTimeString()}` 
    }
  },
  getOpeningTime() {
    let time = this.get('opening')

    if(time){
      let time_convert = new Date(time)
      return `${time_convert.toLocaleDateString()} ${time_convert.toLocaleTimeString()}` 
    }
  },
  getPODLink() {
    return this.get('lnk')
  },
  getWaitTime() {
    return this.get('wait')
  },
  detailsHtml() {
    if (this.getActive() === 'true') {
      
      let ul = $('<ul></ul>')

      if (this.getStatus() === 'Open to Public') {
        const wait = this.getWaitTime() ? this.getWaitTime() + ' minutes' : 'N/A'
        const waitTime = `<li><b>Wait time: </b>${wait}</li>`

        ul.append(waitTime)
      }
      else if(this.getStatus() === 'Opening Soon'){
        const openingTime = `<li><b>Estimated Opening Time: </b>${this.getOpeningTime()||'N/A'}</li>`
        ul.append(openingTime)
      }
    
      const status = `<li><b>Status: </b>${this.getStatus()}</li>`

      const update = this.getLatestDate()
      const latestUpdate = `<li><b>Last Updated: </b>${update||'N/A'}</li>`
      ul.append(latestUpdate)

      ul.prepend(status)

      return ul
    }
  }

}

export default decorations