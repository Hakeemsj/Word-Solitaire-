/* ============================================================
   Word Solitaire — Word Library
   Every word has a short meaning + an example sentence.
   Relations connect words to each other and are tagged with a
   TYPE (Category, Synonym, Antonym, Context, Function, PartOf,
   Activity, Concept) and a short, one-word NAME, so stages can be
   assembled from the library in an organized way. Every group has
   between 3 and 8 words.
   ============================================================ */

const WORDS = {
  // Fruits
  apple: { meaning: "A round fruit with red or green skin.", example: "She ate an apple for breakfast." },
  banana: { meaning: "A long curved yellow fruit.", example: "He packed a banana in his lunch." },
  orange: { meaning: "A round citrus fruit with orange skin.", example: "I squeezed an orange for juice." },
  grape: { meaning: "A small round fruit that grows in bunches.", example: "We bought a bag of grapes." },
  mango: { meaning: "A sweet tropical fruit with orange flesh.", example: "The mango was ripe and juicy." },
  strawberry: { meaning: "A small red fruit covered in tiny seeds.", example: "She added strawberries to her cereal." },
  pineapple: { meaning: "A tropical fruit with spiky skin and sweet yellow flesh.", example: "He cut the pineapple into slices." },
  watermelon: { meaning: "A large fruit with green skin and juicy red flesh.", example: "We ate watermelon by the pool." },

  // Weather
  rain: { meaning: "Water that falls from clouds.", example: "Take an umbrella, it might rain today." },
  sunny: { meaning: "Bright with sunlight, no clouds.", example: "It was a sunny afternoon at the park." },
  cloudy: { meaning: "Covered with clouds.", example: "The sky turned cloudy before the storm." },
  windy: { meaning: "With a lot of wind blowing.", example: "It was too windy to fly a kite." },
  snow: { meaning: "Soft white flakes that fall in cold weather.", example: "The children played in the snow." },
  storm: { meaning: "Very bad weather with strong wind and rain.", example: "The storm knocked down a tree." },
  fog: { meaning: "Thick cloud close to the ground that is hard to see through.", example: "The fog made it hard to drive." },
  thunder: { meaning: "The loud sound that follows lightning.", example: "The thunder woke the baby up." },

  // Emotions
  happy: { meaning: "Feeling or showing pleasure.", example: "She felt happy after passing the exam." },
  sad: { meaning: "Feeling unhappy or sorrowful.", example: "He was sad when his trip ended." },
  angry: { meaning: "Feeling strong displeasure.", example: "She was angry about the delay." },
  nervous: { meaning: "Worried or anxious about something.", example: "I felt nervous before the interview." },
  excited: { meaning: "Feeling enthusiastic and eager.", example: "The kids were excited about the trip." },
  bored: { meaning: "Feeling tired because something is not interesting.", example: "He was bored during the long lecture." },
  surprised: { meaning: "Feeling mild astonishment.", example: "She was surprised by the birthday party." },
  proud: { meaning: "Feeling deep satisfaction from an achievement.", example: "He felt proud after finishing the marathon." },

  // Furniture
  chair: { meaning: "A seat for one person.", example: "Please pull up a chair and sit down." },
  table: { meaning: "A flat surface on legs used for eating or working.", example: "We put the food on the table." },
  sofa: { meaning: "A long soft seat for more than one person.", example: "They relaxed on the sofa after dinner." },
  shelf: { meaning: "A flat board used to store or display things.", example: "She placed the books on the shelf." },
  bed: { meaning: "A piece of furniture for sleeping.", example: "He went straight to bed after work." },
  desk: { meaning: "A table used for writing or working, often with a computer.", example: "She studies at her desk every evening." },
  lamp: { meaning: "A device that produces light.", example: "She turned on the lamp to read." },
  rug: { meaning: "A piece of thick fabric that covers part of a floor.", example: "The cat slept on the rug." },

  // Jobs
  doctor: { meaning: "A person trained to treat sick people.", example: "The doctor examined the patient carefully." },
  teacher: { meaning: "A person who helps students learn.", example: "The teacher explained the lesson clearly." },
  engineer: { meaning: "A person who designs or builds machines and structures.", example: "The engineer inspected the new bridge." },
  chef: { meaning: "A professional cook, especially the head cook.", example: "The chef prepared a delicious meal." },
  pilot: { meaning: "A person who flies an aircraft.", example: "The pilot landed the plane smoothly." },
  farmer: { meaning: "A person who grows crops or raises animals.", example: "The farmer woke up early to feed the animals." },
  nurse: { meaning: "A person trained to care for sick or injured people.", example: "The nurse checked his blood pressure." },
  lawyer: { meaning: "A person who advises and represents people in legal matters.", example: "She hired a lawyer for the contract." },

  // Sports
  soccer: { meaning: "A sport played by kicking a ball into a goal.", example: "The kids play soccer after school." },
  tennis: { meaning: "A sport played by hitting a ball over a net with a racket.", example: "They played tennis on Saturday morning." },
  swimming: { meaning: "The sport of moving through water using your body.", example: "Swimming is great exercise for the whole body." },
  basketball: { meaning: "A sport where players score by throwing a ball through a hoop.", example: "He practices basketball every afternoon." },
  boxing: { meaning: "A sport in which two people fight using their fists.", example: "He trains hard for his next boxing match." },
  cycling: { meaning: "The sport or activity of riding a bicycle.", example: "Cycling to work saves her a lot of money." },
  running: { meaning: "The sport of moving fast on foot.", example: "She goes running every morning." },
  golf: { meaning: "A sport where players hit a small ball into holes.", example: "He plays golf with his friends on weekends." },

  // Kitchen tools
  knife: { meaning: "A tool with a sharp blade used for cutting.", example: "Be careful with that knife, it's very sharp." },
  spoon: { meaning: "A tool with a small bowl used for eating or serving.", example: "She stirred her tea with a spoon." },
  fork: { meaning: "A tool with prongs used for eating or lifting food.", example: "He picked up the pasta with a fork." },
  pan: { meaning: "A flat metal container used for cooking on a stove.", example: "She fried the eggs in a pan." },
  oven: { meaning: "An appliance used for baking or roasting food.", example: "The bread is baking in the oven." },
  blender: { meaning: "A machine used to mix or crush food into a liquid.", example: "He made a smoothie in the blender." },
  kettle: { meaning: "A container used to boil water.", example: "She put the kettle on for tea." },
  whisk: { meaning: "A tool used to beat eggs or mix ingredients quickly.", example: "He used a whisk to beat the eggs." },

  // Transportation
  car: { meaning: "A road vehicle with four wheels.", example: "They drove to the beach in their car." },
  bus: { meaning: "A large vehicle that carries many passengers.", example: "She takes the bus to work every day." },
  train: { meaning: "A vehicle that runs on rails, often carrying many people.", example: "We took the train to the city center." },
  bicycle: { meaning: "A two-wheeled vehicle powered by pedaling.", example: "He rides his bicycle to school." },
  airplane: { meaning: "A vehicle that flies through the air.", example: "Our airplane landed right on time." },
  ship: { meaning: "A large boat used to travel across water.", example: "The ship sailed across the ocean." },
  subway: { meaning: "An underground train system in a city.", example: "She takes the subway to work every day." },
  taxi: { meaning: "A car that carries passengers for a fare.", example: "We called a taxi to the airport." },

  // Synonyms — Happy
  glad: { meaning: "Pleased about something.", example: "I'm glad you could come to the party." },
  joyful: { meaning: "Full of joy and happiness.", example: "The wedding was a joyful occasion." },
  cheerful: { meaning: "Noticeably happy and positive.", example: "She greeted us with a cheerful smile." },
  pleased: { meaning: "Feeling satisfaction or happiness.", example: "He was pleased with his test results." },

  // Synonyms — Big
  large: { meaning: "Big in size or amount.", example: "They live in a large house." },
  huge: { meaning: "Extremely large.", example: "There was a huge crowd at the concert." },
  giant: { meaning: "Very large, much bigger than usual.", example: "A giant statue stood in the square." },
  enormous: { meaning: "Extremely big in size or amount.", example: "The company made an enormous profit this year." },

  // Synonyms — Smart
  clever: { meaning: "Quick to understand and learn.", example: "That's a clever way to solve the problem." },
  intelligent: { meaning: "Having a high ability to learn and understand.", example: "She is one of the most intelligent students in class." },
  brilliant: { meaning: "Exceptionally clever or talented.", example: "He came up with a brilliant idea." },
  sharp: { meaning: "Quick to notice or understand things.", example: "You need a sharp mind to win this game." },

  // Temperature
  hot: { meaning: "Having a high temperature.", example: "Be careful, the soup is hot." },
  cold: { meaning: "Having a low temperature.", example: "It's cold outside, wear a jacket." },
  warm: { meaning: "Slightly hot in a pleasant way.", example: "The soup was warm and comforting." },
  cool: { meaning: "Slightly cold in a refreshing way.", example: "A cool breeze came through the window." },
  freezing: { meaning: "Extremely cold.", example: "It was freezing outside this morning." },

  // Speed
  fast: { meaning: "Moving or happening quickly.", example: "He is a very fast runner." },
  slow: { meaning: "Moving or happening at a low speed.", example: "The traffic was extremely slow today." },
  quick: { meaning: "Done or happening with speed.", example: "She gave a quick answer to the question." },
  rapid: { meaning: "Happening very fast.", example: "The company made rapid progress this year." },
  gradual: { meaning: "Happening slowly over time.", example: "There was a gradual improvement in her grades." },

  // Difficulty
  easy: { meaning: "Not difficult to do.", example: "The test was easier than expected." },
  hard: { meaning: "Difficult to do or understand.", example: "That math problem was really hard." },
  simple: { meaning: "Easy to understand or do.", example: "The instructions were simple to follow." },
  tough: { meaning: "Very difficult to do or deal with.", example: "It was a tough decision to make." },
  tricky: { meaning: "Difficult to do because it needs skill or care.", example: "Parking here can be tricky." },

  // Fullness
  full: { meaning: "Containing as much as possible.", example: "The bus was full, so we had to stand." },
  empty: { meaning: "Containing nothing.", example: "The fridge was completely empty." },
  packed: { meaning: "Extremely full of people or things.", example: "The stadium was packed for the final." },
  bare: { meaning: "Empty or without decoration.", example: "The walls of the room were completely bare." },
  crowded: { meaning: "Full of people.", example: "The train was crowded during rush hour." },

  // Strength
  strong: { meaning: "Having great physical power.", example: "He is strong enough to lift that box." },
  weak: { meaning: "Lacking physical strength.", example: "She felt weak after the long illness." },
  powerful: { meaning: "Having great strength or force.", example: "The powerful engine pulled the heavy truck." },
  feeble: { meaning: "Very weak, lacking energy or strength.", example: "The old man had a feeble handshake." },
  sturdy: { meaning: "Strongly built and unlikely to break.", example: "They bought a sturdy wooden table." },

  // Price
  cheap: { meaning: "Low in price.", example: "We found a cheap hotel near the beach." },
  expensive: { meaning: "High in price.", example: "That watch is far too expensive for me." },
  affordable: { meaning: "Reasonably priced, not too expensive.", example: "The apartment was small but affordable." },
  pricey: { meaning: "Somewhat expensive.", example: "The restaurant was a bit pricey for us." },
  costly: { meaning: "Expensive, often unexpectedly so.", example: "Fixing the roof was a costly repair." },

  // State (open/closed)
  open: { meaning: "Not closed; allowing access.", example: "Please leave the door open." },
  closed: { meaning: "Not open; shut.", example: "The shop was closed on Sunday." },
  shut: { meaning: "Closed firmly.", example: "She shut the window before the storm." },
  sealed: { meaning: "Closed tightly so nothing can get in or out.", example: "The letter was sealed in an envelope." },
  ajar: { meaning: "Slightly open.", example: "He left the door ajar so the cat could get in." },

  // Moisture
  wet: { meaning: "Covered or soaked in liquid.", example: "My shoes got wet in the rain." },
  dry: { meaning: "Free from water or liquid.", example: "The towel was completely dry." },
  damp: { meaning: "Slightly wet.", example: "The basement walls felt damp." },
  moist: { meaning: "Slightly wet in a pleasant way.", example: "The cake was soft and moist." },
  soggy: { meaning: "Very wet and soft.", example: "The bread went soggy in the soup." },

  // Actions (what people do)
  heal: { meaning: "To make someone healthy again.", example: "Doctors work hard to heal their patients." },
  teach: { meaning: "To help someone learn something.", example: "She loves to teach young children." },
  cook: { meaning: "To prepare food by heating it.", example: "He likes to cook dinner for his family." },
  fly: { meaning: "To travel through the air.", example: "Birds fly south for the winter." },
  harvest: { meaning: "To gather crops that are ready.", example: "They harvest the wheat in late summer." },

  // Security
  key: { meaning: "A metal tool used to open a lock.", example: "I locked myself out and lost my key." },
  unlock: { meaning: "To open something using a key.", example: "She used her key to unlock the door." },
  lock: { meaning: "A device that keeps something securely shut.", example: "He put a lock on the gate." },
  password: { meaning: "A secret word or phrase used to prove identity.", example: "She typed in her password to log in." },
  code: { meaning: "A set of numbers or letters used to gain access.", example: "Enter the code to open the safe." },

  // Parts of a car
  wheel: { meaning: "A round part that allows a vehicle to move.", example: "The car has a flat wheel." },
  engine: { meaning: "The part of a vehicle that produces power to move it.", example: "The mechanic fixed the engine." },
  seat: { meaning: "A place where a person sits.", example: "Please fasten your seat belt." },
  mirror: { meaning: "A surface that reflects an image.", example: "He checked the side mirror before turning." },
  door: { meaning: "A movable barrier used to enter or exit.", example: "Please close the car door gently." },
  trunk: { meaning: "The storage space at the back of a car.", example: "He put the suitcase in the trunk." },

  // Parts of a house
  roof: { meaning: "The covering on top of a building.", example: "Snow covered the roof of the house." },
  wall: { meaning: "A vertical structure that divides or encloses a space.", example: "They hung a painting on the wall." },
  window: { meaning: "An opening in a wall that lets in light and air.", example: "She opened the window for fresh air." },
  floor: { meaning: "The surface you walk on inside a room.", example: "The dog lay down on the floor." },
  ceiling: { meaning: "The inner surface at the top of a room.", example: "A lamp hung from the ceiling." },
  chimney: { meaning: "A structure that lets smoke escape from a fireplace.", example: "Smoke rose from the chimney." },

  // Parts of the body
  hand: { meaning: "The part of the arm below the wrist.", example: "She waved her hand to say hello." },
  arm: { meaning: "The part of the body from shoulder to hand.", example: "He broke his arm while skiing." },
  leg: { meaning: "The part of the body used for standing and walking.", example: "She hurt her leg during the race." },
  foot: { meaning: "The part of the body at the end of the leg.", example: "He stubbed his foot on the table." },
  finger: { meaning: "One of the five parts at the end of the hand.", example: "She pointed her finger at the map." },
  elbow: { meaning: "The joint where the arm bends.", example: "He rested his elbow on the table." },

  // Beach activities
  swim: { meaning: "To move through water using your body.", example: "We went to swim in the sea." },
  sunbathe: { meaning: "To sit or lie in the sun to get a tan.", example: "They sunbathe on the beach every summer." },
  surf: { meaning: "To ride waves on a board.", example: "He learned to surf last summer." },
  snorkel: { meaning: "To swim underwater using a breathing tube and mask.", example: "We went to snorkel near the coral reef." },

  // Morning routine
  wake: { meaning: "To stop sleeping.", example: "I wake up at seven every morning." },
  brush: { meaning: "To clean using a brush, such as your teeth or hair.", example: "Don't forget to brush your teeth." },
  shower: { meaning: "To wash your body under running water.", example: "He takes a shower before breakfast." },
  dress: { meaning: "To put on clothes.", example: "She got dressed quickly for school." },

  // Restaurant context
  menu: { meaning: "A list of food and drinks available at a restaurant.", example: "The waiter handed us the menu." },
  waiter: { meaning: "A person who serves food in a restaurant.", example: "The waiter recommended the fish." },
  bill: { meaning: "A piece of paper showing how much you must pay.", example: "Can we have the bill, please?" },
  order: { meaning: "To ask for food or drink at a restaurant.", example: "We're ready to order now." },
  tip: { meaning: "Extra money given for good service.", example: "She left a generous tip for the waiter." },

  // Airport context
  ticket: { meaning: "A piece of paper or document that lets you travel.", example: "He bought a plane ticket online." },
  gate: { meaning: "The area at an airport where you board a plane.", example: "Our flight boards at gate twelve." },
  luggage: { meaning: "The bags and suitcases you take when traveling.", example: "She checked her luggage at the counter." },
  passport: { meaning: "An official document needed for international travel.", example: "Don't forget your passport at the airport." },
  boarding: { meaning: "The process of getting on a plane.", example: "Boarding will begin in ten minutes." },
  flight: { meaning: "A journey made by airplane.", example: "Our flight was delayed by an hour." },

  // Time concepts
  hour: { meaning: "A period of sixty minutes.", example: "The meeting lasted about an hour." },
  minute: { meaning: "A period of sixty seconds.", example: "Wait a minute, I'm almost ready." },
  calendar: { meaning: "A chart showing the days, weeks, and months.", example: "She marked the date on the calendar." },
  schedule: { meaning: "A plan of things to do at certain times.", example: "My schedule is full this week." },
  deadline: { meaning: "The latest time by which something must be done.", example: "The deadline for the report is Friday." },
  moment: { meaning: "A very short period of time.", example: "Please wait here for a moment." },

  // Money concepts
  budget: { meaning: "A plan for how to spend money.", example: "We need to stick to our budget this month." },
  save: { meaning: "To keep money instead of spending it.", example: "She tries to save some money every month." },
  spend: { meaning: "To use money to pay for something.", example: "He likes to spend money on books." },
  invest: { meaning: "To put money into something hoping to gain more.", example: "They decided to invest in a small business." },
  debt: { meaning: "Money that is owed to someone.", example: "He worked hard to pay off his debt." },
  coin: { meaning: "A small round piece of metal used as money.", example: "She found a coin on the sidewalk." },

  // Animals
  dog: { meaning: "A common pet animal that barks.", example: "The dog ran to greet its owner." },
  cat: { meaning: "A common small pet animal that purrs and meows.", example: "The cat curled up on the warm windowsill." },
  lion: { meaning: "A large wild cat known as the king of the jungle.", example: "The lion rested under the shade of a tree." },
  elephant: { meaning: "A huge animal with a long trunk and big ears.", example: "The elephant sprayed water with its trunk." },
  tiger: { meaning: "A large wild cat with orange and black stripes.", example: "The tiger moved silently through the grass." },
  monkey: { meaning: "A playful animal that climbs trees and uses its hands.", example: "The monkey swung from branch to branch." },
  horse: { meaning: "A large animal used for riding or pulling carts.", example: "She rode her horse across the field." },
  rabbit: { meaning: "A small furry animal with long ears that hops.", example: "The rabbit hid in the tall grass." },

  // Birds
  eagle: { meaning: "A large, powerful bird that hunts other animals.", example: "The eagle soared high above the mountains." },
  sparrow: { meaning: "A small common brown bird.", example: "A sparrow landed on the windowsill." },
  owl: { meaning: "A bird that is active at night and can turn its head far around.", example: "An owl hooted from the old oak tree." },
  parrot: { meaning: "A colorful bird that can imitate human speech.", example: "The parrot repeated everything we said." },
  penguin: { meaning: "A black and white bird that cannot fly but swims well.", example: "The penguin slid across the ice on its belly." },
  duck: { meaning: "A water bird with a flat beak.", example: "The duck swam across the pond." },
  swan: { meaning: "A large, graceful white water bird with a long neck.", example: "A swan glided silently across the lake." },

  // Ocean
  shark: { meaning: "A large, often dangerous fish with sharp teeth.", example: "A shark circled near the boat." },
  whale: { meaning: "A huge sea mammal that breathes air.", example: "We watched a whale breach the surface." },
  dolphin: { meaning: "A smart, friendly sea mammal known for jumping.", example: "The dolphin jumped playfully beside the boat." },
  octopus: { meaning: "A sea animal with eight arms.", example: "The octopus changed color to hide from danger." },
  jellyfish: { meaning: "A soft sea creature with a stinging touch.", example: "She was careful not to touch the jellyfish." },
  seal: { meaning: "A sea mammal with flippers that lives near coasts.", example: "The seal rested lazily on the rocks." },
  crab: { meaning: "A sea creature with a hard shell and claws.", example: "The crab scuttled sideways across the sand." },

  // Insects
  ant: { meaning: "A tiny insect that lives and works in large colonies.", example: "A line of ants marched across the sidewalk." },
  bee: { meaning: "A flying insect that makes honey and can sting.", example: "The bee landed on a bright yellow flower." },
  butterfly: { meaning: "An insect with large, colorful wings.", example: "A butterfly landed gently on her hand." },
  spider: { meaning: "A small creature with eight legs that spins webs.", example: "A spider built its web in the corner." },
  mosquito: { meaning: "A small flying insect that bites and drinks blood.", example: "A mosquito buzzed around his ear all night." },
  beetle: { meaning: "An insect with a hard, shiny outer shell.", example: "A beetle crawled slowly across the leaf." },

  // Reptiles
  snake: { meaning: "A long reptile with no legs that slithers.", example: "A snake slid quietly through the grass." },
  lizard: { meaning: "A small reptile with four legs and a long tail.", example: "The lizard basked in the sun on a rock." },
  turtle: { meaning: "A reptile with a hard shell that moves slowly.", example: "The turtle pulled its head into its shell." },
  crocodile: { meaning: "A large, dangerous reptile that lives in rivers.", example: "The crocodile floated silently in the murky water." },
  frog: { meaning: "A small jumping amphibian that lives near water.", example: "A frog jumped into the pond with a splash." },
  chameleon: { meaning: "A lizard that can change the color of its skin.", example: "The chameleon blended perfectly with the leaves." },

  // Farm
  cow: { meaning: "A large farm animal kept for milk.", example: "The cow grazed peacefully in the field." },
  pig: { meaning: "A farm animal with a curly tail, kept for meat.", example: "The pig rolled around happily in the mud." },
  sheep: { meaning: "A farm animal covered in wool.", example: "The sheep followed the shepherd across the hill." },
  goat: { meaning: "A farm animal with horns that likes to climb.", example: "The goat climbed onto the old barn roof." },
  chicken: { meaning: "A farm bird kept for its eggs and meat.", example: "The chicken laid an egg every morning." },
  rooster: { meaning: "A male chicken known for crowing at dawn.", example: "The rooster crowed loudly at sunrise." },
  donkey: { meaning: "A farm animal similar to a small horse, used to carry loads.", example: "The donkey carried heavy bags up the hill." },

  // Colors
  red: { meaning: "The color of blood or a ripe tomato.", example: "She wore a bright red dress." },
  blue: { meaning: "The color of a clear sky.", example: "The ocean looked deep blue today." },
  green: { meaning: "The color of grass and leaves.", example: "He painted the fence bright green." },
  yellow: { meaning: "The color of a lemon or the sun.", example: "The taxi was painted bright yellow." },
  purple: { meaning: "A color made by mixing red and blue.", example: "She picked a purple flower from the garden." },
  black: { meaning: "The darkest color, like the night sky.", example: "He wore a black suit to the meeting." },
  white: { meaning: "The color of snow or milk.", example: "The bride wore a white dress." },
  pink: { meaning: "A pale reddish color.", example: "She painted her room a soft pink." },

  // Shapes
  circle: { meaning: "A perfectly round shape.", example: "She drew a circle on the whiteboard." },
  square: { meaning: "A shape with four equal sides and four right angles.", example: "He folded the paper into a square." },
  triangle: { meaning: "A shape with three straight sides.", example: "The road sign was shaped like a triangle." },
  rectangle: { meaning: "A shape with four sides and four right angles, longer than it is wide.", example: "The table top was shaped like a rectangle." },
  oval: { meaning: "A rounded shape like an egg.", example: "The mirror in the hallway was oval." },
  star: { meaning: "A shape with several pointed corners.", example: "She drew a gold star next to his name." },
  diamond: { meaning: "A shape with four sides that looks like a tilted square.", example: "The kite was shaped like a diamond." },

  // Vegetables
  carrot: { meaning: "A long orange root vegetable.", example: "She chopped a carrot for the soup." },
  potato: { meaning: "A round vegetable that grows underground.", example: "He baked a potato for dinner." },
  onion: { meaning: "A round vegetable with a strong smell and taste.", example: "The recipe called for one chopped onion." },
  tomato: { meaning: "A round, red fruit often used as a vegetable.", example: "She sliced a tomato for the salad." },
  cucumber: { meaning: "A long green vegetable that is mostly water.", example: "He added cucumber slices to the water." },
  broccoli: { meaning: "A green vegetable with a tree-like shape.", example: "She steamed some broccoli for dinner." },
  garlic: { meaning: "A strong-smelling bulb used to flavor food.", example: "He crushed a clove of garlic for the sauce." },
  corn: { meaning: "A tall plant with sweet yellow kernels.", example: "They grilled corn on the cob at the picnic." },

  // Desserts
  cake: { meaning: "A sweet baked dessert, often eaten on birthdays.", example: "They lit candles on the birthday cake." },
  cookie: { meaning: "A small, flat, sweet baked treat.", example: "She baked a batch of chocolate chip cookies." },
  chocolate: { meaning: "A sweet food made from cacao beans.", example: "He gave her a box of chocolate for her birthday." },
  pie: { meaning: "A baked dish with a pastry crust and a sweet or savory filling.", example: "She made an apple pie for dessert." },
  pudding: { meaning: "A soft, sweet dessert with a creamy texture.", example: "He had chocolate pudding for dessert." },
  doughnut: { meaning: "A ring-shaped fried dough treat, often glazed.", example: "She bought a dozen doughnuts for the office." },
  candy: { meaning: "A small sweet treat made mostly of sugar.", example: "The children asked for candy at the store." },

  // Drinks
  water: { meaning: "A clear liquid that all living things need to survive.", example: "She drank a glass of water after her run." },
  juice: { meaning: "A drink made from the liquid of fruit.", example: "He squeezed fresh orange juice for breakfast." },
  coffee: { meaning: "A hot drink made from roasted coffee beans.", example: "She drinks a cup of coffee every morning." },
  tea: { meaning: "A hot drink made by soaking leaves in hot water.", example: "He likes a cup of tea in the afternoon." },
  milk: { meaning: "A white liquid produced by cows and other mammals.", example: "She poured milk over her cereal." },
  soda: { meaning: "A sweet, bubbly soft drink.", example: "He ordered a soda with his meal." },
  lemonade: { meaning: "A sweet drink made from lemon juice, sugar, and water.", example: "They sold lemonade on the corner in summer." },

  // Clothing
  shirt: { meaning: "A piece of clothing worn on the upper body.", example: "He ironed his shirt before the interview." },
  pants: { meaning: "A piece of clothing that covers the legs.", example: "She bought a new pair of pants." },
  jacket: { meaning: "A short coat worn over other clothes.", example: "He put on a jacket before going outside." },
  shoes: { meaning: "Items worn on the feet for walking.", example: "She tied her shoes before the race." },
  hat: { meaning: "A covering worn on the head.", example: "He wore a hat to block the sun." },
  socks: { meaning: "Soft coverings worn on the feet, inside shoes.", example: "She pulled on a warm pair of socks." },
  scarf: { meaning: "A piece of cloth worn around the neck for warmth or style.", example: "She wrapped a scarf around her neck." },
  gloves: { meaning: "Coverings worn on the hands, usually for warmth.", example: "He put on gloves before shoveling snow." },

  // Tools
  hammer: { meaning: "A tool used for hitting nails.", example: "He used a hammer to fix the fence." },
  screwdriver: { meaning: "A tool used for turning screws.", example: "She used a screwdriver to open the battery cover." },
  wrench: { meaning: "A tool used for turning nuts and bolts.", example: "He grabbed a wrench to tighten the pipe." },
  saw: { meaning: "A tool with a sharp blade used for cutting wood.", example: "He used a saw to cut the plank in half." },
  drill: { meaning: "A tool used for making holes.", example: "She used a drill to hang the shelf." },
  pliers: { meaning: "A tool used for gripping or bending things.", example: "He used pliers to remove the nail." },
  nail: { meaning: "A small metal spike used to join pieces of wood.", example: "He hammered a nail into the wall." },

  // Electronics
  phone: { meaning: "A device used to make calls and access the internet.", example: "She left her phone on the kitchen table." },
  computer: { meaning: "An electronic device used to process information.", example: "He types his reports on a computer." },
  television: { meaning: "A device used to watch shows and programs.", example: "They watched the news on television." },
  camera: { meaning: "A device used to take pictures.", example: "She brought her camera to the wedding." },
  tablet: { meaning: "A small, flat computer operated by touching the screen.", example: "He reads books on his tablet." },
  speaker: { meaning: "A device that produces sound.", example: "He connected his phone to a speaker." },
  router: { meaning: "A device that connects computers to the internet.", example: "The router stopped working during the storm." },

  // School subjects
  math: { meaning: "The study of numbers and calculations.", example: "She is very good at math." },
  science: { meaning: "The study of the natural world through experiments.", example: "They did a science experiment in class." },
  history: { meaning: "The study of past events.", example: "He enjoys reading about ancient history." },
  geography: { meaning: "The study of places, countries, and features of the earth.", example: "In geography class, they studied rivers and mountains." },
  art: { meaning: "The creation of paintings, drawings, or other visual works.", example: "She loves art and painting." },
  music: { meaning: "Sounds arranged in a pleasing or expressive way.", example: "He plays music every afternoon." },
  biology: { meaning: "The study of living things.", example: "They learned about cells in biology class." },

  // Stationery
  pen: { meaning: "A tool used for writing with ink.", example: "She signed the form with a blue pen." },
  pencil: { meaning: "A tool used for writing or drawing with graphite.", example: "He sharpened his pencil before the test." },
  eraser: { meaning: "A tool used to remove pencil marks.", example: "She used an eraser to fix her mistake." },
  ruler: { meaning: "A tool used to measure or draw straight lines.", example: "He used a ruler to draw a straight line." },
  notebook: { meaning: "A book of blank pages used for writing notes.", example: "She wrote her ideas in a notebook." },
  scissors: { meaning: "A tool with two blades used for cutting.", example: "He cut the paper with scissors." },
  glue: { meaning: "A sticky substance used to join things together.", example: "She used glue to fix the broken vase." },

  // Instruments
  guitar: { meaning: "A stringed musical instrument played by plucking or strumming.", example: "He played the guitar around the campfire." },
  piano: { meaning: "A large musical instrument played using black and white keys.", example: "She practices piano every evening." },
  violin: { meaning: "A small stringed instrument played with a bow.", example: "He learned to play the violin as a child." },
  drum: { meaning: "A musical instrument played by hitting its surface.", example: "He kept the beat on the drum." },
  flute: { meaning: "A thin musical instrument played by blowing across a hole.", example: "She played a soft tune on the flute." },
  trumpet: { meaning: "A brass musical instrument played by blowing into it.", example: "He played the trumpet in the school band." },
  saxophone: { meaning: "A brass musical instrument known for its rich, smooth sound.", example: "She played jazz on the saxophone." },

  // Appliances
  fridge: { meaning: "An appliance used to keep food cold.", example: "He put the leftovers in the fridge." },
  microwave: { meaning: "An appliance used to heat food quickly.", example: "She warmed her coffee in the microwave." },
  toaster: { meaning: "An appliance used to toast bread.", example: "He put two slices of bread in the toaster." },
  washer: { meaning: "A machine used to wash clothes.", example: "She put the dirty towels in the washer." },
  dryer: { meaning: "A machine used to dry clothes after washing.", example: "He took the warm clothes out of the dryer." },
  vacuum: { meaning: "A machine used to clean floors by sucking up dirt.", example: "She used the vacuum to clean the carpet." },
  iron: { meaning: "An appliance used to smooth wrinkles out of clothes.", example: "He used an iron to press his shirt." },

  // Metals
  gold: { meaning: "A valuable yellow metal used in jewelry.", example: "She wore a gold necklace to the party." },
  silver: { meaning: "A valuable shiny gray-white metal.", example: "He gave her a silver bracelet." },
  copper: { meaning: "A reddish-brown metal used in wires and pipes.", example: "The old pipes were made of copper." },
  aluminum: { meaning: "A lightweight silver-colored metal.", example: "The can was made of aluminum." },
  steel: { meaning: "A strong metal made mostly from iron.", example: "The bridge was built with steel beams." },
  bronze: { meaning: "A brownish metal made by mixing copper and tin.", example: "The statue was cast in bronze." },

  // Gems
  ruby: { meaning: "A valuable red gemstone.", example: "The ring was set with a bright ruby." },
  emerald: { meaning: "A valuable green gemstone.", example: "She admired the emerald in the museum display." },
  sapphire: { meaning: "A valuable blue gemstone.", example: "He bought her a sapphire pendant." },
  pearl: { meaning: "A small, round, shiny gem formed inside an oyster.", example: "She wore a string of pearls to the gala." },
  opal: { meaning: "A gemstone that shows shifting flashes of color.", example: "The opal ring sparkled with many colors." },

  // Flowers
  rose: { meaning: "A flower known for its beauty and thorny stem.", example: "He gave her a single red rose." },
  tulip: { meaning: "A cup-shaped spring flower.", example: "The garden was full of colorful tulips." },
  daisy: { meaning: "A simple flower with white petals and a yellow center.", example: "She picked a daisy from the field." },
  sunflower: { meaning: "A tall flower with bright yellow petals that follows the sun.", example: "The sunflower turned to face the morning light." },
  lily: { meaning: "A flower known for its large, elegant petals.", example: "White lilies decorated the altar." },
  orchid: { meaning: "A delicate, exotic flower prized for its beauty.", example: "She kept an orchid on her windowsill." },

  // Trees
  oak: { meaning: "A large, strong tree known for its acorns.", example: "They carved their names into the old oak." },
  pine: { meaning: "An evergreen tree with needle-like leaves.", example: "The forest was full of tall pine trees." },
  maple: { meaning: "A tree known for its bright leaves and sweet syrup.", example: "The maple leaves turned red in autumn." },
  willow: { meaning: "A tree with long, drooping branches.", example: "They sat under the willow by the river." },
  birch: { meaning: "A tree with thin, pale, papery bark.", example: "The birch trees stood white against the snow." },
  palm: { meaning: "A tall tropical tree with large leaves at the top.", example: "They relaxed under a palm tree on the beach." },

  // Sports equipment
  racket: { meaning: "A piece of equipment used to hit a ball in some sports.", example: "He swung his racket and hit the ball hard." },
  helmet: { meaning: "A hard covering worn to protect the head.", example: "She put on her helmet before riding her bike." },
  goggles: { meaning: "Protective glasses worn over the eyes.", example: "He wore goggles while swimming." },
  whistle: { meaning: "A small device that makes a sharp sound when blown.", example: "The referee blew the whistle to start the game." },
  net: { meaning: "A mesh barrier used in sports like tennis or soccer.", example: "The ball flew straight into the net." },

  // Music genres
  rock: { meaning: "A style of music with a strong beat, often played on guitars.", example: "He grew up listening to classic rock." },
  jazz: { meaning: "A style of music known for improvisation and rhythm.", example: "They listened to jazz at the small club." },
  reggae: { meaning: "A style of music from Jamaica with a relaxed rhythm.", example: "The beach bar played reggae all afternoon." },
  classical: { meaning: "A traditional style of formal, orchestral music.", example: "She studied classical music at the conservatory." },
  blues: { meaning: "A style of music expressing sadness, with roots in African American culture.", example: "He played a slow blues song on his guitar." },
  pop: { meaning: "A popular, catchy style of music.", example: "That pop song was on the radio all summer." },

  // Family
  mother: { meaning: "A female parent.", example: "Her mother cooked dinner for the whole family." },
  father: { meaning: "A male parent.", example: "His father taught him how to fish." },
  sister: { meaning: "A female sibling.", example: "My sister and I share a room." },
  brother: { meaning: "A male sibling.", example: "His brother helped him move to a new apartment." },
  grandmother: { meaning: "The mother of one's mother or father.", example: "Her grandmother told stories about the old days." },
  grandfather: { meaning: "The father of one's mother or father.", example: "His grandfather served in the navy." },
  aunt: { meaning: "The sister of one's mother or father.", example: "Her aunt sent her a birthday card." },
  uncle: { meaning: "The brother of one's mother or father.", example: "His uncle taught him how to drive." },

  // Planets
  mercury: { meaning: "The smallest planet and the closest to the sun.", example: "Mercury is extremely hot during the day." },
  venus: { meaning: "The second planet from the sun, known for its thick clouds.", example: "Venus is often called Earth's twin." },
  mars: { meaning: "The fourth planet from the sun, known as the red planet.", example: "Scientists sent a rover to explore Mars." },
  jupiter: { meaning: "The largest planet in the solar system.", example: "Jupiter has a giant storm called the Great Red Spot." },
  saturn: { meaning: "A large planet famous for its bright rings.", example: "Saturn's rings are made of ice and rock." },
  uranus: { meaning: "A blue-green planet that spins on its side.", example: "Uranus takes 84 years to orbit the sun." },
  neptune: { meaning: "The farthest known planet from the sun.", example: "Neptune has the strongest winds in the solar system." },

  // Continents
  asia: { meaning: "The largest continent, home to many countries and cultures.", example: "They traveled across Asia for six months." },
  africa: { meaning: "A continent known for its deserts, wildlife, and diverse cultures.", example: "Many rivers flow through Africa." },
  europe: { meaning: "A continent made up of many countries, from Portugal to Russia.", example: "They visited five countries in Europe." },
  australia: { meaning: "A continent and country known for unique animals like kangaroos.", example: "Kangaroos are found only in Australia." },
  antarctica: { meaning: "The icy continent at the South Pole.", example: "Very few people live in Antarctica." },

  // Seasons
  spring: { meaning: "The season between winter and summer, when plants bloom.", example: "Flowers bloom everywhere in spring." },
  summer: { meaning: "The warmest season of the year.", example: "They spent the summer at the beach." },
  autumn: { meaning: "The season between summer and winter, when leaves fall.", example: "The leaves turned orange in autumn." },
  winter: { meaning: "The coldest season of the year.", example: "It snows heavily here every winter." },

  // Medical jobs
  surgeon: { meaning: "A doctor who performs operations.", example: "The surgeon operated on his knee." },
  dentist: { meaning: "A doctor who treats teeth.", example: "She visits the dentist twice a year." },
  pharmacist: { meaning: "A person trained to prepare and give out medicine.", example: "The pharmacist explained how to take the medicine." },
  therapist: { meaning: "A person trained to help treat physical or mental problems.", example: "He talks to his therapist every week." },
  paramedic: { meaning: "A person trained to give emergency medical care.", example: "The paramedic arrived quickly at the accident." },

  // Bakery
  bread: { meaning: "A basic food made from baked flour and water.", example: "She sliced fresh bread for sandwiches." },
  bagel: { meaning: "A dense, ring-shaped bread roll.", example: "He had a bagel with cream cheese for breakfast." },
  croissant: { meaning: "A flaky, crescent-shaped pastry.", example: "She bought a warm croissant from the bakery." },
  muffin: { meaning: "A small, round baked cake, often eaten at breakfast.", example: "He grabbed a blueberry muffin on his way out." },
  pretzel: { meaning: "A salty, twisted bread snack.", example: "They shared a warm pretzel at the fair." },
  biscuit: { meaning: "A small, soft baked bread, or a hard sweet cracker.", example: "She served warm biscuits with butter." },

  // Seafood
  shrimp: { meaning: "A small edible shellfish.", example: "They grilled shrimp for the barbecue." },
  lobster: { meaning: "A large sea creature with claws, eaten as seafood.", example: "The restaurant is famous for its lobster." },
  salmon: { meaning: "A pink-fleshed fish often eaten as food.", example: "She baked salmon with lemon and herbs." },
  tuna: { meaning: "A large ocean fish often used in sandwiches and sushi.", example: "He made a tuna sandwich for lunch." },
  oyster: { meaning: "A shellfish that lives in a hard shell, sometimes producing pearls.", example: "They ordered a plate of fresh oysters." },
  clam: { meaning: "A small shellfish that lives in sand or mud.", example: "The chowder was full of clams." },

  // Dairy
  cheese: { meaning: "A solid food made from milk.", example: "He added cheese to his sandwich." },
  yogurt: { meaning: "A thick, creamy food made from fermented milk.", example: "She eats yogurt with fruit for breakfast." },
  butter: { meaning: "A soft yellow food made from cream, used for cooking or spreading.", example: "He spread butter on his toast." },
  cream: { meaning: "The thick, fatty part of milk.", example: "She added cream to her coffee." },

  // Spices
  salt: { meaning: "A white substance used to flavor food.", example: "He added a pinch of salt to the soup." },
  cinnamon: { meaning: "A sweet, warm spice made from tree bark.", example: "She sprinkled cinnamon on her oatmeal." },
  ginger: { meaning: "A spicy root used in cooking and tea.", example: "He added fresh ginger to the stir-fry." },
  basil: { meaning: "A fragrant green herb used in cooking.", example: "She added basil to the tomato sauce." },
  oregano: { meaning: "A fragrant herb often used in Italian cooking.", example: "He sprinkled oregano on the pizza." },
  nutmeg: { meaning: "A warm, fragrant spice made from a seed.", example: "She grated nutmeg over the eggnog." },

  // Disasters
  hurricane: { meaning: "A powerful storm with strong winds and heavy rain.", example: "The hurricane forced thousands to evacuate." },
  tornado: { meaning: "A violently spinning column of air.", example: "The tornado destroyed several houses in town." },
  earthquake: { meaning: "A sudden shaking of the ground.", example: "The earthquake damaged many old buildings." },
  flood: { meaning: "An overflow of water onto normally dry land.", example: "The flood covered the entire street." },
  drought: { meaning: "A long period without enough rain.", example: "The drought made it hard to grow crops." },

  // Organs
  heart: { meaning: "The organ that pumps blood through the body.", example: "Exercise is good for your heart." },
  brain: { meaning: "The organ inside the head that controls thought and movement.", example: "The brain processes everything we see and hear." },
  lung: { meaning: "One of the two organs used for breathing.", example: "Smoking can damage your lungs." },
  liver: { meaning: "An organ that cleans the blood and helps digestion.", example: "The liver breaks down toxins in the body." },
  kidney: { meaning: "One of the two organs that filter waste from the blood.", example: "Drinking water is good for your kidneys." },
  stomach: { meaning: "The organ where food is digested.", example: "Her stomach growled before lunch." },

  // Computer parts
  keyboard: { meaning: "A set of keys used to type on a computer.", example: "He spilled coffee on his keyboard." },
  mouse: { meaning: "A small device used to move the pointer on a computer screen.", example: "She clicked the mouse to open the file." },
  monitor: { meaning: "The screen connected to a computer.", example: "He bought a bigger monitor for his desk." },
  printer: { meaning: "A machine that puts text or images onto paper.", example: "The printer ran out of ink." },
  charger: { meaning: "A device used to add power to a battery.", example: "She forgot her phone charger at home." },

  // Bathroom
  towel: { meaning: "A piece of cloth used for drying.", example: "He wrapped a towel around his waist." },
  soap: { meaning: "A substance used with water for washing.", example: "She washed her hands with soap." },
  shampoo: { meaning: "A liquid soap used for washing hair.", example: "He used shampoo to wash his hair." },
  toothbrush: { meaning: "A small brush used to clean teeth.", example: "She packed her toothbrush for the trip." },
  toothpaste: { meaning: "A paste used with a toothbrush to clean teeth.", example: "He squeezed toothpaste onto his toothbrush." },
  razor: { meaning: "A sharp tool used to shave hair.", example: "He nicked his chin with the razor." },

  // Baby items
  diaper: { meaning: "Absorbent underwear worn by babies.", example: "She changed the baby's diaper." },
  stroller: { meaning: "A small vehicle used to push a baby around.", example: "She pushed the stroller through the park." },
  crib: { meaning: "A small bed with high sides for a baby.", example: "The baby slept peacefully in the crib." },
  bottle: { meaning: "A container used to feed liquid to a baby.", example: "She warmed the bottle before feeding the baby." },
  pacifier: { meaning: "A rubber object given to a baby to suck on.", example: "The baby calmed down with the pacifier." },

  // Camping
  tent: { meaning: "A portable shelter made of fabric, used for camping.", example: "They set up the tent before it got dark." },
  backpack: { meaning: "A bag carried on the back, used for hiking or school.", example: "He packed his backpack for the hike." },
  compass: { meaning: "A tool used to find directions.", example: "She used a compass to find north." },
  flashlight: { meaning: "A small portable light powered by batteries.", example: "He used a flashlight to find his way in the dark." },
  lantern: { meaning: "A portable light, often with a handle, used outdoors.", example: "They hung a lantern outside the tent." },

  // Tech jobs
  programmer: { meaning: "A person who writes computer code.", example: "The programmer fixed the bug in the app." },
  designer: { meaning: "A person who plans how something looks or works.", example: "The designer created a new logo for the company." },
  analyst: { meaning: "A person who studies information to find useful patterns.", example: "The analyst reviewed the sales data." },
  developer: { meaning: "A person who builds software or applications.", example: "The developer released a new update." },
  technician: { meaning: "A person skilled in the practical side of a technical job.", example: "The technician repaired the broken machine." },

  // Dance
  ballet: { meaning: "A formal style of dance with precise movements.", example: "She has practiced ballet since she was five." },
  salsa: { meaning: "A lively dance style from Latin America.", example: "They took salsa lessons every Friday." },
  tango: { meaning: "A dramatic partner dance from Argentina.", example: "They danced the tango at the competition." },
  waltz: { meaning: "A smooth ballroom dance in three-quarter time.", example: "They danced a slow waltz at the wedding." },

  // Currency
  dollar: { meaning: "The main unit of money in several countries, including the US.", example: "The book cost ten dollars." },
  euro: { meaning: "The currency used by many European countries.", example: "She exchanged her money for euros." },
  pound: { meaning: "The main unit of money in the United Kingdom.", example: "He paid twenty pounds for the ticket." },
  yen: { meaning: "The main unit of money in Japan.", example: "She converted her dollars into yen." },
  peso: { meaning: "The main unit of money in several Latin American countries.", example: "He paid for lunch in pesos." },

  // Games
  chess: { meaning: "A board game played with strategy on a checkered board.", example: "They played chess for hours." },
  checkers: { meaning: "A board game played by jumping over the opponent's pieces.", example: "The kids played checkers on a rainy day." },
  puzzle: { meaning: "A game made of pieces that fit together to form a picture.", example: "They finished the puzzle together." },
  dominoes: { meaning: "A game played with small tiles marked with dots.", example: "They played dominoes after dinner." },
  dice: { meaning: "Small cubes marked with numbers, used in games of chance.", example: "She rolled the dice and moved her piece." },

  // Materials
  wood: { meaning: "A hard material that comes from trees.", example: "The table was made of solid wood." },
  plastic: { meaning: "A light, man-made material that can be molded into shapes.", example: "The toy was made of plastic." },
  glass: { meaning: "A hard, clear material used for windows and bottles.", example: "The window was made of thick glass." },
  fabric: { meaning: "Cloth or material made by weaving fibers together.", example: "She chose a soft fabric for the curtains." },
  leather: { meaning: "A material made from animal skin.", example: "He wore a leather jacket." },
  rubber: { meaning: "A stretchy, waterproof material.", example: "The tires were made of rubber." },

  // Vehicles
  motorcycle: { meaning: "A two-wheeled motor vehicle.", example: "He rode his motorcycle to work." },
  truck: { meaning: "A large vehicle used to carry goods.", example: "The truck delivered furniture to the house." },
  van: { meaning: "A medium-sized vehicle used to carry goods or passengers.", example: "They loaded the boxes into the van." },
  scooter: { meaning: "A small, lightweight two-wheeled vehicle.", example: "She rode her scooter to the store." },
  tractor: { meaning: "A powerful vehicle used on farms to pull equipment.", example: "The farmer drove the tractor across the field." },

  // Synonyms — Scared
  afraid: { meaning: "Feeling fear.", example: "She was afraid of the dark as a child." },
  frightened: { meaning: "Suddenly afraid.", example: "The loud noise frightened the cat." },
  terrified: { meaning: "Extremely afraid.", example: "He was terrified of heights." },
  fearful: { meaning: "Feeling or showing fear.", example: "She gave a fearful glance at the storm clouds." },

  // Synonyms — Beautiful
  pretty: { meaning: "Attractive in a pleasant way.", example: "She wore a pretty dress to the party." },
  lovely: { meaning: "Very beautiful or pleasant.", example: "They had a lovely time at the beach." },
  gorgeous: { meaning: "Extremely beautiful.", example: "The sunset over the ocean was gorgeous." },
  attractive: { meaning: "Pleasing in appearance.", example: "The house had an attractive garden." },

  // Synonyms — Tired
  exhausted: { meaning: "Extremely tired.", example: "She was exhausted after the long flight." },
  sleepy: { meaning: "Feeling like you need to sleep.", example: "He felt sleepy after the big lunch." },
  weary: { meaning: "Very tired, especially from hard work.", example: "The weary travelers finally reached the hotel." },
  drowsy: { meaning: "Feeling sleepy and lacking energy.", example: "The medicine made her feel drowsy." },

  // Synonyms — Funny
  hilarious: { meaning: "Extremely funny.", example: "The movie was absolutely hilarious." },
  amusing: { meaning: "Causing laughter or enjoyment.", example: "He told an amusing story about his trip." },
  comical: { meaning: "Funny in a light, silly way.", example: "The dog's comical antics made everyone laugh." },
  witty: { meaning: "Cleverly funny.", example: "She gave a witty reply to his question." },

  // Synonyms — Important
  essential: { meaning: "Absolutely necessary.", example: "Water is essential for life." },
  crucial: { meaning: "Extremely important.", example: "This meeting is crucial for the project." },
  vital: { meaning: "Necessary for success or survival.", example: "Sleep is vital for good health." },
  significant: { meaning: "Important or meaningful.", example: "There was a significant change in the weather." },

  // Synonyms — Furious
  irritated: { meaning: "Feeling slightly angry.", example: "He was irritated by the constant noise." },
  annoyed: { meaning: "Feeling mildly angry or bothered.", example: "She was annoyed by the delay." },
  outraged: { meaning: "Feeling very angry about something unfair.", example: "The public was outraged by the decision." },
  livid: { meaning: "Extremely angry.", example: "He was livid when he saw the damage." },

  // Synonyms — Calm
  peaceful: { meaning: "Free from disturbance; calm.", example: "The lake was peaceful in the early morning." },
  relaxed: { meaning: "Free from tension or worry.", example: "She felt relaxed after her vacation." },
  tranquil: { meaning: "Calm and quiet.", example: "The garden was a tranquil place to read." },
  serene: { meaning: "Calm, peaceful, and untroubled.", example: "Her serene expression calmed the whole room." },

  // Synonyms — Old
  ancient: { meaning: "Very old, from a long time ago.", example: "They explored the ancient ruins." },
  elderly: { meaning: "Old, especially referring to people.", example: "She helps care for her elderly neighbor." },
  aged: { meaning: "Having lived or existed for a long time.", example: "The aged wine was very expensive." },
  antique: { meaning: "Old and often valuable.", example: "She collects antique furniture." },

  // Synonyms — Modern
  recent: { meaning: "Happening or made not long ago.", example: "They discussed recent news events." },
  current: { meaning: "Belonging to the present time.", example: "The current price is much higher than last year." },
  contemporary: { meaning: "Belonging to the present time, modern.", example: "The museum features contemporary art." },
  updated: { meaning: "Made more current or modern.", example: "She installed the updated software." },

  // Synonyms — Wealthy
  rich: { meaning: "Having a lot of money.", example: "The rich businessman donated to charity." },
  affluent: { meaning: "Having a great deal of money.", example: "They live in an affluent neighborhood." },
  prosperous: { meaning: "Successful and wealthy.", example: "The company had a prosperous year." },

  // Synonyms — Poor
  broke: { meaning: "Having no money.", example: "He was broke after paying his bills." },
  needy: { meaning: "Not having enough money for basic needs.", example: "They donated food to needy families." },
  impoverished: { meaning: "Extremely poor.", example: "The charity helps impoverished communities." },

  // Synonyms — Brave
  courageous: { meaning: "Showing bravery.", example: "The courageous firefighter saved the family." },
  fearless: { meaning: "Showing no fear.", example: "She gave a fearless performance on stage." },
  bold: { meaning: "Confident and willing to take risks.", example: "He made a bold decision to start his own business." },
  heroic: { meaning: "Very brave, like a hero.", example: "The soldier's heroic actions saved many lives." },

  // Synonyms — Lazy
  idle: { meaning: "Not working or being active.", example: "The machines sat idle over the weekend." },
  sluggish: { meaning: "Slow moving and lacking energy.", example: "He felt sluggish after the big meal." },
  inactive: { meaning: "Not active or moving.", example: "She has been inactive since her injury." },

  // Synonyms — Delicious
  tasty: { meaning: "Having a pleasant flavor.", example: "The soup was hot and tasty." },
  yummy: { meaning: "Very tasty, often used casually.", example: "The kids said the cookies were yummy." },
  scrumptious: { meaning: "Extremely delicious.", example: "She baked a scrumptious chocolate cake." },
  savory: { meaning: "Having a pleasant, salty or spicy taste, not sweet.", example: "He prefers savory snacks over sweet ones." },

  // Synonyms — Messy
  untidy: { meaning: "Not neat or organized.", example: "His room was always untidy." },
  filthy: { meaning: "Extremely dirty.", example: "The workers' clothes were filthy after the job." },
  chaotic: { meaning: "In a state of complete disorder.", example: "The kitchen was chaotic during the dinner rush." },
  cluttered: { meaning: "Full of things in an untidy way.", example: "Her desk was cluttered with papers." },

  // Synonyms — Tidy
  spotless: { meaning: "Perfectly clean.", example: "The hotel room was spotless." },
  neat: { meaning: "Clean and orderly.", example: "He kept his desk neat and organized." },
  pristine: { meaning: "In its original, perfect condition.", example: "The car was in pristine condition." },
  organized: { meaning: "Arranged in a neat, orderly way.", example: "Her files were well organized." },

  // Synonyms — Noisy
  loud: { meaning: "Making a lot of sound.", example: "The music was too loud for the small room." },
  deafening: { meaning: "Extremely loud.", example: "The explosion made a deafening sound." },
  booming: { meaning: "Making a loud, deep sound.", example: "His booming voice filled the hall." },
  blaring: { meaning: "Making a loud, unpleasant noise.", example: "The blaring alarm woke everyone up." },

  // Synonyms — Thin
  skinny: { meaning: "Very thin, especially of a person.", example: "The skinny cat looked hungry." },
  slim: { meaning: "Attractively thin.", example: "She stayed slim by exercising regularly." },
  slender: { meaning: "Gracefully thin.", example: "The dancer had a slender frame." },
  lean: { meaning: "Thin and fit, without extra fat.", example: "The athlete had a lean, muscular body." },

  // Synonyms — Heavy
  weighty: { meaning: "Having great weight or importance.", example: "He carried a weighty box up the stairs." },
  hefty: { meaning: "Large and heavy.", example: "She lifted the hefty suitcase onto the shelf." },
  bulky: { meaning: "Large and difficult to carry.", example: "The bulky package didn't fit in the car." },

  // Synonyms — Famous
  renowned: { meaning: "Well known for a particular quality.", example: "The chef is renowned for his desserts." },
  celebrated: { meaning: "Famous and admired.", example: "She is a celebrated author." },
  legendary: { meaning: "Extremely famous, almost like a legend.", example: "He is a legendary figure in the sport." },
  notable: { meaning: "Worthy of attention or notice.", example: "There were several notable guests at the event." },

  // Antonyms — Brightness
  bright: { meaning: "Full of light.", example: "The bright sun woke her up early." },
  dark: { meaning: "With little or no light.", example: "The room was too dark to read in." },
  dim: { meaning: "Not bright; faintly lit.", example: "The dim light made it hard to see." },
  shadowy: { meaning: "Full of shadows; dark and unclear.", example: "They walked down a shadowy alley." },

  // Antonyms — Cleanliness
  clean: { meaning: "Free from dirt.", example: "She kept her kitchen very clean." },
  dirty: { meaning: "Covered with dirt.", example: "His shoes were dirty after the hike." },
  sanitary: { meaning: "Clean and free of germs.", example: "The hospital kept everything sanitary." },
  grimy: { meaning: "Covered with dirt or grime.", example: "His hands were grimy after fixing the car." },

  // Antonyms — Politeness
  polite: { meaning: "Having good manners.", example: "The polite waiter greeted every guest." },
  rude: { meaning: "Not polite; disrespectful.", example: "It was rude of him to interrupt her." },
  courteous: { meaning: "Polite and considerate.", example: "The staff were courteous and helpful." },
  impolite: { meaning: "Not polite; showing bad manners.", example: "It was impolite to speak with his mouth full." },

  // Antonyms — Honesty
  honest: { meaning: "Truthful and sincere.", example: "She gave an honest answer to the question." },
  dishonest: { meaning: "Not honest; likely to lie or cheat.", example: "The dishonest salesman lied about the price." },
  truthful: { meaning: "Telling the truth.", example: "He was truthful about what happened." },
  deceitful: { meaning: "Tending to deceive or lie.", example: "Her deceitful behavior surprised everyone." },

  // Antonyms — Kindness
  kind: { meaning: "Friendly and considerate.", example: "She is always kind to strangers." },
  cruel: { meaning: "Causing pain or suffering deliberately.", example: "It was cruel to leave the dog outside in the cold." },
  gentle: { meaning: "Mild and kind in manner.", example: "He spoke in a gentle voice to the crying child." },
  harsh: { meaning: "Severe or unkind.", example: "The teacher's harsh words upset the student." },

  // Antonyms — Height
  tall: { meaning: "Having a great height.", example: "The tall building blocked the sun." },
  short: { meaning: "Having a small height.", example: "He is shorter than his younger brother." },
  towering: { meaning: "Extremely tall.", example: "A towering skyscraper stood in the city center." },
  petite: { meaning: "Small and slim, usually describing a person.", example: "She was petite but very strong." },

  // Antonyms — Width
  wide: { meaning: "Measuring a lot from side to side.", example: "The river was too wide to cross on foot." },
  narrow: { meaning: "Small in width.", example: "They walked down a narrow street." },
  broad: { meaning: "Wide, covering a large area.", example: "He has broad shoulders." },
  thin: { meaning: "Having a small distance between opposite surfaces.", example: "She sliced the bread into thin pieces." },

  // Antonyms — Age
  young: { meaning: "Having lived only a short time.", example: "The young puppy was full of energy." },
  old: { meaning: "Having lived or existed for a long time.", example: "The old man walked slowly with a cane." },
  youthful: { meaning: "Looking or acting young.", example: "She has a youthful appearance for her age." },
  mature: { meaning: "Fully developed; grown up.", example: "He handled the problem in a mature way." },

  // Antonyms — Safety
  safe: { meaning: "Free from danger.", example: "The children played in a safe area." },
  dangerous: { meaning: "Likely to cause harm.", example: "The road was dangerous during the storm." },
  risky: { meaning: "Involving a chance of danger or loss.", example: "Investing all his money was a risky choice." },
  secure: { meaning: "Safe and protected.", example: "She felt secure in her new home." },

  // Antonyms — Success
  successful: { meaning: "Achieving a desired result.", example: "The launch was a successful event." },
  unsuccessful: { meaning: "Not achieving a desired result.", example: "Their first attempt was unsuccessful." },
  victorious: { meaning: "Having won a contest or battle.", example: "The victorious team celebrated on the field." },
  defeated: { meaning: "Having lost a contest or battle.", example: "The defeated team left the stadium quietly." },

  // Antonyms — Freedom
  free: { meaning: "Not under the control of someone else.", example: "The bird was finally free to fly away." },
  trapped: { meaning: "Unable to escape.", example: "The hikers were trapped by the sudden storm." },
  captive: { meaning: "Held as a prisoner.", example: "The captive animal was returned to the wild." },
  liberated: { meaning: "Set free.", example: "The prisoners were liberated after the war." },

  // Antonyms — Visibility
  visible: { meaning: "Able to be seen.", example: "The mountain was visible from their window." },
  invisible: { meaning: "Not able to be seen.", example: "The glass was almost invisible in the water." },
  hidden: { meaning: "Kept out of sight.", example: "The treasure was hidden under the floor." },
  clear: { meaning: "Easy to see through or understand.", example: "The water in the lake was perfectly clear." },

  // Functions — Social
  post: { meaning: "To put something online for others to see.", example: "She likes to post pictures of her trips." },
  comment: { meaning: "To write a remark about something online or in conversation.", example: "He left a comment under the video." },
  like: { meaning: "To show approval, often online.", example: "She hit like on his new photo." },
  share: { meaning: "To pass something along to others.", example: "He decided to share the article with his friends." },
  follow: { meaning: "To subscribe to someone's updates online.", example: "She started to follow her favorite artist online." },

  // Functions — Communication
  call: { meaning: "To speak to someone by phone.", example: "She decided to call her mother after work." },
  text: { meaning: "To send a written message using a phone.", example: "He will text you the address later." },
  email: { meaning: "To send a message using the internet.", example: "She will email the report tonight." },
  chat: { meaning: "To talk casually with someone.", example: "They like to chat over coffee." },
  message: { meaning: "To send a short note to someone.", example: "He will message her when he arrives." },

  // Functions — Cleaning
  wash: { meaning: "To clean using water.", example: "He needs to wash the dirty dishes." },
  sweep: { meaning: "To clean a floor using a broom.", example: "She swept the kitchen floor after dinner." },
  mop: { meaning: "To clean a floor with a wet mop.", example: "He mopped the floor after the spill." },
  dust: { meaning: "To remove dust from surfaces.", example: "She likes to dust the shelves every week." },
  scrub: { meaning: "To clean something by rubbing it hard.", example: "He had to scrub the pot to remove the burnt food." },

  // Functions — Building
  build: { meaning: "To construct something.", example: "They plan to build a new house next year." },
  design: { meaning: "To plan the look or structure of something.", example: "She was hired to design the new logo." },
  construct: { meaning: "To build something, usually large.", example: "Workers will construct a bridge over the river." },
  repair: { meaning: "To fix something that is broken.", example: "He called someone to repair the roof." },
  demolish: { meaning: "To completely destroy a building.", example: "They will demolish the old factory next month." },

  // Functions — Shopping
  buy: { meaning: "To get something by paying money.", example: "She plans to buy a new laptop." },
  sell: { meaning: "To give something in exchange for money.", example: "He wants to sell his old car." },
  trade: { meaning: "To exchange one thing for another.", example: "They agreed to trade baseball cards." },
  exchange: { meaning: "To give something and receive something else in return.", example: "She wanted to exchange the shirt for a bigger size." },
  browse: { meaning: "To look around casually without a specific goal.", example: "They like to browse the shops on weekends." },

  // Functions — Learning
  study: { meaning: "To spend time learning about a subject.", example: "She will study for the exam tonight." },
  memorize: { meaning: "To learn something so you can remember it exactly.", example: "He had to memorize the poem for class." },
  practice: { meaning: "To do something repeatedly to improve a skill.", example: "She practices the piano every day." },
  research: { meaning: "To study something carefully to find information.", example: "They will research the topic before writing." },
  review: { meaning: "To look over something again to check or study it.", example: "He plans to review his notes before the test." },

  // Parts of a plant
  root: { meaning: "The part of a plant that grows underground.", example: "The roots absorb water from the soil." },
  stem: { meaning: "The main stalk of a plant.", example: "The flower's stem was bent by the wind." },
  leaf: { meaning: "A flat green part of a plant that grows from the stem.", example: "A single leaf fell from the tree." },
  petal: { meaning: "One of the colored outer parts of a flower.", example: "A petal fell from the wilting rose." },
  seed: { meaning: "The small part of a plant from which a new plant grows.", example: "She planted a seed in the garden." },
  branch: { meaning: "A part of a tree that grows out from the trunk.", example: "A bird landed on a high branch." },

  // Parts of a book
  cover: { meaning: "The outer protective part of a book.", example: "The book had a bright red cover." },
  page: { meaning: "One side of a sheet of paper in a book.", example: "She turned to the next page." },
  chapter: { meaning: "A main division of a book.", example: "He finished the first chapter before bed." },
  title: { meaning: "The name of a book or other work.", example: "The title of the novel caught her attention." },
  author: { meaning: "The person who wrote a book.", example: "The author signed copies of her new book." },

  // Parts of a shoe
  sole: { meaning: "The bottom part of a shoe that touches the ground.", example: "The sole of his shoe was worn thin." },
  lace: { meaning: "A string used to tie a shoe.", example: "Her shoe lace came undone during the race." },
  heel: { meaning: "The raised back part of a shoe.", example: "The heel of her shoe broke on the stairs." },
  tongue: { meaning: "The flap of material under the laces of a shoe.", example: "The tongue of the sneaker was padded for comfort." },

  // Parts of the face
  eye: { meaning: "The organ used for seeing.", example: "She closed her eyes and fell asleep." },
  nose: { meaning: "The part of the face used for breathing and smelling.", example: "His nose was cold in the winter air." },
  mouth: { meaning: "The opening in the face used for eating and speaking.", example: "She covered her mouth when she laughed." },
  ear: { meaning: "The organ used for hearing.", example: "He whispered the answer in her ear." },
  cheek: { meaning: "The side of the face below the eye.", example: "She kissed him on the cheek." },
  chin: { meaning: "The part of the face below the mouth.", example: "He rested his chin on his hand." },

  // Evening routine
  relax: { meaning: "To rest and become calm.", example: "She likes to relax with a book in the evening." },
  dine: { meaning: "To eat dinner.", example: "They decided to dine at a nice restaurant." },
  unwind: { meaning: "To relax after a period of work or stress.", example: "He likes to unwind by watching a movie." },
  socialize: { meaning: "To spend time with others in a friendly way.", example: "She likes to socialize with friends after work." },

  // Weekend activities
  picnic: { meaning: "A meal eaten outdoors, often in a park.", example: "They had a picnic by the lake." },
  hike: { meaning: "To walk a long distance, often in nature.", example: "They plan to hike the mountain trail." },
  camp: { meaning: "To sleep outdoors, often in a tent.", example: "They decided to camp near the river." },
  barbecue: { meaning: "A meal cooked outdoors over an open fire.", example: "They had a barbecue in the backyard." },

  // Party
  celebrate: { meaning: "To mark a happy occasion with enjoyable activities.", example: "They celebrated her graduation with a party." },
  dance: { meaning: "To move rhythmically to music.", example: "They danced all night at the wedding." },
  sing: { meaning: "To make music with your voice.", example: "She loves to sing at karaoke." },
  decorate: { meaning: "To make something look more attractive.", example: "They decorated the room with balloons." },

  // Winter activities
  ski: { meaning: "To glide over snow on skis.", example: "They went to ski in the mountains." },
  skate: { meaning: "To glide on ice or wheels.", example: "They like to skate at the rink downtown." },
  sled: { meaning: "To ride down a snowy hill on a sled.", example: "The kids love to sled after a big snowfall." },
  shovel: { meaning: "To move snow or dirt using a tool.", example: "He had to shovel the driveway after the storm." },

  // School activities
  read: { meaning: "To look at and understand written words.", example: "She likes to read before bed." },
  write: { meaning: "To put words on paper or a screen.", example: "He had to write an essay for class." },
  listen: { meaning: "To pay attention to sound.", example: "Please listen carefully to the instructions." },
  discuss: { meaning: "To talk about something with others.", example: "They discussed the book in class." },

  // Exercise
  jog: { meaning: "To run at a slow, steady pace.", example: "She likes to jog in the park every morning." },
  stretch: { meaning: "To extend your muscles to improve flexibility.", example: "He stretches before every workout." },
  lift: { meaning: "To raise something up, often weights.", example: "He can lift heavy weights at the gym." },
  squat: { meaning: "To lower your body by bending your knees.", example: "She did twenty squats during her workout." },

  // Wedding
  bride: { meaning: "A woman on her wedding day.", example: "The bride wore a beautiful white dress." },
  groom: { meaning: "A man on his wedding day.", example: "The groom waited nervously at the altar." },
  ring: { meaning: "A circular band worn on the finger, often to show marriage.", example: "He slipped the ring onto her finger." },
  veil: { meaning: "A piece of thin fabric worn over the face or head.", example: "The bride lifted her veil for the kiss." },
  bouquet: { meaning: "A bunch of flowers, often carried at a wedding.", example: "She threw the bouquet to the crowd." },

  // Hospital
  patient: { meaning: "A person receiving medical care.", example: "The patient waited to see the doctor." },
  surgery: { meaning: "A medical operation.", example: "He had surgery on his broken leg." },
  injection: { meaning: "The act of putting medicine into the body with a needle.", example: "The nurse gave him a painless injection." },
  bandage: { meaning: "A strip of material used to cover a wound.", example: "She wrapped a bandage around his arm." },
  prescription: { meaning: "A doctor's written instruction for medicine.", example: "He picked up his prescription at the pharmacy." },

  // Gym
  treadmill: { meaning: "A machine used for walking or running in place.", example: "She runs on the treadmill every morning." },
  dumbbell: { meaning: "A short bar with weights on each end, used for exercise.", example: "He lifted a dumbbell in each hand." },
  workout: { meaning: "A session of physical exercise.", example: "She had a great workout at the gym." },
  trainer: { meaning: "A person who helps others exercise correctly.", example: "Her trainer showed her the correct form." },
  membership: { meaning: "The right to belong to a club or organization.", example: "He bought a yearly gym membership." },

  // Library
  librarian: { meaning: "A person who works in and manages a library.", example: "The librarian helped her find the book." },
  bookshelf: { meaning: "A shelf used to hold books.", example: "He arranged his books on the bookshelf." },
  borrow: { meaning: "To take something with the intention of returning it.", example: "She wanted to borrow a novel from the library." },
  silence: { meaning: "Complete absence of sound.", example: "The library was filled with silence." },

  // Bank
  deposit: { meaning: "To put money into a bank account.", example: "He went to deposit his paycheck." },
  withdraw: { meaning: "To take money out of a bank account.", example: "She had to withdraw cash for the trip." },
  account: { meaning: "A record of money held at a bank.", example: "He opened a new savings account." },
  teller: { meaning: "A person who handles money transactions at a bank.", example: "The teller counted the cash carefully." },
  loan: { meaning: "Money borrowed that must be paid back.", example: "They took out a loan to buy the house." },

  // Cinema
  popcorn: { meaning: "A snack made from popped corn kernels.", example: "They shared a large popcorn during the movie." },
  theater: { meaning: "A place where movies or plays are shown.", example: "They watched the new film at the theater." },
  screen: { meaning: "The flat surface where a movie or image is shown.", example: "The screen went dark during the storm." },
  trailer: { meaning: "A short preview of a movie.", example: "The trailer made the movie look exciting." },
  audience: { meaning: "The group of people watching a show or movie.", example: "The audience clapped at the end of the film." },

  // Health concepts
  fitness: { meaning: "The condition of being physically healthy and strong.", example: "Regular exercise improves your fitness." },
  nutrition: { meaning: "The process of eating the right food for health.", example: "Good nutrition is important for children." },
  wellness: { meaning: "The state of being healthy in body and mind.", example: "The spa focuses on relaxation and wellness." },
  hygiene: { meaning: "Practices that keep you and your surroundings clean.", example: "Good hygiene helps prevent illness." },

  // Environment concepts
  pollution: { meaning: "Harmful substances that damage the environment.", example: "Air pollution is a problem in big cities." },
  recycling: { meaning: "The process of turning waste into reusable material.", example: "They started a recycling program at school." },
  conservation: { meaning: "The protection of nature and natural resources.", example: "The park is known for its wildlife conservation." },
  sustainability: { meaning: "Meeting needs without harming future resources.", example: "The company focuses on environmental sustainability." },

  // Education concepts
  knowledge: { meaning: "Information and understanding gained through learning.", example: "She has a deep knowledge of history." },
  curriculum: { meaning: "The subjects taught in a school or course.", example: "The school updated its science curriculum." },
  literacy: { meaning: "The ability to read and write.", example: "The program improves literacy among children." },
  graduation: { meaning: "The completion of a course of study.", example: "Her graduation ceremony was in June." },

  // Technology concepts
  software: { meaning: "Computer programs used to perform tasks.", example: "She installed new software on her laptop." },
  hardware: { meaning: "The physical parts of a computer.", example: "The technician replaced a broken piece of hardware." },
  network: { meaning: "A system of connected computers or devices.", example: "The office network went down this morning." },
  data: { meaning: "Information collected for reference or analysis.", example: "The company collects a lot of customer data." },

  // Culture concepts
  tradition: { meaning: "A custom passed down through generations.", example: "It is a family tradition to cook together on Sundays." },
  custom: { meaning: "A usual way of behaving in a place or group.", example: "It is a local custom to remove your shoes indoors." },
  heritage: { meaning: "Traditions and history passed down from the past.", example: "They are proud of their cultural heritage." },
  festival: { meaning: "A day or event of celebration.", example: "The town holds a music festival every summer." },

  // Justice concepts
  law: { meaning: "A rule made by a government that must be obeyed.", example: "It is against the law to drive without a license." },
  crime: { meaning: "An action that breaks the law.", example: "The police investigated the crime." },
  punishment: { meaning: "A penalty given for wrongdoing.", example: "The punishment for the crime was a heavy fine." },
  verdict: { meaning: "The official decision made in a court case.", example: "The jury reached a verdict after two days." },
};

/* Relation groups: each has an id, a TYPE, a short one-word NAME,
   and the list of words that belong to it (3 to 8 words). Any two
   words that share a relation group are considered "related". */
const RELATIONS = [
  { id: "cat_fruits", type: "Category", name: "Fruits", words: ["apple", "banana", "orange", "grape", "mango", "strawberry", "pineapple", "watermelon"] },
  { id: "cat_weather", type: "Category", name: "Weather", words: ["rain", "sunny", "cloudy", "windy", "snow", "storm", "fog", "thunder"] },
  { id: "cat_emotions", type: "Category", name: "Emotions", words: ["happy", "sad", "angry", "nervous", "excited", "bored", "surprised", "proud"] },
  { id: "cat_furniture", type: "Category", name: "Furniture", words: ["chair", "table", "sofa", "shelf", "bed", "desk", "lamp", "rug"] },
  { id: "cat_jobs", type: "Category", name: "Jobs", words: ["doctor", "teacher", "engineer", "chef", "pilot", "farmer", "nurse", "lawyer"] },
  { id: "cat_sports", type: "Category", name: "Sports", words: ["tennis", "swimming", "basketball", "boxing", "cycling", "running", "golf", "football"] },
  { id: "cat_kitchen", type: "Category", name: "Kitchen", words: ["knife", "spoon", "fork", "pan", "oven", "blender", "kettle", "whisk"] },
  { id: "cat_transport", type: "Category", name: "Transport", words: ["car", "bus", "train", "bicycle", "airplane", "ship", "subway", "taxi"] },

  { id: "syn_happy", type: "Synonym", name: "Happy", words: ["glad", "joyful", "cheerful", "pleased"] },
  { id: "syn_big", type: "Synonym", name: "Big", words: ["large", "huge", "giant", "enormous"] },
  { id: "syn_smart", type: "Synonym", name: "Smart", words: ["clever", "intelligent", "brilliant", "sharp"] },

  { id: "ant_temperature", type: "Antonym", name: "Temperature", words: ["hot", "cold", "warm", "cool", "freezing"] },
  { id: "ant_speed", type: "Antonym", name: "Speed", words: ["fast", "slow", "quick", "rapid"] },
  { id: "ant_difficulty", type: "Antonym", name: "Difficulty", words: ["easy", "hard", "simple", "tough", "tricky"] },
  { id: "ant_fullness", type: "Antonym", name: "Fullness", words: ["full", "empty", "packed", "bare", "crowded"] },
  { id: "ant_strength", type: "Antonym", name: "Strength", words: ["strong", "weak", "powerful", "feeble", "sturdy"] },
  { id: "ant_price", type: "Antonym", name: "Price", words: ["cheap", "expensive", "affordable", "pricey", "costly"] },
  { id: "ant_state", type: "Antonym", name: "State", words: ["open", "closed", "shut", "sealed"] },
  { id: "ant_moisture", type: "Antonym", name: "Moisture", words: ["wet", "dry", "moist", "soggy"] },

  { id: "func_actions", type: "Function", name: "Actions", words: ["heal", "teach", "cook", "fly", "harvest"] },
  { id: "func_security", type: "Function", name: "Security", words: ["key", "unlock", "lock", "password", "code"] },

  { id: "partof_car", type: "PartOf", name: "Car", words: ["wheel", "engine", "seat", "mirror", "door", "trunk"] },
  { id: "partof_house", type: "PartOf", name: "House", words: ["roof", "wall", "window", "floor", "ceiling", "chimney"] },
  { id: "partof_body", type: "PartOf", name: "Body", words: ["hand", "arm", "leg", "foot", "finger", "elbow"] },

  { id: "activity_beach", type: "Activity", name: "Beach", words: ["swim", "sunbathe", "surf", "snorkel"] },
  { id: "activity_morning", type: "Activity", name: "Morning", words: ["wake", "brush", "shower", "dress"] },

  { id: "context_restaurant", type: "Context", name: "Restaurant", words: ["menu", "waiter", "bill", "order", "tip"] },
  { id: "context_airport", type: "Context", name: "Airport", words: ["ticket", "gate", "luggage", "passport", "boarding", "flight"] },

  { id: "concept_time", type: "Concept", name: "Time", words: ["hour", "minute", "calendar", "schedule", "deadline", "moment"] },
  { id: "concept_money", type: "Concept", name: "Money", words: ["budget", "save", "spend", "invest", "debt", "coin"] },

  { id: "cat_animals", type: "Category", name: "Animals", words: ["dog", "cat", "lion", "elephant", "tiger", "monkey", "horse", "rabbit"] },
  { id: "cat_birds", type: "Category", name: "Birds", words: ["eagle", "owl", "parrot", "penguin", "duck", "swan"] },
  { id: "cat_ocean", type: "Category", name: "Ocean", words: ["shark", "whale", "dolphin", "octopus", "jellyfish", "seal", "crab"] },
  { id: "cat_insects", type: "Category", name: "Insects", words: ["ant", "bee", "butterfly", "spider", "mosquito", "beetle"] },
  { id: "cat_reptiles", type: "Category", name: "Reptiles", words: ["snake", "lizard", "turtle", "crocodile", "frog"] },
  { id: "cat_farm", type: "Category", name: "Farm", words: ["cow", "pig", "sheep", "goat", "chicken", "rooster", "donkey"] },
  { id: "cat_colors", type: "Category", name: "Colors", words: ["red", "blue", "green", "yellow", "purple", "black", "white", "pink"] },
  { id: "cat_shapes", type: "Category", name: "Shapes", words: ["circle", "square", "triangle", "rectangle", "oval", "star", "diamond"] },
  { id: "cat_vegetables", type: "Category", name: "Vegetables", words: ["carrot", "potato", "onion", "tomato", "cucumber", "broccoli", "garlic", "corn"] },
  { id: "cat_desserts", type: "Category", name: "Desserts", words: ["cake", "cookie", "chocolate", "pie", "pudding", "doughnut", "candy"] },
  { id: "cat_drinks", type: "Category", name: "Drinks", words: ["water", "juice", "coffee", "tea", "milk", "soda", "lemonade"] },
  { id: "cat_clothing", type: "Category", name: "Clothing", words: ["shirt", "pants", "jacket", "shoes", "hat", "socks", "scarf", "gloves"] },
  { id: "cat_tools", type: "Category", name: "Tools", words: ["hammer", "wrench", "saw", "drill", "nail"] },
  { id: "cat_electronics", type: "Category", name: "Electronics", words: ["phone", "computer", "television", "camera", "tablet", "speaker", "router"] },
  { id: "cat_subjects", type: "Category", name: "Subjects", words: ["math", "science", "history", "geography", "art", "biology"] },
  { id: "cat_stationery", type: "Category", name: "Stationery", words: ["pen", "pencil", "eraser", "ruler", "notebook", "scissors", "glue"] },
  { id: "cat_instruments", type: "Category", name: "Instruments", words: ["guitar", "piano", "violin", "drum", "flute", "trumpet"] },
  { id: "cat_appliances", type: "Category", name: "Appliances", words: ["fridge", "microwave", "toaster", "washer", "dryer", "vacuum"] },
  { id: "cat_metals", type: "Category", name: "Metals", words: ["gold", "silver", "copper", "aluminum", "steel", "bronze"] },
  { id: "cat_gems", type: "Category", name: "Gems", words: ["ruby", "emerald", "sapphire", "pearl", "opal"] },
  { id: "cat_flowers", type: "Category", name: "Flowers", words: ["rose", "tulip", "sunflower", "lily", "orchid"] },
  { id: "cat_trees", type: "Category", name: "Trees", words: ["oak", "pine", "palm", "sakura"] },
  { id: "cat_genres", type: "Category", name: "Genres", words: ["rock", "jazz", "classical", "pop"] },
  { id: "cat_family", type: "Category", name: "Family", words: ["mother", "father", "sister", "brother", "grandmother", "grandfather", "aunt", "uncle"] },
  { id: "cat_planets", type: "Category", name: "Planets", words: ["mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune"] },
  { id: "cat_continents", type: "Category", name: "Continents", words: ["asia", "africa", "europe", "antarctica"] },
  { id: "cat_seasons", type: "Category", name: "Seasons", words: ["spring", "summer", "autumn", "winter"] },
  { id: "cat_medical", type: "Category", name: "Medical", words: ["surgeon", "dentist", "pharmacist", "therapist", "paramedic"] },
  { id: "cat_bakery", type: "Category", name: "Bakery", words: ["bread", "bagel", "croissant", "muffin", "pretzel", "biscuit"] },
  { id: "cat_seafood", type: "Category", name: "Seafood", words: ["shrimp", "lobster", "salmon", "tuna", "oyster"] },
  { id: "cat_dairy", type: "Category", name: "Dairy", words: ["cheese", "yogurt", "butter", "cream"] },
  { id: "cat_spices", type: "Category", name: "Spices", words: ["salt", "cinnamon", "ginger", "basil", "oregano", "nutmeg"] },
  { id: "cat_disasters", type: "Category", name: "Disasters", words: ["hurricane", "tornado", "earthquake", "flood"] },
  { id: "cat_organs", type: "Category", name: "Organs", words: ["heart", "brain", "lung", "liver", "kidney", "stomach"] },
  { id: "cat_computer", type: "Category", name: "Computer", words: ["keyboard", "mouse", "monitor", "printer"] },
  { id: "cat_bathroom", type: "Category", name: "Bathroom", words: ["towel", "soap", "shampoo", "toothbrush", "toothpaste", "razor"] },
  { id: "cat_baby", type: "Category", name: "Baby", words: ["diaper", "stroller", "bottle", "pacifier"] },
  { id: "cat_camping", type: "Category", name: "Camping", words: ["tent", "backpack", "compass", "flashlight"] },
  { id: "cat_tech", type: "Category", name: "Tech", words: ["programmer", "designer", "analyst", "developer", "technician"] },
  { id: "cat_currency", type: "Category", name: "Currency", words: ["dollar", "euro", "pound", "yen", "peso"] },
  { id: "cat_games", type: "Category", name: "Games", words: ["chess", "puzzle", "dominoes", "dice"] },
  { id: "cat_materials", type: "Category", name: "Materials", words: ["wood", "plastic", "glass", "fabric", "leather"] },
  { id: "cat_vehicles", type: "Category", name: "Vehicles", words: ["motorcycle", "truck", "van", "tractor"] },

  { id: "syn_scared", type: "Synonym", name: "Scared", words: ["afraid", "frightened", "terrified", "fearful"] },
  { id: "syn_beautiful", type: "Synonym", name: "Beautiful", words: ["pretty", "lovely", "gorgeous", "attractive"] },
  { id: "syn_tired", type: "Synonym", name: "Tired", words: ["exhausted", "sleepy", "weary", "drowsy"] },
  { id: "syn_funny", type: "Synonym", name: "Funny", words: ["hilarious", "amusing", "comical", "witty"] },
  { id: "syn_important", type: "Synonym", name: "Important", words: ["essential", "crucial", "vital", "significant"] },
  { id: "syn_furious", type: "Synonym", name: "Furious", words: ["irritated", "annoyed", "outraged", "livid"] },
  { id: "syn_calm", type: "Synonym", name: "Calm", words: ["peaceful", "relaxed", "tranquil", "serene"] },
  { id: "syn_old", type: "Synonym", name: "Old", words: ["ancient", "elderly", "aged", "antique"] },
  { id: "syn_modern", type: "Synonym", name: "Modern", words: ["recent", "current", "updated"] },
  { id: "syn_wealthy", type: "Synonym", name: "Wealthy", words: ["rich", "affluent", "prosperous"] },
  { id: "syn_poor", type: "Synonym", name: "Poor", words: ["broke", "needy", "indigent", "moneyless"] },
  { id: "syn_brave", type: "Synonym", name: "Brave", words: ["courageous", "fearless", "bold", "heroic"] },
  { id: "syn_lazy", type: "Synonym", name: "Lazy", words: ["idle", "sluggish", "inactive"] },
  { id: "syn_delicious", type: "Synonym", name: "Delicious", words: ["tasty", "yummy", "scrumptious", "savory"] },
  { id: "syn_messy", type: "Synonym", name: "Messy", words: ["untidy", "filthy", "chaotic", "cluttered"] },
  { id: "syn_tidy", type: "Synonym", name: "Tidy", words: ["spotless", "neat", "organized", "stylish"] },
  { id: "syn_noisy", type: "Synonym", name: "Noisy", words: ["loud", "deafening", "booming", "blaring"] },
  { id: "syn_thin", type: "Synonym", name: "Thin", words: ["skinny", "slim", "slender", "lean"] },
  { id: "syn_heavy", type: "Synonym", name: "Heavy", words: ["weighty", "hefty", "bulky"] },
  { id: "syn_famous", type: "Synonym", name: "Famous", words: ["renowned", "celebrated", "legendary", "notable"] },

  { id: "ant_brightness", type: "Antonym", name: "Brightness", words: ["bright", "dark", "dim", "shadowy"] },
  { id: "ant_cleanliness", type: "Antonym", name: "Cleanliness", words: ["clean", "dirty", "sanitary", "grimy"] },
  { id: "ant_politeness", type: "Antonym", name: "Politeness", words: ["polite", "rude", "courteous", "impolite"] },
  { id: "ant_honesty", type: "Antonym", name: "Honesty", words: ["honest", "dishonest", "truthful", "deceitful"] },
  { id: "ant_kindness", type: "Antonym", name: "Kindness", words: ["kind", "cruel", "gentle", "harsh"] },
  { id: "ant_height", type: "Antonym", name: "Height", words: ["tall", "short", "towering", "petite"] },
  { id: "ant_width", type: "Antonym", name: "Width", words: ["wide", "narrow", "broad", "thin"] },
  { id: "ant_age", type: "Antonym", name: "Age", words: ["young", "old", "youthful", "mature"] },
  { id: "ant_safety", type: "Antonym", name: "Safety", words: ["safe", "dangerous", "risky", "secure"] },
  { id: "ant_success", type: "Antonym", name: "Success", words: ["successful", "victorious", "defeated", "failure"] },
  { id: "ant_freedom", type: "Antonym", name: "Freedom", words: ["free", "trapped", "captive", "liberated"] },
  { id: "ant_visibility", type: "Antonym", name: "Visibility", words: ["visible", "invisible", "hidden", "clear"] },

  { id: "func_social", type: "Function", name: "Social", words: ["post", "comment", "like", "share", "follow"] },
  { id: "func_communication", type: "Function", name: "Communication", words: ["call", "text", "email", "chat", "message"] },
  { id: "func_cleaning", type: "Function", name: "Cleaning", words: ["wash", "sweep", "mop", "dust", "scrub"] },
  { id: "func_building", type: "Function", name: "Building", words: ["build", "design", "construct", "repair", "demolish"] },
  { id: "func_shopping", type: "Function", name: "Shopping", words: ["buy", "sell", "trade", "exchange"] },
  { id: "func_learning", type: "Function", name: "Learning", words: ["study", "memorize", "practice", "research", "review"] },

  { id: "partof_plant", type: "PartOf", name: "Plant", words: ["root", "stem", "leaf", "seed", "branch"] },
  { id: "partof_book", type: "PartOf", name: "Book", words: ["cover", "page", "chapter", "title", "author"] },
  { id: "partof_face", type: "PartOf", name: "Face", words: ["eye", "nose", "mouth", "ear", "cheek", "chin"] },

  { id: "activity_evening", type: "Activity", name: "Evening", words: ["relax", "dine", "unwind", "socialize"] },
  { id: "activity_weekend", type: "Activity", name: "Weekend", words: ["picnic", "hike", "camp", "barbecue"] },
  { id: "activity_party", type: "Activity", name: "Party", words: ["celebrate", "dance", "sing", "decorate"] },
  { id: "activity_winter", type: "Activity", name: "Winter", words: ["ski", "skate", "sled", "shovel"] },
  { id: "activity_school", type: "Activity", name: "School", words: ["read", "write", "listen", "discuss", "class"] },
  { id: "activity_exercise", type: "Activity", name: "Exercise", words: ["jog", "stretch", "lift", "squat"] },

  { id: "context_wedding", type: "Context", name: "Wedding", words: ["bride", "groom", "ring", "bouquet", "honeymoon"] },
  { id: "context_hospital", type: "Context", name: "Hospital", words: ["patient", "surgery", "injection", "bandage", "prescription"] },
  { id: "context_gym", type: "Context", name: "Gym", words: ["treadmill", "dumbbell", "workout", "trainer", "membership"] },
  { id: "context_library", type: "Context", name: "Library", words: ["librarian", "bookshelf", "borrow", "silence"] },
  { id: "context_bank", type: "Context", name: "Bank", words: ["deposit", "withdraw", "account", "loan", "transfer"] },
  { id: "context_cinema", type: "Context", name: "Cinema", words: ["popcorn", "theater", "screen", "trailer", "audience"] },

  { id: "concept_health", type: "Concept", name: "Health", words: ["fitness", "nutrition", "wellness", "hygiene"] },
  { id: "concept_environment", type: "Concept", name: "Environment", words: ["pollution", "recycling", "conservation", "sustainability"] },
  { id: "concept_education", type: "Concept", name: "Education", words: ["knowledge", "curriculum", "literacy", "graduation"] },
  { id: "concept_technology", type: "Concept", name: "Technology", words: ["software", "hardware", "network", "data"] },
  { id: "concept_culture", type: "Concept", name: "Culture", words: ["tradition", "custom", "heritage", "festival"] },
  { id: "concept_justice", type: "Concept", name: "Justice", words: ["law", "crime", "punishment", "verdict"] },
];

const RELATIONS_BY_ID = Object.fromEntries(RELATIONS.map((r) => [r.id, r]));
