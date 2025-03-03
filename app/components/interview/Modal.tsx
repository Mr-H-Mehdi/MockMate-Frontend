// components/interview/Modal.tsx
const Modal = ({ isOpen, onClose, onTerminate }: { isOpen: boolean; onClose: () => void; onTerminate: () => void }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg max-w-sm w-full text-center">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Are you sure you want to terminate incomplete interview?
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            This action will discard the interview and prevent it from being saved for future reference.
          </p>
          <div className="flex justify-around">
            <button
              className="bg-secondary text-primary px-4 py-2 rounded mr-4"
              onClick={onClose} // Close the modal on cancel
            >
              Cancel
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={onTerminate} // Handle the termination
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default Modal;
  