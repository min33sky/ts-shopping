import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import App from './App';
import './scss/index.scss';
// import { worker } from './mocks/browser';

//? vite에서 process.env 사용하는 문법
// if (import.meta.env.DEV) {
//   worker.start(); // msw 시작
// }

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
);
