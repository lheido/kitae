// import 'overlayscrollbars/overlayscrollbars.css'
import { render } from 'solid-js/web'
import './assets/preview.css'
import IframePreview from './IframePreview'

render(() => <IframePreview />, document.getElementById('root') as HTMLElement)
