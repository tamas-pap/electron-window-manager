import isURL from 'is-url';
import { BrowserWindow } from 'electron';
import { calculateWindowPosition } from '@electron-helpers/window-positioner';

const state = {
  baseURL: undefined,
  defaultOptions: {
    width: 800,
    height: 600,
  },
  windows: {},
};

const createURL = url => (isURL(url) ? url : `${state.baseURL}${url}`);

export const setBaseURL = baseURL => {
  state.baseURL = baseURL;
};

export const getBaseURL = () => state.baseURL;

export const setDefaultOptions = options => {
  state.defaultOptions = { ...state.defaultOptions, ...options };
};

export const getDefaultOptions = () => state.defaultOptions;

export const createWindow = (name, url, options, position, showGracefully = true) => {
  const windowOptions = { ...state.defaultOptions, ...options };
  const windowSize = { width: windowOptions.width, height: windowOptions.height };
  const windowPosition = position && calculateWindowPosition(windowSize, position);

  const window = new BrowserWindow({
    ...windowOptions,
    ...windowPosition,
    show: !showGracefully && (!Object.hasOwnProperty.call(options, 'show') || options.show),
  });

  if (showGracefully) {
    window.once('ready-to-show', () => {
      window.show();
    });
  }

  window.loadURL(createURL(url));

  state.windows[name] = window;
  return window;
};

export const getWindow = name => state.windows[name];
