import { Toaster } from "react-hot-toast";

const AppToast = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#1c1917", // stone-900
          color: "#ffffff",
          borderRadius: "12px",
        },
        success: {
          iconTheme: {
            primary: "#16a34a", // green-600
            secondary: "#ffffff",
          },
        },
        error: {
          iconTheme: {
            primary: "#dc2626", // red-600
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
};

export default AppToast;
