import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "./MessagePage.module.css";
import supabase from "../../helper/supabaseClient";
import { sendMessage, getMessagesByRide } from "../../api/messages";
import { Message } from "../../types/index";
import { leaveRide, deleteRide, isRideHost, getRide, getRideMembers } from "../../api/rides";
import MembersPopup from "../MembersPopup/MembersPopup";
import ProfilePopup from "../ProfilePopup/ProfilePopup";
import ConfirmPopup from "../ConfirmPopup/ConfirmPopup";

interface Props {
  rideId: string | null;
  member_id: string | null;
  onLeave: () => void;
}

function MessagePage({ rideId, member_id, onLeave }: Props) {
  const [message, setMessage] = useState("");
  const [isLeaving, setIsLeaving] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [isMembersPopupOpen, setIsMembersPopupOpen] = useState(false);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch ride details
  const { data: rideDetails } = useQuery({
    queryKey: ["ride", rideId],
    queryFn: async () => {
      if (!rideId) return null;
      const response = await getRide(rideId);
      if (response.error) throw response.error;
      return response.data;
    },
    enabled: !!rideId
  });

  // Fetch ride members
  const { data: members = [] } = useQuery({
    queryKey: ["rideMembers", rideId],
    queryFn: async () => {
      if (!rideId) return [];
      const response = await getRideMembers(rideId);
      if (response.error) throw response.error;
      return response.data || [];
    },
    enabled: !!rideId
  });

  // Check if user is host
  useEffect(() => {
    const checkHost = async () => {
      if (!rideId) return;
      const response = await isRideHost(rideId);
      if (response.error) {
        console.error("Error checking host status:", response.error);
        return;
      }
      setIsHost(response.data || false);
    };
    
    checkHost();
  }, [rideId]);

  // Fetch and cache messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages", rideId],
    queryFn: async () => {
      if (!rideId) return [];
      const { data, error } = await getMessagesByRide(rideId);
      if (error) {
        console.error("Error fetching messages:", error);
        return [];
      }
      return data;
    },
    enabled: !!rideId,
    staleTime: Infinity,
  });

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mutation for sending a message
  const sendMessageMutation = useMutation({
    mutationFn: async (newMessage: string) => {
      if (!rideId) return;
      return sendMessage(rideId, newMessage);
    },
    onSuccess: () => {
      setMessage(""); // Clear input after sending
    },
  });

  useEffect(() => {
    if (!rideId) return;

    const channel = supabase
      .channel(`ride-${rideId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `ride_id=eq.${rideId}` },
        (payload) => {
          const newMessage = payload.new as Message;

          // Update cache only if the message is new
          queryClient.setQueryData(["messages", rideId], (oldMessages: Message[] = []) => {
            if (!oldMessages.some((msg) => msg.id === newMessage.id)) {
              return [...oldMessages, newMessage];
            }
            return oldMessages;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [rideId, queryClient]);

  // Clear messages when rideId becomes null
  useEffect(() => {
    if (!rideId) {
      queryClient.setQueryData(['messages', rideId], []);
      setMessage(''); // Clear any typed message
      setIsMembersPopupOpen(false); // Close members popup if open
      setIsProfilePopupOpen(false); // Close profile popup if open
      setSelectedMemberId(null); // Clear selected member
      setIsHost(false); // Reset host status
    }
  }, [rideId, queryClient]);

  const handleLeave = async () => {
    if (isLeaving || !rideId) return;
    
    if (isHost) {
      alert("As the host, you should delete the ride instead of leaving it.");
      return;
    }
    
    setIsConfirmPopupOpen(true);
  };

  const handleConfirmLeave = async () => {
    if (!rideId) return;
    
    setIsLeaving(true);
    
    try {
      const response = await leaveRide(rideId);
      if (response.error) {
        console.error("Error leaving ride:", response.error);
        alert(response.error.message);
        return;
      }
      
      // Clear messages cache completely
      queryClient.removeQueries({ queryKey: ['messages', rideId] });
      
      // Invalidate all rides-related caches
      queryClient.invalidateQueries({ queryKey: ['userRides'] });
      queryClient.invalidateQueries({ queryKey: ['rides'] });
      queryClient.invalidateQueries({ queryKey: ['ride', rideId] });
      
      // Call parent's onLeave to clear selection
      onLeave();
      
    } catch (error) {
      console.error("Error in leave ride:", error);
      alert("Failed to leave ride. Please try again.");
    } finally {
      setIsLeaving(false);
      setIsConfirmPopupOpen(false);
    }
  };

  const handleDelete = async () => {
    if (!rideId) return;
    setIsDeletePopupOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!rideId) return;
    
    try {
      const response = await deleteRide(rideId);
      if (response.error) {
        console.error("Error deleting ride:", response.error);
        alert(response.error.message);
        return;
      }
      
      // Clear messages cache completely
      queryClient.removeQueries({ queryKey: ['messages', rideId] });
      
      // Invalidate all rides-related caches
      queryClient.invalidateQueries({ queryKey: ['userRides'] });
      queryClient.invalidateQueries({ queryKey: ['rides'] });
      queryClient.invalidateQueries({ queryKey: ['ride', rideId] });
      
      // Call parent's onLeave to clear selection
      onLeave();
      
    } catch (error) {
      console.error("Error in delete ride:", error);
      alert("Failed to delete ride. Please try again.");
    } finally {
      setIsDeletePopupOpen(false);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessageMutation.mutate(message);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };



  const selectedMember = members.find(m => m.id === selectedMemberId);

  if (!rideId) {
    return (
      <div className={styles.noChat}>
        <div>
          <h2>No Chat Selected</h2>
          <p>Select a chat from the list to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h2>{rideDetails?.origin} → {rideDetails?.destination}</h2>
          <p>
            {rideDetails ? `${new Date(rideDetails.departure_time).toLocaleString()} • 
            ${rideDetails.count_members}/${rideDetails.capacity} members` : ''}
          </p>
        </div>
        <div className={styles.headerActions}>
          <button 
            className={styles.actionButton}
            onClick={() => setIsMembersPopupOpen(true)}
          >
            View Members
          </button>
          {isHost ? (
            <button 
              className={`${styles.actionButton} ${styles.deleteButton}`}
              onClick={handleDelete}
            >
              Delete Ride
            </button>
          ) : (
            <button 
              className={`${styles.actionButton} ${styles.leaveButton}`}
              onClick={handleLeave}
              disabled={isLeaving}
            >
              {isLeaving ? "Leaving..." : "Leave Group"}
            </button>
          )}
        </div>
      </div>
      <div className={styles.messages}>
        {isLoading ? (
          <p>Loading messages...</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.message} ${
                msg.member_id === member_id ? styles.sent : styles.received
              }`}
            >
              {msg.member_id !== member_id && (
                <div className={styles.sender}>{msg.sender_name}</div>
              )}
              <div>{msg.content}</div>
              <div className={styles.timestamp}>{formatTime(msg.created_at)}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className={styles.input}
        />
        <button
          onClick={handleSendMessage}
          disabled={!message.trim() || sendMessageMutation.isPending}
          className={styles.send_btn}
        >
          {sendMessageMutation.isPending ? "Sending..." : "Send"}
        </button>
      </div>
      {isMembersPopupOpen && (
        <MembersPopup
          isOpen={isMembersPopupOpen}
          onClose={() => setIsMembersPopupOpen(false)}
          members={members}
        />
      )}
      {isProfilePopupOpen && selectedMember && (
        <ProfilePopup
          isOpen={isProfilePopupOpen}
          onClose={() => {
            setIsProfilePopupOpen(false);
            setSelectedMemberId(null);
          }}
          profile={selectedMember}
        />
      )}
      {isConfirmPopupOpen && (
        <ConfirmPopup
          isOpen={isConfirmPopupOpen}
          onClose={() => setIsConfirmPopupOpen(false)}
          onConfirm={handleConfirmLeave}
          title="Leave Group"
          message="Are you sure you want to leave this group? You will no longer have access to the chat."
          confirmText="Leave Group"
          cancelText="Cancel"
        />
      )}
      {isDeletePopupOpen && (
        <ConfirmPopup
          isOpen={isDeletePopupOpen}
          onClose={() => setIsDeletePopupOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Ride"
          message="Are you sure you want to delete this ride? This action cannot be undone and all members will be removed from the group."
          confirmText="Delete Ride"
          cancelText="Cancel"
        />
      )}
    </div>
  );
}

export default MessagePage;
