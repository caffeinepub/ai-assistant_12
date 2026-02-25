module {
  type OldMessage = {
    role : Text;
    content : Text;
    timestamp : Int;
  };

  type OldActor = {
    conversationHistory : [OldMessage];
  };

  type NewMessage = {
    role : Text;
    content : Text;
    timestamp : Int;
    gamePayload : ?Text;
  };

  type NewActor = {
    conversationHistory : [NewMessage];
  };

  public func run(old : OldActor) : NewActor {
    let newConversation = old.conversationHistory.map(func(oldMessage) { { oldMessage with gamePayload = null } });
    { conversationHistory = newConversation };
  };
};
