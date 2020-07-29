import OlFeature from 'ol/Feature'
import Content from 'nyc-lib/nyc/Content'
import decorations from '../src/js/decorations'
import Point from 'ol/geom/Point';
import pods from '../src/js/pods'
import MapMgr from 'nyc-lib/nyc/ol/MapMgr'
import facilityStyle from '../src/js/facility-style'

const mockApp = {remove: []}

const pointStyle = facilityStyle.pointStyle
const icon  = decorations.icon

facilityStyle.pointStyle = jest.fn()
decorations.icon = jest.fn()

let messages = [
  {
    title: 'title',
    marquee: 'marquee',
    splash: 'splash',
    active: 'true'
  }
]
let content = new Content(messages)

//active, closed
const examplePOD1 = new OlFeature({
  geometry: new Point([100, 200]),
  PODSiteName: 'POD_Site_Name',
  Address: 'Address',
  Borough: 'Borough',
  ZIP: 'Zip',
  DOECode: 'POD_ID-1',
  Ops_status: 'Closed to Public',
  wait_time: 'Wait_Time',
  LatestDate: '1/10/2019,3:54 PM',
  OpeningTime: 'Opening_Time',
  LabelPos: 'N S E W',
  DOHMHPODLink: 'DOHMHPODLink-1',
  Link1: 'Link1-1',
  Label1: 'Label1-1',
  Link2: 'Link2-1',
  Label2: 'Label2-1',
  Link3: 'Link3-1',
  Label3: 'Label3-1',
  Icon: 'library-name/icon-name-1#ff0000',
  extra1: 'Extra1',
  extra2: 'Extra2'
})

$.extend(examplePOD1, MapMgr.FEATURE_DECORATIONS, decorations, {facilityStyle, content, app: mockApp})
examplePOD1.extendFeature()

//active, open
const examplePOD2 = new OlFeature({
  geometry: new Point([100, 100]),
  PODSiteName: 'POD_Site_Name',
  Address: 'Address',
  Borough: 'Borough',
  ZIP: 'Zip',
  DOECode: 'POD_ID-2',
  Ops_status: 'Open to Public',
  wait_time: 'Wait_Time',
  LatestDate: '1/10/2019,3:54 PM',
  OpeningTime: 'Opening_Time',
  LabelPos: 'N S',
  DOHMHPODLink: 'DOHMHPODLink-2',
  Link1: 'Link1-2',
  Label1: 'Label1-2',
  Link2: 'Link2-2',
  Label2: 'Label2-2'
})

$.extend(examplePOD2, MapMgr.FEATURE_DECORATIONS, decorations, {facilityStyle, content, app: mockApp})
examplePOD2.extendFeature()

const examplePOD3 = new OlFeature({
  geometry: new Point([200, 200]),
  PODSiteName: 'POD_Site_Name',
  Address: 'Address',
  Borough: 'Borough',
  ZIP: 'Zip',
  DOECode: 'POD_ID-3',
  Ops_status: 'Mobilizing',
  wait_time: 'Wait_Time',
  LatestDate: '1/10/2019,3:54 PM',
  OpeningTime: '1/10/2019,3:55 PM',
  LabelPos: 'W N S',
  Link1: 'Link1-3',
  Label1: 'Label1-3',
  Link2: 'Link2-3',
  Label2: 'Label2-3',
  Link3: 'Link3-3',
  Label3: 'Label3-3'
})

$.extend(examplePOD3, MapMgr.FEATURE_DECORATIONS, decorations, {facilityStyle, content, app: mockApp})
examplePOD3.extendFeature()

const examplePOD5 = new OlFeature({
  geometry: new Point([300, 0]),
  PODSiteName: 'POD_Site_Name',
  Address: 'Address',
  Borough: 'Borough',
  ZIP: 'Zip',
  DOECode: 'POD_ID-5',
  LabelPos: '',
  Ops_status: pods.NOT_ACTIVE_STATUS,
  wait_time: 'Wait_Time',
  LatestDate: '1/10/2019,3:54 PM',
  OpeningTime: 'Opening_Time',
  DOHMHPODLink: 'Link-5'
})

$.extend(examplePOD5, MapMgr.FEATURE_DECORATIONS, decorations, {facilityStyle, content, app: mockApp})
examplePOD5.extendFeature()


//inactive
messages = [
  {
    title: 'title',
    marquee: 'marquee',
    splash: 'splash',
    active: 'false'
  }
]
content = new Content(messages)

const examplePOD4 = new OlFeature({
  PODSiteName: 'POD_Site_Name',
  Address: 'Address',
  Borough: 'Borough',
  ZIP: 'Zip',
  DOECode: 'POD_ID-4',
  Ops_status: 'Closed to Public',
  wait_time: 'Wait_Time',
  LatestDate: 'Latest_Update',
  OpeningTime: 'Opening_Time',
  LabelPos: 'W',
  DOHMHPODLink: 'Link'
})

$.extend(examplePOD4, MapMgr.FEATURE_DECORATIONS, decorations, {facilityStyle, content, app: mockApp})
examplePOD4.extendFeature()

const examplePOD6 = new OlFeature({
  PODSiteName: '',
  Address: '',
  Borough: '',
  ZIP: '',
  DOECode: '',
  Ops_status: '',
  wait_time: '',
  LatestDate: '',
  OpeningTime: '',
  LabelPos: '',
  DOHMHPODLink: ''
})

$.extend(examplePOD6, MapMgr.FEATURE_DECORATIONS, decorations, {facilityStyle, content, app: mockApp})
examplePOD6.extendFeature()


//active, closed, no icon
messages = [
  {
    title: 'title',
    marquee: 'marquee',
    splash: 'splash',
    active: 'true'
  }
]
content = new Content(messages)

const examplePOD7 = new OlFeature({
  PODSiteName: 'POD_Site_Name',
  Address: 'Address',
  Borough: 'Borough',
  ZIP: 'Zip',
  DOECode: 'POD_ID-7',
  Ops_status: 'Closed to Public',
  wait_time: 'Wait_Time',
  LatestDate: 'Latest_Update',
  OpeningTime: 'Opening_Time',
  LabelPos: 'W',
  DOHMHPODLink: 'Link'
})

$.extend(examplePOD7, MapMgr.FEATURE_DECORATIONS, decorations, {facilityStyle, content, app: mockApp})
examplePOD7.extendFeature()

module.exports = {mockApp, examplePOD1,examplePOD2,examplePOD3,examplePOD4,examplePOD5, examplePOD6, examplePOD7, pointStyle, icon}