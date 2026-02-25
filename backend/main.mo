import Time "mo:core/Time";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Char "mo:core/Char";
import Nat "mo:core/Nat";
import Nat32 "mo:core/Nat32";
import Iter "mo:core/Iter";
import Migration "migration";

(with migration = Migration.run)
actor {
  type Message = {
    role : Text;
    content : Text;
    timestamp : Time.Time;
    gamePayload : ?Text;
  };

  var conversationHistory : [Message] = [];

  func containsKeyword(text : Text, keyword : Text) : Bool {
    let lowercaseText = text.map(
      func(c) {
        if (c >= 'A' and c <= 'Z') {
          Char.fromNat32(c.toNat32() + 32);
        } else { c };
      }
    );
    let lowercaseKeyword = keyword.map(
      func(c) {
        if (c >= 'A' and c <= 'Z') {
          Char.fromNat32(c.toNat32() + 32);
        } else { c };
      }
    );
    lowercaseText.contains(#text lowercaseKeyword);
  };

  func containsAny(text : Text, keywords : [Text]) : Bool {
    keywords.values().any(func(kw) { containsKeyword(text, kw) });
  };

  func generateGenreResponse(message : Text) : ?Text {
    if (containsAny(message, ["rpg", "role", "playing", "game", "jrpg", "action rpg"])) {
      return ?"RPGs are story-driven games where you control characters, level up, and embark on epic quests. Popular examples include Final Fantasy, The Elder Scrolls, and Dark Souls.";
    };
    if (containsAny(message, ["shooter", "fps", "tps", "first person", "third person"])) {
      return ?"Shooters focus on gun combat and quick reflexes. FPS (first-person shooter) games like Call of Duty and Halo put you in the character's perspective, while TPS (third-person shooters) like Fortnite are viewed from behind the character.";
    };
    if (containsAny(message, ["strategy", "rts", "real-time strategy"])) {
      return ?"Strategy games require careful planning and resource management. Popular RTS games include StarCraft, Command & Conquer, and Age of Empires.";
    };
    if (containsAny(message, ["platformer", "platforming"])) {
      return ?"Platformers are games focused on jumping between platforms and overcoming obstacles. Classics include Super Mario Bros., Sonic the Hedgehog, and Celeste.";
    };
    null;
  };

  func generateGameResponse(message : Text) : ?Text {
    if (containsAny(message, ["zelda", "breath", "wild", "ocean's realm"])) {
      return ?"The Legend of Zelda: Ocean's Realm is an amazing open-world adventure. Exploration, puzzles, and combat are key elements. Don't forget to use your Sheikah Slate for hints!";
    };
    if (containsAny(message, ["minecraft"])) {
      return ?"Minecraft is a sandbox game where you build, mine, and survive. The possibilities are endless - you can create redstone machines, explore underground caves, and even fight the Ender Dragon!";
    };
    if (containsAny(message, ["dark souls", "soulslike"])) {
      return ?"Soulslike games like Dark Souls are known for their challenging combat and deep lore. Study enemy attack patterns, keep your shield up, and remember - every death is a learning experience.";
    };
    if (containsAny(message, ["fortnite", "battle royale"])) {
      return ?"Fortnite's battle royale mode pits 100 players against each other until only one remains. Practice your building skills, stay aware of the storm, and adapt your strategy as the map changes.";
    };
    null;
  };

  func generateGamingCultureResponse(message : Text) : ?Text {
    if (containsAny(message, ["speedrunning", "fastest time"])) {
      return ?"Speedrunning is the art of completing games as quickly as possible, often using glitches and precise movement. Games like Mario 64 and Zelda: Ocarina of Time are especially popular in the speedrunning community.";
    };
    if (containsAny(message, ["esports", "competitive", "tournament"])) {
      return ?"Esports is professional competitive gaming. Popular esports titles include League of Legends, Counter-Strike, and Overwatch. Teamwork, strategy, and quick reflexes are crucial for success.";
    };
    if (containsAny(message, ["cosplay", "convention"])) {
      return ?"Cosplay is the art of dressing up as your favorite game characters. Gaming conventions often feature cosplay contests, gaming tournaments, and exclusive previews of upcoming games.";
    };
    null;
  };

  func generateGamePayload(request : Text) : ?Text {
    if (containsAny(request, ["snake", "arcade"])) {
      return ?"{ \"gameType\": \"snake\", \"payload\": \"...html/js data...\" }";
    };
    if (containsAny(request, ["pong", "arcade"])) {
      return ?"{ \"gameType\": \"pong\", \"payload\": \"...html/js data...\" }";
    };
    null;
  };

  func generateAIResponse(userMessage : Text) : (Text, ?Text) {
    switch (generateGenreResponse(userMessage)) {
      case (?response) { return (response, null) };
      case (null) {};
    };
    switch (generateGameResponse(userMessage)) {
      case (?response) { return (response, null) };
      case (null) {};
    };
    switch (generateGamingCultureResponse(userMessage)) {
      case (?response) { return (response, null) };
      case (null) {};
    };

    switch (generateGamePayload(userMessage)) {
      case (?gameData) {
        return ("Here's your requested game! 🚀", ?gameData);
      };
      case (null) {};
    };

    if (containsAny(userMessage, ["hello", "hi", "greetings"])) {
      return ("Hello, gamer! How can I assist you with your gaming quests today?", null);
    };

    if (containsAny(userMessage, ["recommend", "suggest"])) {
      return (
        "I'd be happy to recommend some games! Let me know your preferred genre or game style, and I'll suggest options tailored to your interests.",
        null
      );
    };

    (
      "I'm here to help with any video game questions or advice you need. Ask about genres, game mechanics, strategies, recommendations, or even request a mini-game!",
      null,
    );
  };

  public shared ({ caller }) func sendMessage(userMessage : Text) : async Message {
    let userMsg : Message = {
      role = "user";
      content = userMessage;
      timestamp = Time.now();
      gamePayload = null;
    };

    let (aiResponseContent, gamePayload) = generateAIResponse(userMessage);

    let aiResponse : Message = {
      role = "assistant";
      content = aiResponseContent;
      timestamp = Time.now();
      gamePayload;
    };

    conversationHistory := conversationHistory.concat([userMsg, aiResponse]);
    aiResponse;
  };

  public query ({ caller }) func getConversationHistory() : async [Message] {
    conversationHistory;
  };
};
