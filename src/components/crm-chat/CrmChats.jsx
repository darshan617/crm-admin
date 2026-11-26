"use client";

import React, { useMemo, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FiPaperclip } from "react-icons/fi";
import { IoSend } from "react-icons/io5";
import styles from "./CrmChats.module.css";

const AVATAR_COLORS = [
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#14b8a6",
  "#3b82f6",
  "#ec4899",
  "#10b981",
];

const MOCK_CHATS = [
  {
    id: 1,
    name: "Pratik V",
    lastMessage: "wdfghm,",
    time: "04:58 PM",
    unread: false,
    messages: [
      { id: "d1", type: "date", label: "23 Oct 2026" },
      {
        id: "m1",
        type: "text",
        text: "Hi",
        time: "03:33 PM",
        outgoing: true,
      },
      {
        id: "m2",
        type: "image",
        fileName: "wallpaperflare.com_wallpaper.jpg",
        imageUrl:
          "https://images.unsplash.com/photo-1614850523459-c2f4ebd11285?w=400&h=280&fit=crop",
        time: "03:35 PM",
        outgoing: true,
      },
      { id: "d2", type: "date", label: "Today" },
      {
        id: "m3",
        type: "text",
        text: "wdfghm,",
        time: "04:58 PM",
        outgoing: true,
      },
    ],
  },
  {
    id: 2,
    name: "Janvi Singh",
    lastMessage: "helo",
    time: "22 Oct",
    unread: true,
    messages: [
      { id: "d1", type: "date", label: "22 Oct 2026" },
      {
        id: "m1",
        type: "text",
        text: "helo",
        time: "11:20 AM",
        outgoing: false,
      },
      {
        id: "m2",
        type: "text",
        text: "Hi Janvi, how can I help?",
        time: "11:22 AM",
        outgoing: true,
      },
    ],
  },
  {
    id: 3,
    name: "Amit Upadhyay",
    lastMessage: "wallpaperflare.com_wa...",
    time: "22 Oct",
    unread: false,
    messages: [
      { id: "d1", type: "date", label: "22 Oct 2026" },
      {
        id: "m1",
        type: "image",
        fileName: "wallpaperflare.com_wallpaper.jpg",
        imageUrl:
          "https://images.unsplash.com/photo-1614850523459-c2f4ebd11285?w=400&h=280&fit=crop",
        time: "02:10 PM",
        outgoing: false,
      },
    ],
  },
  {
    id: 4,
    name: "Dharmendra B",
    lastMessage: "Testing",
    time: "19 Oct",
    unread: true,
    messages: [
      { id: "d1", type: "date", label: "19 Oct 2026" },
      {
        id: "m1",
        type: "text",
        text: "Testing",
        time: "09:05 AM",
        outgoing: false,
      },
    ],
  },
];

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

const getAvatarColor = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const Avatar = ({ name, size = "md" }) => (
  <span
    className={`${styles.avatar} ${size === "lg" ? styles.avatarLg : ""}`}
    style={{ backgroundColor: getAvatarColor(name) }}
    aria-hidden="true"
  >
    {getInitials(name)}
  </span>
);

const CrmChats = () => {
  const [filter, setFilter] = useState("recent");
  const [search, setSearch] = useState("");
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [draft, setDraft] = useState("");

  const selectedChat = useMemo(
    () => MOCK_CHATS.find((chat) => chat.id === selectedChatId) || null,
    [selectedChatId],
  );

  const filteredChats = useMemo(() => {
    const query = search.trim().toLowerCase();

    return MOCK_CHATS.filter((chat) => {
      const matchesFilter = filter === "recent" || chat.unread;
      const matchesSearch =
        !query ||
        chat.name.toLowerCase().includes(query) ||
        chat.lastMessage.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

  const handleSend = (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    setDraft("");
  };

  return (
    <div className="content">
      <div className={styles.chatShell}>
        <aside className={styles.sidebar}>
          <h1 className={styles.title}>CRM Chat</h1>

          <div className={styles.searchWrap}>
            <CiSearch className={styles.searchIcon} aria-hidden="true" />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className={styles.tabs}>
            <button
              type="button"
              className={`${styles.tab} ${
                filter === "recent" ? styles.tabActive : ""
              }`}
              onClick={() => setFilter("recent")}
            >
              Recent
            </button>
            <button
              type="button"
              className={`${styles.tab} ${
                filter === "unread" ? styles.tabActive : ""
              }`}
              onClick={() => setFilter("unread")}
            >
              Unread
            </button>
          </div>

          <p className={styles.sectionLabel}>MESSAGES</p>

          <ul className={styles.chatList}>
            {filteredChats.map((chat) => (
              <li key={chat.id}>
                <button
                  type="button"
                  className={`${styles.chatItem} ${
                    selectedChatId === chat.id ? styles.chatItemActive : ""
                  }`}
                  onClick={() => setSelectedChatId(chat.id)}
                >
                  <Avatar name={chat.name} />
                  <span className={styles.chatMeta}>
                    <span className={styles.chatTopRow}>
                      <span className={styles.chatName}>{chat.name}</span>
                      <span className={styles.chatTime}>{chat.time}</span>
                    </span>
                    <span className={styles.chatPreview}>
                      {chat.lastMessage}
                    </span>
                  </span>
                </button>
              </li>
            ))}

            {filteredChats.length === 0 && (
              <li className={styles.emptyList}>No conversations found</li>
            )}
          </ul>
        </aside>

        <section className={styles.panel}>
          {!selectedChat ? (
            <div className={styles.emptyState}>
              <h2>Select a conversation</h2>
              <p>Search a user to start a new chat.</p>
            </div>
          ) : (
            <>
              <header className={styles.panelHeader}>
                <Avatar name={selectedChat.name} size="lg" />
                <div>
                  <h2 className={styles.panelName}>{selectedChat.name}</h2>
                  <p className={styles.panelSub}>Direct</p>
                </div>
              </header>

              <div className={styles.messages}>
                {selectedChat.messages.map((item) => {
                  if (item.type === "date") {
                    return (
                      <div key={item.id} className={styles.dateDivider}>
                        <span>{item.label}</span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={item.id}
                      className={`${styles.bubbleRow} ${
                        item.outgoing ? styles.outgoing : styles.incoming
                      }`}
                    >
                      <div
                        className={`${styles.bubble} ${
                          item.outgoing
                            ? styles.bubbleOutgoing
                            : styles.bubbleIncoming
                        }`}
                      >
                        {item.type === "image" ? (
                          <div className={styles.imageMessage}>
                            <img src={item.imageUrl} alt={item.fileName} />
                            <p className={styles.fileName}>{item.fileName}</p>
                          </div>
                        ) : (
                          <p className={styles.bubbleText}>{item.text}</p>
                        )}
                        <span className={styles.bubbleTime}>{item.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <form className={styles.composer} onSubmit={handleSend}>
                <button
                  type="button"
                  className={styles.attachBtn}
                  aria-label="Attach file"
                >
                  <FiPaperclip />
                </button>
                <input
                  type="text"
                  className={styles.messageInput}
                  placeholder="Type a message"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
                <button
                  type="submit"
                  className={styles.sendBtn}
                  aria-label="Send message"
                  disabled={!draft.trim()}
                >
                  <IoSend />
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default CrmChats;
