import React from 'react';
import { createPortal } from 'react-dom';

/**
 * 모달을 위한 포탈 생성 컴포넌트
 * @returns
 */
export function ModalPortal({ children }: { children: React.ReactNode }) {
  return createPortal(children, document.querySelector('#modal')!);
}

function PaymentModal({
  show,
  proceed,
  cancel,
}: {
  show: boolean;
  proceed: () => void;
  cancel: () => void;
}) {
  return show ? (
    <ModalPortal>
      <div className={`modal ${show && 'show'}`}>
        <div className="modal__inner">
          <p>정말 결제할까요?</p>
          <div>
            <button onClick={proceed}>예</button>
            <button onClick={cancel}>아니오</button>
          </div>
        </div>
      </div>
    </ModalPortal>
  ) : null;
}

export default PaymentModal;
