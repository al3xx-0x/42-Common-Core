"use client";
import {
  Ban,
  Gamepad2,
  Search,
  SendHorizonal,
  Smile,
  X,
  ArrowLeft,
} from "lucide-react";
import { useState, useEffect, useRef, useContext, Suspense } from "react";
import { io, Socket } from "socket.io-client";
import { User, UserContext, useUser } from "@/app/types";
import { useTranslation } from "react-i18next";
import { timeStamp } from "console";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { fetchWithToken, getImageUrl } from "@/app/Utils";
import { baseUrl } from "@/app/types";
import { router } from "next/client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSocket } from "@/context/SocketContext";

interface Message {
  from: number;
  to: number;
  text: string;
  isread?: boolean;
  timestamp?: string;
}

interface Contact {
  id: number;
  name: string;
  username: string;
  avatar?: string;
  lastMessage?: string;
  messageDate?: string;
}

function ChatComponent() {
  const { t } = useTranslation();

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isSelected, setIsSelected] = useState<number | null>(null);
  const [myId, setMyId] = useState<number>(0);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [allUsers, setAllUsers] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [contactsLoading, setContactsLoading] = useState(false);
  const { socket } = useSocket();
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [showEmojiePicker, setEmojiePicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [unreadCounts, setUnreadCounts] = useState<{ [key: number]: number }>(
    {}
  );
  const [blockedUsers, setBlockedUsers] = useState<number[]>([]);
  const [blockedByUsers, setBLockedByUsers] = useState<number[]>([]);
  const [blockStatus, setBlockStatus] = useState<{
    [key: number]: {
      isBlocked: boolean;
      iBlockedThem: boolean;
      theyBlockedMe: boolean;
      blockDirection: "i_blocked_them" | "they_blocked_me" | "none";
    };
  }>({});
  const { user } = useUser();
  const router = useRouter();
  const [selectedContact, setSelectedContact] = useState(
    contacts.find((c) => c.id === isSelected)
  );
  const params = useSearchParams();

  const [showContacts, setShowContacts] = useState(true);

  const handleContactSelect = (contactId: number) => {
    setIsSelected(contactId);
    setSelectedContact(contacts.find((c) => c.id === contactId));
    setShowContacts(false);
  };

  const handleBackToContacts = () => {
    setIsSelected(null);
    setSelectedContact(undefined);
    setShowContacts(true);
  };

  useEffect(() => {
    if (user && user.id) {
      setMyId(user.id);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isSelected && contacts.length > 0) {
      const contact = contacts.find((c) => c.id === isSelected);
      setSelectedContact(contact);
    }
  }, [isSelected, contacts]);


  const fetchContacts = async () => {
    if (!myId || myId === 0) {
      return;
    }

    try {
      setContactsLoading(true);

      const response = await fetchWithToken(`${baseUrl}/api/friends`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { friends } = await response.json();
      const transformedContacts = friends
        .map((user: User) => ({
          id: user.id,
          name: user.first_name || user.username,
          username: user.username,
          avatar: user.profile_image,
          lastMessage: "No messages yet",
          messageDate: "",
        }));

      setAllUsers(transformedContacts);
      setContacts(transformedContacts);
    } catch (error) {
    } finally {
      setContactsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    const usersExcludingMe = allUsers.filter((user) => user.id !== myId);

    if (value.trim() === "") {
      setContacts(usersExcludingMe);
    } else {
      const filteredContacts = usersExcludingMe.filter(
        (contact) =>
          contact.name.toLowerCase().includes(value.toLowerCase()) ||
          contact.username.toLowerCase().includes(value.toLowerCase())
      );
      setContacts(filteredContacts);
    }
  };

  const fetchUnreadCounts = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/api/messages/unread?receiver=${myId}`
      );
      const data: { sender_id: number; unreadCount: number }[] =
        await response.json();

      const counts: { [key: number]: number } = {};
      data.forEach((item) => {
        counts[item.sender_id] = item.unreadCount;
      });
      setUnreadCounts(counts);
    } catch (err) {}
  };
  const handleBlockUser = async (userId: number) => {
    try {
      const response = await fetchWithToken(`${baseUrl}/api/block`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blockedId: userId }),
      });

      if (response.ok) {
        setBlockStatus((prev) => ({
          ...prev,
          [userId]: {
            isBlocked: true,
            iBlockedThem: true,
            theyBlockedMe: false,
            blockDirection: "i_blocked_them",
          },
        }));
        setBlockedUsers((prev) => [...prev, userId]);
      } else {
        const error = await response.json();
        alert("Failed to block user: " + error.error);
      }
    } catch (error) {
      console.error("Error blocking user:", error);
      alert("Error blocking user");
    }
  };

  const handleUnblockUser = async (userId: number) => {
    try {
      const response = await fetchWithToken(`${baseUrl}/api/block/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBlockStatus((prev) => ({
          ...prev,
          [userId]: {
            isBlocked: false,
            iBlockedThem: false,
            theyBlockedMe: false,
            blockDirection: "none",
          },
        }));
        setBlockedUsers((prev) => prev.filter((id) => id !== userId));
      } else {
        const error = await response.json();
        console.error("Failed to unblock user:", error);
        alert("Failed to unblock user: " + error.error);
      }
    } catch (error) {
      console.error("Error unblocking user:", error);
      alert("Error unblocking user");
    }
  };

  const checkBlockStatus = async (userId: number) => {
    try {
      const response = await fetchWithToken(
        `${baseUrl}/api/block/check/${userId}`
      );

      if (response.ok) {
        const result = await response.json();
        setBlockStatus((prev) => ({
          ...prev,
          [userId]: {
            isBlocked: result.isBlocked,
            iBlockedThem: result.iBlockedThem,
            theyBlockedMe: result.theyBlockedMe,
            blockDirection: result.blockDirection,
          },
        }));
        return result.isBlocked;
      } else {
        console.error("Failed to check block status");
        return false;
      }
    } catch (error) {
      console.error("Error checking block status:", error);
      return false;
    }
  };

  const fetchBlockedUsers = async () => {
    try {
      const response = await fetchWithToken(`${baseUrl}/api/blocked`);

      if (response.ok) {
        const result = await response.json();
        setBlockedUsers(result.blockedUsers);

        const newBlockStatus: { [key: number]: any } = {};
        result.blockedUsers.forEach((userId: number) => {
          newBlockStatus[userId] = {
            isBlocked: true,
            iBlockedThem: true,
            theyBlockedMe: false,
            blockDirection: "i_blocked_them",
          };
        });
        setBlockStatus((prev) => ({ ...prev, ...newBlockStatus }));
      } else {
        console.error("Failed to fetch blocked users");
      }
    } catch (error) {
      console.error("Error fetching blocked users:", error);
    }
  };
  const loadAllBlockStatuses = async () => {
    if (contacts.length === 0) return;

    try {
      const statusPromises = contacts.map((contact) =>
        checkBlockStatus(contact.id)
      );
      await Promise.all(statusPromises);
    } catch (error) {
      console.error("Error loading block statuses:", error);
    }
  };

  useEffect(() => {
    fetchContacts();
    fetchUnreadCounts();
    fetchBlockedUsers();
    setSearchTerm("");
  }, [myId]);

  useEffect(() => {
    if (!socket) return;

    const handleOnlineUsers = (users: string[]) => {
      setOnlineUsers(users.map((user) => parseInt(user)));
    };

    const handlePrivateMessage = (message: Message) => {
      if (message.from === myId || message.to === myId) {
        setMessages((prev) => {
          const exists = prev.some(
            (msg) =>
              msg.from === message.from &&
              msg.to === message.to &&
              msg.timestamp === message.timestamp
          );
          if (!exists) {
            return [...prev, message];
          }
          return prev;
        });
        fetchUnreadCounts();
        setContacts((prev) =>
          prev.map((contact) => {
            if (contact.id === message.from || contact.id === message.to) {
              return {
                ...contact,
                lastMessage: message.text,
                messageDate: parseTime(message.timestamp),
              };
            }
            return contact;
          })
        );
      }
    };

    const handleMessageBlocked = (data: any) => {
      alert(
        "Your message was blocked. This user has blocked you or you have blocked them."
      );
    };

    const handleGameInviteSent = (data: any) => {
      alert(`Game invite sent to ${data.receiverUsername}!`);
    };

    const handleGameInviteError = (data: any) => {
      console.error("Game invite error:", data);
      alert(data.message || "Failed to send game invite. Please try again.");
    };

    const handleGameInviteReceived = (data: any) => {
    };
    socket.on("onlineUsers", handleOnlineUsers);
    socket.on("privateMessage", handlePrivateMessage);
    socket.on("messageBlocked", handleMessageBlocked);
    socket.on("gameInviteSent", handleGameInviteSent);
    socket.on("gameInviteError", handleGameInviteError);
    socket.on("gameInviteReceived", handleGameInviteReceived);
    if (myId) {
      socket.emit("register", myId);
    }
    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
      socket.off("privateMessage", handlePrivateMessage);
      socket.off("messageBlocked", handleMessageBlocked);
      socket.off("gameInviteSent", handleGameInviteSent);
      socket.off("gameInviteError", handleGameInviteError);
      socket.off("gameInviteReceived", handleGameInviteReceived);
    };
  }, [socket, myId]);

  const fetchMessages = async (senderId: number, receiverId: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${baseUrl}/api/messages?sender=${senderId}&receiver=${receiverId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLastMessage = async (contactId: number) => {
    try {
      const res = await fetch(
        `${baseUrl}/api/messages/last?sender=${myId}&receiver=${contactId}`
      );
      if (!res.ok) throw new Error("Failed to fetch last message");
      const data = await res.json();
      if (!data) return null;
      return {
        id: data.id,
        from: data.sender_id,
        to: data.receiver_id,
        text: data.message,
        timestamp: data.time,
        isread: data.is_read === 1,
      };
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const parseTime = (timestamp?: string) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    if (isSelected && myId) {
      fetchMessages(myId, isSelected);
      checkBlockStatus(isSelected);
      fetch(
        `${baseUrl}/api/messages/read?sender=${isSelected}&receiver=${myId}`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.from === isSelected ? { ...msg, isRead: true } : msg
            )
          );
          setUnreadCounts((prev) => ({ ...prev, [isSelected]: 0 }));
        })
        .catch((err) => console.error("Failed to mark messages as read:", err));
    } else {
      setMessages([]);
    }
  }, [isSelected, myId]);

  useEffect(() => {
    const updateContactsWithLastMessages = async () => {
      const filteredUsers = allUsers.filter((user) => user.id !== myId);

      const updatedContacts = await Promise.all(
        filteredUsers.map(async (contact) => {
          const lastMsg = await fetchLastMessage(contact.id);
          return {
            ...contact,
            lastMessage: lastMsg?.text || "",
            messageDate: lastMsg?.timestamp
              ? new Date(lastMsg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "",
          };
        })
      );
      setContacts(updatedContacts);
      setTimeout(() => {
        loadAllBlockStatuses();
      }, 100);
    };

    if (allUsers.length > 0) updateContactsWithLastMessages();
  }, [allUsers, myId]);
  const sendGameInvite = () => {
    if (!isSelected) {
      console.error("No contact selected");
      alert("Please select a contact to send a game invite");
      return;
    }

    if (!socket) {
      console.error("Socket not connected");
      alert("Not connected to server. Please try again.");
      return;
    }
    // Check if user is blocked
    const currentBlockStatus = blockStatus[isSelected];
    if (currentBlockStatus?.isBlocked) {
      if (currentBlockStatus.iBlockedThem) {
        alert("You have blocked this user. Unblock them to send game invites.");
      } else {
        alert("This user has blocked you. You cannot send game invites.");
      }
      return;
    }

    socket.emit("gameInvite", { receiverId: isSelected });
  };

  function sendMessage() {
    if (messageInput.trim() !== "" && isSelected && socket) {
      const message: Message = {
        from: myId,
        to: isSelected,
        text: messageInput.trim(),
        timestamp: new Date().toISOString(),
        isread: false,
      };

      socket.emit("privateMessage", message);
      setMessageInput("");
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    const id = Number(params.get("id")) || Number(params.get("contact"));
    if (!id) return;
    setSelectedContact(contacts.find((c) => c.id === id));
    setIsSelected(id);
    setShowContacts(false);
  }, [contacts]);

  const conversationMessages = messages.filter(
    (msg) =>
      (msg.from === myId && msg.to === isSelected) ||
      (msg.from === isSelected && msg.to === myId)
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationMessages]);

  return (
    <AnimatePresence mode="wait">
      <div className="flex h-screen overflow-hidden">
        <main className="flex-1 md:ml-20 pt-24 pb-4 mb-2 mt-2 px-4 md:px-6 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            <Motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-2 h-full"
            >
              <div
                className={`lg:col-span-1 ${
                  !showContacts ? "hidden lg:block" : "block"
                } order-2 lg:order-1 h-full flex flex-col overflow-hidden`}
              >
                <div className="flex flex-col h-full space-y-6 p-6 bg-[#081C29]/80 border border-[#21364a] hover:border-[#23ccdc]/30 rounded-lg lg:rounded-l-2xl lg:rounded-r-none transition-all duration-300">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {t("chat.chats")}
                  </h1>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a4aca7] h-4 w-4" />
                    <input
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder={t("chat.searchUsers")}
                      className="pl-10 bg-[#113A4B]/50 border border-[#498195]/30 text-white focus:border-[#23ccdc] focus:outline-none w-full h-10 rounded-md px-3 py-2 transition-all duration-300"
                    />
                  </div>
                  <div className="max-h-[950px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex-1 space-y-3 md:space-y-4">
                    {contactsLoading ? (
                      <div className="flex justify-center items-center py-8">
                        <div className="text-[#A4ACA7]">
                          {t("chat.loadingUsers")}
                        </div>
                      </div>
                    ) : contacts.length === 0 ? (
                      <div className="flex justify-center items-center py-8">
                        <div className="text-[#A4ACA7]">
                          {searchTerm
                            ? `${t("chat.noUsersFoundFor")} "${searchTerm}"`
                            : t("chat.noUsersFound")}
                        </div>
                      </div>
                    ) : (
                      contacts.map((contact, index) => (
                        <div
                          key={contact.id}
                          className={`flex items-center animations py-3 px-3 rounded-lg cursor-pointer w-full transition-all duration-300
                                ${
                                  isSelected === contact.id
                                    ? "bg-gradient-to-r from-[#00F5FF]/20 to-[#23ccdc]/20 border border-[#00F5FF]/30"
                                    : "hover:bg-[#113A4B]/30 border border-transparent hover:border-[#23ccdc]/20"
                                } `}
                          onClick={() => handleContactSelect(contact.id)}
                        >
                          <div className="flex flex-row w-full animations justify-center md:justify-between gap-3">
                            <div className="flex flex-row justify-center gap-4 min-w-0 flex-1">
                              {" "}
                              {/* Added min-w-0 and flex-1 */}
                              <div className="relative flex flex-shrink-0">
                                {" "}
                                {/* Added flex-shrink-0 */}
                                <div className="h-12 w-12 relative flex shrink-0 overflow-hidden rounded-full">
                                  <img
                                    src={getImageUrl(contact.avatar ?? "")}
                                    className="aspect-square h-full w-full object-cover"
                                    alt={contact.name}
                                  />
                                </div>
                                <div
                                  className={`absolute bottom-0 right-0.5 w-3.5 h-3.5 bg-[#00ff88] rounded-full border-2 border-[#113a4b] ${
                                    onlineUsers.includes(contact.id)
                                      ? "bg-[#00ff88] animate-pulse"
                                      : "bg-[#5d5d5d]"
                                  }`}
                                />
                              </div>
                              <div className="flex min-w-0 flex-col justify-center gap-1 flex-1">
                                {" "}
                                <p className="text-white font-bold hidden md:block md:text-base truncate">
                                  @{contact.username}
                                </p>
                                <p className="text-[#A4ACA7] font-medium hidden md:block text-sm md:text-base truncate">
                                  {contact.lastMessage ||
                                    t("chat.noMessagesYet")}
                                </p>
                              </div>
                            </div>

                            <div className="flex-col hidden md:flex justify-center items-end gap-1 flex-shrink-0">
                              {" "}
                              <p className="text-[#A4ACA7] font-normal text-[14px]">
                                {contact.messageDate}
                              </p>
                              {unreadCounts[contact.id] > 0 && (
                                <div className="flex items-center justify-center rounded-full bg-[#00F5FF] h-5 w-5">
                                  <span className="text-black text-xs font-bold">
                                    {unreadCounts[contact.id]}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              <div
                className={`lg:col-span-3 ${
                  showContacts ? "hidden lg:block" : "block"
                } order-1 lg:order-2 h-full flex flex-col overflow-hidden`}
              >
                <div className="relative flex flex-col justify-between rounded-lg lg:rounded-r-2xl lg:rounded-l-none h-full w-full bg-[#081C29]/80 border border-[#21364a] hover:border-[#23ccdc]/30 transition-all duration-300">
                  {!isSelected && (
                    <div className="flex flex-col items-center justify-center h-full w-full mb-40">
                      <div className="space-y-6 max-w-md">
                        <img src="/images/chat.png" alt="" className="" />
                        <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
                          {t("chat.welcomeToChat")}
                        </h1>
                        <p className="text-md text-[#A4ACA7] text-center">
                          {t("chat.selectUserToStart")}
                        </p>
                      </div>
                    </div>
                  )}

                  {isSelected && (
                    <>
                      <div className="flex items-center justify-between p-2 lg:p-4 border-b border-[#21364a] bg-gradient-to-r from-[#113A4B]/30 to-[#081C29]/50">
                        <button
                          onClick={handleBackToContacts}
                          className="lg:hidden flex items-center justify-center h-10 w-10 rounded-lg bg-[#113A4B]/50 border border-[#498195]/30 text-[#00F5FF] hover:bg-[#113A4B]/70 hover:border-[#23ccdc]/50 transition-all duration-300 mr-3"
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </button>

                        <div
                          onClick={() =>
                            router.push(`/profile?id=${selectedContact?.id}`)
                          }
                          className="flex items-center space-x-3 lg:space-x-4 p-3 rounded-lg hover:bg-gradient-to-r cursor-pointer flex-1"
                        >
                          <div className="relative">
                            <div className="h-10 w-10 lg:h-12 lg:w-12 relative flex overflow-hidden rounded-full ring-2 ring-[#15638A]/30">
                              <img
                                src={getImageUrl(selectedContact?.avatar ?? "")}
                                className="aspect-square h-full w-full object-cover"
                                alt={selectedContact?.name}
                              />
                            </div>
                            <div
                              className={`absolute -bottom-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 rounded-full border-2 border-[#081C29] ${
                                onlineUsers.includes(selectedContact?.id || 0)
                                  ? "bg-emerald-400 animate-pulse"
                                  : "bg-gray-500"
                              }`}
                            />
                          </div>
                          <div>
                            <p className="text-white font-bold text-sm lg:text-lg">
                              {selectedContact?.name}
                            </p>
                            <p className="text-[#A4ACA7] text-xs lg:text-sm">
                              {onlineUsers.includes(selectedContact?.id || 0)
                                ? t("chat.online")
                                : t("chat.offline")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 lg:space-x-3">
                          <button
                            onClick={sendGameInvite}
                            disabled={blockStatus[isSelected!]?.isBlocked}
                            className={`h-9 w-9 lg:h-10 lg:w-10 border transition-all duration-300 hover:scale-105 rounded-lg flex items-center justify-center group ${
                              blockStatus[isSelected!]?.isBlocked
                                ? "bg-gray-500/20 text-gray-400 border-gray-500/40 cursor-not-allowed"
                                : "bg-[#113A4B]/50 border-[#498195]/30 text-[#00F5FF] hover:bg-[#113A4B]/70 hover:border-[#23ccdc]/50 hover:text-[#23ccdc]"
                            }`}
                            title={
                              blockStatus[isSelected!]?.isBlocked
                                ? t("chat.cannotInviteBlocked")
                                : t("chat.inviteToGame")
                            }
                          >
                            <Gamepad2 className="h-4 w-4 lg:h-5 lg:w-5 group-hover:animate-pulse" />
                          </button>
                          <button
                            onClick={() => {
                              const currentBlockStatus =
                                blockStatus[isSelected!];
                              if (currentBlockStatus?.iBlockedThem) {
                                handleUnblockUser(isSelected!);
                              } else if (!currentBlockStatus?.theyBlockedMe) {
                                handleBlockUser(isSelected!);
                              }
                            }}
                            disabled={blockStatus[isSelected!]?.theyBlockedMe}
                            className={`h-9 w-9 lg:h-10 lg:w-10 border transition-all duration-300 hover:scale-105 rounded-lg flex items-center justify-center group ${
                              blockStatus[isSelected!]?.theyBlockedMe
                                ? "bg-gray-500/20 text-gray-400 border-gray-500/40 cursor-not-allowed"
                                : blockStatus[isSelected!]?.iBlockedThem
                                ? "bg-[#113A4B]/50 border-[#498195]/30 text-green-400 hover:bg-[#113A4B]/70 hover:border-[#23ccdc]/50"
                                : "bg-[#113A4B]/50 border-[#498195]/30 text-[#FF6B6B] hover:bg-[#113A4B]/70 hover:border-[#FF6B6B]/50"
                            }`}
                            title={
                              blockStatus[isSelected!]?.theyBlockedMe
                                ? t("game.youAreBlocked")
                                : blockStatus[isSelected!]?.iBlockedThem
                                ? t("game.unblockUser")
                                : t("game.blockUser")
                            }
                          >
                            <Ban className="h-4 w-4 lg:h-5 lg:w-5 group-hover:animate-pulse" />
                          </button>
                        </div>
                      </div>
                      <div className="flex-1 overflow-hidden bg-gradient-to-b from-transparent to-[#081C29]/20">
                        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#15638A]/30 hover:scrollbar-thumb-[#15638A]/50">
                          <div className="flex flex-col justify-end min-h-full p-4 lg:p-6 space-y-3 lg:space-y-4">
                            {loading ? (
                              <div className="flex justify-center items-center py-12">
                                <div className="flex flex-col items-center space-y-3">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00F5FF]"></div>
                                  <div className="text-[#A4ACA7] text-sm">
                                    {t("chat.loadingMessages")}
                                  </div>
                                </div>
                              </div>
                            ) : conversationMessages.length === 0 ? (
                              <div className="flex flex-col justify-center items-center py-12 px-4">
                                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-[#00F5FF]/20 to-[#0BC5EA]/20 rounded-full flex items-center justify-center mb-4">
                                  <SendHorizonal className="h-8 w-8 lg:h-10 lg:w-10 text-[#00F5FF]" />
                                </div>
                                <div className="text-[#A4ACA7] text-center text-sm lg:text-base">
                                  {t("chat.noMessagesYetStart")}
                                </div>
                                <div className="text-[#A4ACA7]/70 text-center text-xs mt-2">
                                  {t("chat.sendFirstMessage")}{" "}
                                  {selectedContact?.username}
                                </div>
                              </div>
                            ) : (
                              conversationMessages.map((message, index) => {
                                const isMyMessage = message.from === myId;
                                return (
                                  <div
                                    key={index}
                                    className={`flex ${
                                      isMyMessage
                                        ? "justify-end"
                                        : "justify-start"
                                    } mb-2`}
                                  >
                                    <div
                                      className={`relative max-w-[75%] sm:max-w-[70%] md:max-w-[65%] lg:max-w-[60%] xl:max-w-[55%] ${
                                        isMyMessage
                                          ? "order-last"
                                          : "order-first"
                                      }`}
                                    >
                                      <div
                                        className={`px-3 py-2 lg:px-4 lg:py-3 rounded-2xl shadow-md transition-all duration-200 ${
                                          isMyMessage
                                            ? "bg-[#055E99]/70 text-white rounded-br-md"
                                            : "bg-black text-white rounded-bl-md"
                                        }`}
                                      >
                                        <p className="text-sm lg:text-base leading-relaxed break-words word-wrap overflow-wrap-anywhere whitespace-pre-wrap">
                                          {message.text}
                                        </p>
                                        <div
                                          className={`flex ${
                                            isMyMessage
                                              ? "justify-end"
                                              : "justify-start"
                                          } mt-1`}
                                        >
                                          <span className="text-xs opacity-75 font-medium">
                                            {parseTime(message.timestamp)}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                            <div ref={messagesEndRef}></div>
                          </div>
                        </div>
                      </div>
                      {blockStatus[isSelected!]?.isBlocked ? (
                        <div className="p-4 lg:p-6 border-t border-[#21364a] bg-gradient-to-r from-[#FF6B6B]/10 via-[#FF4E4E]/5 to-[#FF6B6B]/10">
                          <div className="text-center space-y-3 lg:space-y-4">
                            {blockStatus[isSelected!]?.iBlockedThem ? (
                              <>
                                <div className="flex items-center justify-center space-x-2 text-red-400">
                                  <Ban className="h-5 w-5" />
                                  <p className="font-medium text-sm lg:text-base">
                                    {t("chat.youBlockedUser")}
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleUnblockUser(isSelected!)}
                                  className="px-6 py-2.5 lg:px-8 lg:py-3 bg-[#113A4B]/50 border border-[#498195]/30 text-green-400 hover:bg-[#113A4B]/70 hover:border-[#23ccdc]/50 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium text-sm lg:text-base"
                                >
                                  {t("chat.unblockUser")}
                                </button>
                              </>
                            ) : blockStatus[isSelected!]?.theyBlockedMe ? (
                              <div className="space-y-2">
                                <div className="flex items-center justify-center space-x-2 text-red-400">
                                  <Ban className="h-5 w-5" />
                                  <p className="font-medium text-sm lg:text-base">
                                    {t("chat.userBlockedYou")}
                                  </p>
                                </div>
                                <p className="text-red-300/70 text-xs lg:text-sm">
                                  {t("chat.cannotSendMessages")}
                                </p>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center space-x-2 text-red-400">
                                <Ban className="h-5 w-5" />
                                <p className="font-medium text-sm lg:text-base">
                                  {t("chat.communicationBlocked")}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 lg:p-6 border-t border-[#21364a] bg-gradient-to-r from-[#113A4B]/20 to-[#081C29]/30">
                          <div className="relative">
                            <AnimatePresence>
                              {showEmojiePicker && (
                                <Motion.div
                                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                  transition={{ duration: 0.2 }}
                                  className="absolute right-0 bottom-20 z-50"
                                >
                                  <Picker
                                    data={data}
                                    onEmojiSelect={(emoji: {
                                      native: string;
                                    }) =>
                                      setMessageInput(
                                        messageInput + emoji.native
                                      )
                                    }
                                  />
                                </Motion.div>
                              )}
                            </AnimatePresence>
                        <div className="flex items-center space-x-3 lg:space-x-4">
                              <div className="flex-1 relative">
                                <input
                                  value={messageInput}
                                  onChange={(e) =>
                                    setMessageInput(e.target.value)
                                  }
                                  onKeyDown={handleKeyPress}
                                  placeholder={t("chat.typeMessage")}
                                  disabled={loading}
                                  className="w-full h-12 lg:h-14 pl-4 pr-32 lg:pr-36 bg-[#113A4B]/50 border border-[#498195]/30 text-white placeholder-[#a4aca7]/70 focus:border-[#23ccdc] focus:outline-none focus:ring-2 focus:ring-[#23ccdc]/20 rounded-lg transition-all duration-300 disabled:opacity-50 text-sm lg:text-base"
                                />
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 lg:space-x-2">
                                  {messageInput && (
                                    <button
                                      onClick={() => setMessageInput("")}
                                      className="h-8 w-8 lg:h-9 lg:w-9 flex items-center justify-center rounded-lg text-[#00F5FF]/80 hover:text-[#23ccdc] hover:bg-[#113A4B]/30 transition-all duration-300"
                                    >
                                      <X className="h-4 w-4 lg:h-5 lg:w-5" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() =>
                                      setEmojiePicker(!showEmojiePicker)
                                    }
                                    className="h-8 w-8 lg:h-9 lg:w-9 flex items-center justify-center rounded-lg text-[#00F5FF]/80 hover:text-[#23ccdc] hover:bg-[#113A4B]/30 transition-all duration-300"
                                  >
                                    <Smile className="h-4 w-4 lg:h-5 lg:w-5" />
                                  </button>
                                </div>
                              </div>
                              <button
                                onClick={sendMessage}
                                disabled={loading || !messageInput.trim()}
                                className="h-12 w-12 lg:h-14 lg:w-14 flex items-center justify-center rounded-lg bg-gradient-to-r from-[#0D3D6D] to-[#113A4B] border border-[#498195]/30 text-[#00F5FF] hover:from-[#1a5490] hover:to-[#2a66de] hover:border-[#23ccdc]/50 disabled:from-gray-500 disabled:to-gray-600 disabled:text-gray-300 disabled:border-gray-500/30 transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                              >
                                <SendHorizonal className="h-5 w-5 lg:h-6 lg:w-6" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </Motion.div>
          </div>
        </main>
      </div>
    </AnimatePresence>
  );
}

export default function Chat() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <ChatComponent />
    </Suspense>
  );
}
