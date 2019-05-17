import { BrowserView, BrowserViewConstructorOptions, Rectangle, AutoResizeOptions } from 'electron';
import { Identity } from '../api_protocol/transport_strategy/api_transport_base';
import { addBrowserView, getBrowserViewByIdentity, getWindowByUuidName, OfView } from '../core_state';
import { getRuntimeProxyWindow } from '../window_groups_runtime_proxy';
import { BrowserViewOptions, BrowserViewCreationOptions } from '../../../js-adapter/src/api/browserview/browserview';
import convertOptions = require('../convert_options');


// import { BrowserWindow, BrowserView, app } from 'electron';
// import { OpenFinWindow } from '../../shapes';
// const convertToElectron = require('../convert_options').convertToElectron;
// import * as coreState from '../core_state';


// export function addBrowserViewToWindow(options: any, win: BrowserWindow) {
//     const view = new BrowserView(convertToElectron({}, false));
//     const ofWin = coreState.getWinObjById(win.id);
//     if (!ofWin) {
//         return;
//     }
//     const name = app.generateGUID();
//     const uuid = ofWin.uuid;
//     ofWin.views.set(name, { info: { name, uuid, parent: { uuid, name: ofWin.name }, entityType: 'view' }, view });
//     //@ts-ignore
//     view.webContents.registerIframe = win.webContents.registerIframe.bind(view.webContents);
//     view.webContents.loadURL(options.url);
//     view.setBounds(options.bounds);
//     view.setAutoResize(Object.assign({ width: true, height: true }, options.autoResize));
//     win.setBrowserView(view);
// }
export interface BrowserViewOpts extends BrowserViewCreationOptions {
    uuid: string;
}

export function create(options: BrowserViewOpts) {
    const view = new BrowserView(convertOptions.convertToElectron({}, false));
    addBrowserView(options, view);
    view.webContents.loadURL(options.url);
    if (options.autoResize) {
        view.setAutoResize(options.autoResize);
    }
}

export async function attach(ofView: OfView, toIdentity: Identity) {
   const {view} = ofView;
   if (view) {
       const ofWin = getWindowByUuidName(toIdentity.uuid, toIdentity.name);
       let bWin;
       if (!ofWin) {
           const proxyWin = await getRuntimeProxyWindow(toIdentity);
           bWin = proxyWin.window.browserWindow;
       } else {
           bWin = ofWin.browserWindow;
       }
       bWin.setBrowserView(view);
   }
}


export async function setBounds(ofView: OfView, bounds: Rectangle) {
    const {view} = ofView;
    view.setBounds(bounds);
}