import React, { useContext, useEffect } from "react";
import Header from "../components/Apartment/Header";
import Footer from "../components/Apartment/Footer";
import { getUsername } from "../api/users/getUsers";
import { getMessageUsers } from "../api/messages/getMessageUser";
import { HouseContext } from "../components/Apartment/HouseContext";
const MainLayout = ({ children }) => {
  const { user, setUser, message, setMessage } = useContext(HouseContext);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.username) {
        try {
          const userData = await getUsername(user.username);
          if (userData) {
            setUser(userData);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    const fetchMessageData = async () => {
      if (user?.id) {
        try {
          const messages = await getMessageUsers(user.id);
          if (messages) {
            setMessage(messages);
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };

    fetchUserData();
    fetchMessageData();
  }, [user?.username, user?.id, setUser, setMessage]);
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
