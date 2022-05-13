import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { checkedCartState } from '../../atoms/cart';
import { EXECUTE_PAY } from '../../graphql/payment';
import { graphqlFetcher } from '../../queryClient';
import PreviewPay from '../previewPay/PreviewPay';
import PaymentModal from './Modal';

type PayInfo = {
  id: string;
};

type PaymentInfos = PayInfo[];

function Payment() {
  const navigate = useNavigate();
  const [checkedCartData, setCheckCartData] = useRecoilState(checkedCartState);
  const [modalShown, setModalShown] = useState(false);
  const { mutate: executePay } = useMutation((payInfos: PaymentInfos) =>
    graphqlFetcher(EXECUTE_PAY, payInfos)
  );

  const showModal = () => {
    setModalShown(true);
  };

  // 결제 진행~~
  const proceed = () => {
    const payInfos = checkedCartData.map(({ id }) => ({ id }));
    executePay(payInfos);
    setCheckCartData([]); //? 결제한 상품들은 recoil에서 제거
    navigate('/products', { replace: true }); // 뒤로가기 ㄴㄴ
  };

  // 모달 종료
  const cancel = () => {
    setModalShown(false);
  };

  return (
    <div>
      <PreviewPay handleTitle="결제하기" handleSubmit={showModal} />
      <PaymentModal show={modalShown} proceed={proceed} cancel={cancel} />
    </div>
  );
}

export default Payment;
