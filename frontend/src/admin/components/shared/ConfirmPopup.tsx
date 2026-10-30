interface ConfirmPopupProps {
    open: boolean;
    message: string;
    cancelText?: string;
    confirmText?: string;
    showCancel?: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

const ConfirmPopup = ({
    open,
    message,
    cancelText = "Cancel",
    confirmText = "Confirm",
    showCancel = true,
    onCancel,
    onConfirm,
}: ConfirmPopupProps) => {

    if (!open) {
        return null;
    }

    return (
        <div className="confirmPopupOverlay">
            <div className="confirmPopupBox">

                <p className="confirmPopupMessage">
                    {message}
                </p>

                <div className="confirmPopupButtons">

                    {showCancel && (
                        <button
                            type="button"
                            className="confirmPopupCancel"
                            onClick={onCancel}
                        >
                            {cancelText}
                        </button>
                    )}

                    {confirmText && (
                        <button
                            className="confirmPopupConfirm"
                            type="button"
                            onClick={onConfirm}
                        >
                            {confirmText}
                        </button>
                    )}

                </div>

            </div>
        </div>
    );
};

export default ConfirmPopup;