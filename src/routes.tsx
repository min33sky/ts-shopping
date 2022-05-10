
import React from 'react';
import GlobalLayout from './pages/_layout'

const DynamicIndex = React.lazy(() => import('./pages/index'));
const DynamicAbout = React.lazy(() => import('./pages/about'));
const DynamicCartIndex = React.lazy(() => import('./pages/cart/index'));
const DynamicProductsIndex = React.lazy(() => import('./pages/products/index'));
const DynamicProductsId = React.lazy(() => import('./pages/products/[id]'));


export const routes = [
  {
    path: '/',
    element: <GlobalLayout />,
    children: [
      { path: '/', element: <DynamicIndex />, index: true},
      { path: '/about', element: <DynamicAbout />, },
      { path: '/cart', element: <DynamicCartIndex />, index: true},
      { path: '/products', element: <DynamicProductsIndex />, index: true},
      { path: '/products/:id', element: <DynamicProductsId />, },
    ]
  }
]

export const pages = [
  { route: '/' },
  { route: '/about' },
  { route: '/cart' },
  { route: '/products' },
  { route: '/products/:id' },
]
