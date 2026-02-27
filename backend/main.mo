import Time "mo:core/Time";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Char "mo:core/Char";
import Nat "mo:core/Nat";
import Nat32 "mo:core/Nat32";
import Iter "mo:core/Iter";



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

    // New checks for generic game creation requests
    if (
      containsAny(
        request,
        [
          "create game",
          "make game",
          "build game",
          "design game",
          "develop game",
          "platformer",
          "shooter",
          "puzzle",
          "racing",
          "adventure game",
          "arcade",
          "strategy game",
          "rpg game",
        ],
      )
    ) {
      let sampleGameHtml = "<!DOCTYPE html><html><head><meta charset=\\\"UTF-8\\\"><title>Sample Platformer</title><style>body{background:#222;color:#fff;font-family:sans-serif;text-align:center;}canvas{margin:20px auto;display:block;background:#444;border:2px solid #fff;}#controls{margin-top:20px;}button{padding:10px 20px;font-size:16px;background:#555;color:#fff;border:none;cursor:pointer;margin:0 10px;}p{font-size:18px;}</style></head><body><h1>Sample Platformer</h1><canvas id=\\\"gameCanvas\\\" width=\\\"400\\\" height=\\\"300\\\"></canvas><p>Use Arrow Keys or WASD to Move</p><div id=\\\"controls\\\"><button id=\\\"resetBtn\\\">Reset</button></div><script>const canvas=document.getElementById(\\\"gameCanvas\\\");const ctx=canvas.getContext(\\\"2d\\\");const gravity=0.5;let player={x:50,y:240,w:30,h:30,velX:0,velY:0,jumping:false};const platforms=[{x:0,y:270,w:400,h:30},{x:120,y:200,w:100,h:20},{x:250,y:150,w:80,h:15},{x:70,y:100,w:60,h:13}];const keys={left:false,right:false,up:false};function drawPlayer(){ctx.fillStyle=\\\"#00c8f8\\\";ctx.fillRect(player.x,player.y,player.w,player.h);}function drawPlatforms(){ctx.fillStyle=\\\"#8bd700\\\";platforms.forEach(p=>{ctx.fillRect(p.x,p.y,p.w,p.h);});}function drawFlag(){ctx.fillStyle=\\\"#ffeb3b\\\";ctx.beginPath();ctx.arc(370,110,15,0,Math.PI*2);ctx.fill();ctx.fillStyle=\\\"#666\\\";ctx.fillRect(365,110,10,40);}function updatePlayer(){if(keys.left)player.velX=-3;if(keys.right)player.velX=3;if(!keys.left&&!keys.right)player.velX*=0.8;if(player.velX>8)player.velX=8;if(player.velX<-8)player.velX=-8;player.x+=player.velX;player.velY+=gravity;player.y+=player.velY;if(player.x<0)player.x=0;if(player.x+player.w>canvas.width)player.x=canvas.width-player.w;if(player.y+player.h>canvas.height){player.y=canvas.height-player.h;player.velY=0;player.jumping=false;}}function checkCollisions(){platforms.forEach(p=>{if(player.x+player.w>p.x&&player.x<p.x+p.w&&player.y+player.h>p.y&&player.y<p.y+p.h){player.y=p.y-player.h;player.velY=0;player.jumping=false;}});}function isOnGround(){let onGround=false;platforms.forEach(p=>{if(player.x+player.w>p.x&&player.x<p.x+p.w&&player.y+player.h>p.y&&player.y+player.h<p.y+10){onGround=true;}});return onGround;}function checkFlag(){if(player.x+player.w>355&&player.y+player.h>85&&player.y<125){player.x=40;player.y=230;player.velX=0;player.velY=0;player.jumping=false;document.body.style.backgroundColor=\\\"#ffd600\\\";setTimeout(()=>{document.body.style.backgroundColor=\\\"#222\\\";},1000);}}function animate(){ctx.clearRect(0,0,canvas.width,canvas.height);drawPlatforms();drawFlag();drawPlayer();updatePlayer();checkCollisions();checkFlag();requestAnimationFrame(animate);}function handleKeyDown(e){switch(e.key){case\\\"ArrowLeft\\\":case\\\"a\\\":case\\\"A\\\":keys.left=true;break;case\\\"ArrowRight\\\":case\\\"d\\\":case\\\"D\\\":keys.right=true;break;case\\\"ArrowUp\\\":case\\\"w\\\":case\\\"W\\\":if(isOnGround()&&!player.jumping){player.velY=-9;player.jumping=true;}break;}}function handleKeyUp(e){switch(e.key){case\\\"ArrowLeft\\\":case\\\"a\\\":case\\\"A\\\":keys.left=false;break;case\\\"ArrowRight\\\":case\\\"d\\\":case\\\"D\\\":keys.right=false;break;}}function handleReset(){player.x=50;player.y=240;player.velX=0;player.velY=0;player.jumping=false;}document.addEventListener(\\\"keydown\\\",handleKeyDown);document.addEventListener(\\\"keyup\\\",handleKeyUp);document.getElementById(\\\"resetBtn\\\").addEventListener(\\\"click\\\",handleReset);animate();</script></body></html>";

      return ?("{ \\\"gameType\\\": \\\"platformer\\\", \\\"payload\\\": \\\"" # sampleGameHtml # "\\\" }");
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
