import Time "mo:core/Time";
import Array "mo:core/Array";

actor {
  type Message = {
    role : Text; // "user" or "assistant"
    content : Text;
    timestamp : Time.Time;
  };

  var conversationHistory : [Message] = [];

  public shared ({ caller }) func sendMessage(userMessage : Text) : async Message {
    let userMsg : Message = {
      role = "user";
      content = userMessage;
      timestamp = Time.now();
    };

    let aiResponse : Message = {
      role = "assistant";
      content = "Simulated AI response: " # userMessage;
      timestamp = Time.now();
    };

    conversationHistory := conversationHistory.concat([userMsg, aiResponse]);
    aiResponse;
  };

  public query ({ caller }) func getConversationHistory() : async [Message] {
    conversationHistory;
  };
};
