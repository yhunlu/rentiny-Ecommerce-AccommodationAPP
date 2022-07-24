import { Modal } from 'antd';

interface Props {
    modalVisible: boolean;
    setModalVisible: (modalVisible: boolean) => void;
}

const ListingCreateBookingModal = ({
    modalVisible,
    setModalVisible,
}: Props) => {
    return (
        <Modal
            visible={modalVisible}
            centered
            footer={null}
            onCancel={() => setModalVisible(false)}
        ></Modal>
    );
};

export default ListingCreateBookingModal;
