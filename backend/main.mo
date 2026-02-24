import Time "mo:core/Time";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";

actor {
  type Message = {
    role : Text; // "user" or "assistant"
    content : Text;
    timestamp : Time.Time;
  };

  var conversationHistory : [Message] = [];

  func generateAIResponse(userMessage : Text) : Text {
    Runtime.trap("generateAIResponse should never run. Implement in typescript when using HTTP outcalls or external data sources");
  };

  public shared ({ caller }) func sendMessage(userMessage : Text) : async Message {
    let userMsg : Message = {
      role = "user";
      content = userMessage;
      timestamp = Time.now();
    };

    let aiResponseContent = generateAIResponse(userMessage);

    let aiResponse : Message = {
      role = "assistant";
      content = aiResponseContent;
      timestamp = Time.now();
    };

    conversationHistory := conversationHistory.concat([userMsg, aiResponse]);
    aiResponse;
  };

  public query ({ caller }) func getConversationHistory() : async [Message] {
    conversationHistory;
  };
};
