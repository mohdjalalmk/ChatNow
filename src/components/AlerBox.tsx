import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

type ModalAlertProps = {
  visible: boolean;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  logo?: React.ReactNode; // Optional logo prop
};

const ModalAlert = ({
  visible,
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  logo, // Destructure logo prop
}: ModalAlertProps) => {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {logo && <View style={styles.logoContainer}>{logo}</View>} {/* Render logo if provided */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#dc3545",
    padding: 12,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: "center",
  },
  confirmText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  logoContainer: {
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ModalAlert;
