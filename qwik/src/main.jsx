// qwikloader must actually execute: it registers the delegated event
// listeners the container dispatches through. A static bare import is
// tree-shaken (@builder.io/qwik is marked sideEffects: false), so load it
// dynamically before render.
await import('@builder.io/qwik/qwikloader.js')
import { render } from '@builder.io/qwik'
import '../../shared/app.css'
import { App } from './app'

render(document.getElementById('app'), <App />)
