import { Weapon, Survivor, CraftingRecipe, WeaponId } from '../types/game';

export const INITIAL_WEAPONS: Record<WeaponId, Weapon> = {
  glock: {
    id: 'glock',
    name: 'Glock 19 (9mm)',
    nameAr: 'مسدس جلوك 19 (9 ملم)',
    category: 'pistol',
    damage: 26,
    fireRate: 360,
    clipSize: 15,
    reloadTime: 1.4,
    spread: 0.04,
    pellets: 1,
    range: 900,
    unlocked: true,
    ammoType: '9mm',
    isAutomatic: false,
    description: 'Standard reliable semi-automatic sidearm found in store security desk. Deliberate, accurate shots.',
    descriptionAr: 'مسدس أمني نصف آلي دقيق وسريع التلقيم، يطلق طلقة واحدة مع كل نقرة للدفاع الموزون.'
  },
  revolver: {
    id: 'revolver',
    name: '.357 Security Magnum',
    nameAr: 'ماجنوم الحراسة .357',
    category: 'pistol',
    damage: 65,
    fireRate: 580,
    clipSize: 6,
    reloadTime: 2.1,
    spread: 0.02,
    pellets: 1,
    range: 1000,
    unlocked: false,
    ammoType: '357',
    isAutomatic: false,
    description: 'Heavy security revolver. Massive stopping power that stops running zombies dead in their tracks.',
    descriptionAr: 'مسدس ثقيل بقوة دفع مرعبة، يسقط الزومبي المندفع بطلقة واحدة في الصدر.'
  },
  shotgun: {
    id: 'shotgun',
    name: 'Remington 870 Pump Shotgun',
    nameAr: 'بندقية صيد بامب شوزن',
    category: 'shotgun',
    damage: 20, // per pellet
    fireRate: 920,
    clipSize: 7,
    reloadTime: 2.6,
    spread: 0.16,
    pellets: 5,
    range: 650,
    unlocked: false,
    ammoType: 'shell',
    isAutomatic: false,
    description: 'Manual pump-action shotgun. Fires 5 deadly buckshot pellets with a deliberate pump between each blast.',
    descriptionAr: 'بندقية صيد بضخ يدوي، تطلق 5 خراطيش رش فتاكة وتتطلب سحب المقبض بين كل طلقة.'
  },
  uzi: {
    id: 'uzi',
    name: 'Micro Uzi 9mm',
    nameAr: 'رشاش ميكرو عوزي',
    category: 'smg',
    damage: 20,
    fireRate: 110,
    clipSize: 32,
    reloadTime: 1.8,
    spread: 0.10,
    pellets: 1,
    range: 750,
    unlocked: false,
    ammoType: '9mm',
    isAutomatic: true,
    description: 'Fully automatic submachine gun. Blistering rate of fire when holding trigger.',
    descriptionAr: 'رشاش آلي بالكامل بمعدل إطلاق فائق السرعة، يحصد الركاضين عند الاستمرار بالضغط.'
  },
  m4: {
    id: 'm4',
    name: 'M4A1 Assault Rifle',
    nameAr: 'بندقية هجومية M4A1',
    category: 'rifle',
    damage: 38,
    fireRate: 145,
    clipSize: 45,
    reloadTime: 2.2,
    spread: 0.05,
    pellets: 1,
    range: 1100,
    unlocked: false,
    ammoType: 'rifle',
    isAutomatic: true,
    description: 'Military-grade fully automatic rifle. Sustained accurate fire with high penetration.',
    descriptionAr: 'بندقية هجومية عسكرية آلية بقوة نارية واختراق عالي، تحصد كل ما يقترب من السوبرماركت.'
  },
  hunting_rifle: {
    id: 'hunting_rifle',
    name: '.308 Scoped Hunting Rifle',
    nameAr: 'بندقية قنص وصيد .308',
    category: 'rifle',
    damage: 140,
    fireRate: 1150,
    clipSize: 5,
    reloadTime: 2.8,
    spread: 0.01,
    pellets: 1,
    range: 1400,
    unlocked: false,
    ammoType: 'rifle',
    isAutomatic: false,
    description: 'High-caliber bolt-action rifle. Pierces through multiple infected with instant headshot kills.',
    descriptionAr: 'بندقية قنص دقيقة بمقبض ميكانيكي، تصفي الزومبي الضخم بطلقة رأس حاسمة.'
  },
  knife: {
    id: 'knife',
    name: 'Tactical Survival Knife',
    nameAr: 'سكين بقاء تكتيكي',
    category: 'melee',
    damage: 35,
    fireRate: 450,
    clipSize: 1,
    reloadTime: 0.1,
    spread: 0.1,
    pellets: 1,
    range: 90,
    unlocked: true,
    ammoType: 'none',
    isAutomatic: false,
    description: 'Sharp store utility blade. Zero ammo required for desperate close encounters.',
    descriptionAr: 'سكين حاد لا يحتاج لأي ذخيرة للمواجهات القريبة الطارئة.'
  },
  spiked_bat: {
    id: 'spiked_bat',
    name: 'Spiked Baseball Bat',
    nameAr: 'مضرب بيسبول بمسامير',
    category: 'melee',
    damage: 48,
    fireRate: 550,
    clipSize: 1,
    reloadTime: 0.1,
    spread: 0.15,
    pellets: 1,
    range: 100,
    unlocked: false,
    ammoType: 'none',
    isAutomatic: false,
    description: 'Heavy sports club wrapped in supermarket barbed wire.',
    descriptionAr: 'مضرب رياضي ثقيل ملفوف بأسلاك شائكة ومسامير، يسحق الجماجم بضربة قوية.'
  },
  plasma_rifle: {
    id: 'plasma_rifle',
    name: 'Incendiary Plasma Cannon',
    nameAr: 'سلاح بلازما الحارق',
    category: 'rifle',
    damage: 2,
    fireRate: 60,
    clipSize: 120,
    reloadTime: 1.8,
    spread: 0.01,
    pellets: 1,
    range: 1100,
    unlocked: false,
    ammoType: 'energy',
    isAutomatic: true,
    description: 'Experimental directed-energy beam. Targets a single zombie with ramping damage from 2 to 6, vaporizing acid spits and burning targets.',
    descriptionAr: 'سلاح بلازما يطلق شعاعاً حارقاً على زومبي واحد بضرر يبدأ بـ 2 ويتصاعد كل ثانية حتى 6، ويدمر بصقات الحمض بالكامل!'
  },
  pkc: {
    id: 'pkc',
    name: 'PKC Heavy Machine Gun',
    nameAr: 'رشاش بي كي سي (PKC)',
    category: 'rifle',
    damage: 46,
    fireRate: 120,
    clipSize: 80,
    reloadTime: 90, // 1.5 minutes (90 seconds)
    spread: 0.08,
    pellets: 1,
    range: 1100,
    unlocked: false,
    ammoType: 'rifle',
    isAutomatic: true,
    description: 'Heavy squad automatic machine gun with an 80-round belt box. An allied survivor must spend 90 seconds (1.5 minutes) reloading it while you use your other weapon.',
    descriptionAr: 'رشاش آلي ثقيل بحزام 80 طلقة وقوة هائلة. يتوقف أحد الناجين لتلقيمه لمدة دقيقة ونصف (90 ثانية) بينما تواصل القتال بسلاحك الآخر.'
  }
};

export const INITIAL_SURVIVORS: Survivor[] = [
  {
    id: 'omar',
    name: 'Baraq - Security Guard',
    nameAr: 'براق رجل الأمن',
    role: 'Security Guard',
    roleAr: 'حارس أمن السوبرماركت',
    bioAr: 'كان في نوبة الحراسة الليلية عند بدء تفشي الوباء. قناص ماهر يعرف كل زوايا المتجر ويحمل مسدس الماجنوم.',
    bioEn: 'Store security guard with razor-sharp aim. Carries a magnum and executes instant headshots.',
    health: 100,
    maxHealth: 100,
    hunger: 70,
    thirst: 65,
    isRecruited: false,
    isDead: false,
    weaponId: 'revolver',
    perkAr: 'قناص الرؤوس الخماسي: يصيب 5 زومبي هيدشوت فوري كل 20 ثانية.',
    perkEn: 'Five-fold Headshot: Instantly snipes 5 zombies with lethal headshots every 20 seconds.',
    accuracy: 0.88,
    abilityId: 'baraq_snipe',
    abilityNameAr: 'قنص الرؤوس (براق)',
    abilityDescAr: 'يصيب 5 زومبي إصابات رأس قاتلة فوراً (تتجدد كل 20 ثانية)'
  },
  {
    id: 'layla',
    name: 'Shahd - Pharmacist',
    nameAr: 'شهد الصيدلانية',
    role: 'Pharmacist',
    roleAr: 'صيدلانية السوبرماركت',
    bioAr: 'اختبأت داخل صيدلية المتجر ومعها مواد كيميائية حارقة وإمدادات طبية. تطلق سهاماً كيميائية حارقة وتزيد فرص العثور على بطاريات.',
    bioEn: 'Supermarket pharmacist armed with chemical incendiary arrows and battlefield first aid. Doubles battery scavenge chances.',
    health: 90,
    maxHealth: 90,
    hunger: 60,
    thirst: 50,
    isRecruited: false,
    isDead: false,
    weaponId: 'uzi',
    perkAr: 'السهم الناري الحارق ومضاعفة البطاريات: تحرق كل الزومبي 5 ثوانٍ، وتضاعف فرصة استخراج بطاريات البلازما.',
    perkEn: 'Incendiary Arrow & Battery Bonus: Ignites zombies for 5s and gives chance for 2 batteries during scavenging.',
    accuracy: 0.78,
    abilityId: 'shahd_fire_arrow',
    abilityNameAr: 'السهم الناري (شهد)',
    abilityDescAr: 'يحرق كل زومبي في الشاشة لمدة 5 ثوانٍ مستمرة (تتجدد كل 20 ثانية)'
  }
];

export const CRAFTING_RECIPES: CraftingRecipe[] = [
  {
    id: 'first_aid_kit',
    name: 'Advanced First Aid Kit',
    nameAr: 'حقيبة إسعافات متطورة',
    category: 'medical',
    cost: { medkit: 1, alcohol: 1, cloth: 1 },
    outputCount: 1,
    description: 'A sterile medical kit that heals 55 HP to the player or a wounded survivor.',
    descriptionAr: 'حقيبة معقمة بالكامل تستعيد 55 نقطة صحة للاعب أو لأحد الناجين الجرحى.',
    craftEffect: (state) => {
      state.inventoryItems.firstAidKits = (state.inventoryItems.firstAidKits || 0) + 1;
    }
  },
  {
    id: 'energy_ration',
    name: 'Survival Ration Pack',
    nameAr: 'وجبة صمود مقواة',
    category: 'medical',
    cost: { food: 2, water: 1 },
    outputCount: 1,
    description: 'Nutritious meal pack that completely eliminates hunger and thirst for one defender.',
    descriptionAr: 'وجبة غذائية مشبعة تملأ مؤشر الجوع والعطش بالكامل لمدافع واحد.',
    craftEffect: (state) => {
      state.inventoryItems.rations = (state.inventoryItems.rations || 0) + 1;
    }
  },
  {
    id: 'molotov',
    name: 'Molotov Cocktail (Fire Bottle)',
    nameAr: 'زجاجة مولوتوف حارقة',
    category: 'weapon',
    cost: { alcohol: 1, cloth: 1 },
    outputCount: 2,
    description: 'Improvised firebomb. Press [G] during night combat to ignite a fire wall in the aisles.',
    descriptionAr: 'قنبلة حارقة مرتجلة. اضغط [G] أثناء الدفاع الليلي لإشعال جدار ناري يحرق الزومبي.',
    craftEffect: (state) => {
      state.inventoryItems.molotovs = (state.inventoryItems.molotovs || 0) + 2;
    }
  },
  {
    id: 'pipe_bomb',
    name: 'Supermarket Shrapnel Bomb',
    nameAr: 'قنبلة أنابيب وشظايا مسمارية',
    category: 'weapon',
    cost: { scrapMetal: 2, chemicals: 1, battery: 1 },
    outputCount: 2,
    description: 'High-yield pipe bomb packed with store nails. Press [T] to cause massive area devastation.',
    descriptionAr: 'عبوة ناسفة محشوة بالمسامير والخردة. اضغط [T] لإبادة حشود الزومبي فوراً.',
    craftEffect: (state) => {
      state.inventoryItems.pipeBombs = (state.inventoryItems.pipeBombs || 0) + 2;
    }
  },
  {
    id: 'landmine',
    name: 'Spike Landmine (Proximity)',
    nameAr: 'لغم أرضي شظوي متفجر',
    category: 'weapon',
    cost: { scrapMetal: 2, chemicals: 1, battery: 1 },
    outputCount: 2,
    description: 'Proximity defensive mine. Press [F] to plant on store floor. Detonates when zombies step near.',
    descriptionAr: 'لغم أرضي دفاعي متفجر. اضغط [F] لزرعه في ممرات السوبرماركت لينفجر فور اقتراب الزومبي.',
    craftEffect: (state) => {
      state.inventoryItems.landmines = (state.inventoryItems.landmines || 0) + 2;
    }
  },
  {
    id: 'floor_trap',
    name: 'Mechanical Steel Trap',
    nameAr: 'فخ أرضي حديدي مسنن',
    category: 'weapon',
    cost: { scrapMetal: 2, cloth: 1 },
    outputCount: 2,
    description: 'Sharp store bear trap. Snaps shut on zombie legs, dealing heavy damage and stopping them.',
    descriptionAr: 'فخ فكي مسنن يثبت في الأرض، يقبض على أرجل الزومبي ويفتك بهم فور مرورهم عليه.',
    craftEffect: (state) => {
      state.inventoryItems.traps = (state.inventoryItems.traps || 0) + 2;
    }
  },
  {
    id: 'spiked_bat_craft',
    name: 'Reinforced Spiked Bat',
    nameAr: 'صناعة مضرب مسماري مسنن',
    category: 'weapon',
    cost: { scrapMetal: 2, cloth: 1 },
    outputCount: 1,
    description: 'Crafts the Barbed Spiked Bat melee weapon for high-damage defense without ammo.',
    descriptionAr: 'يصنع مضرب البيسبول المسنن بالمسامير للاشتباك القريب القوي دون حاجة للذخيرة.',
    craftEffect: (state) => {
      if (state.weapons.spiked_bat) {
        state.weapons.spiked_bat.unlocked = true;
      }
    }
  },
  {
    id: 'barbed_wire',
    name: 'Barbed Wire Cart Barrier',
    nameAr: 'تثبيت أسلاك شائكة لعربات التسوق',
    category: 'barricade',
    cost: { scrapMetal: 3, cloth: 1 },
    outputCount: 1,
    description: 'Wraps razor wire around the shopping carts. +100 Max Barricade HP and deals damage to attacking zombies.',
    descriptionAr: 'يلف أسلاكاً شائكة حادة حول عربات التسوق: +100 صحة قصوى للمتراس ويلحق ضرراً بالزومبي المهاجم.',
    craftEffect: (state) => {
      state.barricade.hasBarbedWire = true;
      state.barricade.maxHp += 100;
      state.barricade.hp += 100;
    }
  },
  {
    id: 'electric_grid',
    name: 'Electrified Cart System',
    nameAr: 'صدمات كهربائية لعربات التسوق',
    category: 'barricade',
    cost: { scrapMetal: 2, battery: 2 },
    outputCount: 1,
    description: 'Connects store car batteries to the metal carts. Periodically shocks and stuns zombies touching the carts.',
    descriptionAr: 'يوصل بطاريات المتجر بهيكل العربات المعدنية، لصعق وشل حركة الزومبي الملتصق بالمتراس.',
    craftEffect: (state) => {
      state.barricade.hasElectricGrid = true;
    }
  },
  {
    id: 'craft_9mm',
    name: 'Repack 9mm Ammo Box (30 rounds)',
    nameAr: 'تصنيع علبة ذخيرة 9 ملم (30 طلقة)',
    category: 'ammo',
    cost: { scrapMetal: 1, chemicals: 1 },
    outputCount: 30,
    description: 'Molds scrap lead and powder into 30 rounds of 9mm ammunition.',
    descriptionAr: 'يعيد تدوير الخردة والبارود لصناعة 30 طلقة لمسدس الجلوك والرشاش.',
    craftEffect: (state) => {
      state.ammoStock['9mm'] += 30;
    }
  },
  {
    id: 'craft_shells',
    name: 'Handload Shotgun Shells (10 shells)',
    nameAr: 'حشو خراطيش الشوزن (10 خراطيش)',
    category: 'ammo',
    cost: { scrapMetal: 1, chemicals: 1 },
    outputCount: 10,
    description: 'Loads empty plastic shells with metal ball bearings. Yields 10 shotgun shells.',
    descriptionAr: 'يملأ أظرف البنادق بالكرات الفولاذية والبارود للحصول على 10 طلقات شوزن.',
    craftEffect: (state) => {
      state.ammoStock['shell'] += 10;
    }
  },
  {
    id: 'craft_rifle',
    name: 'Machined Rifle Cartridges (25 rounds)',
    nameAr: 'تلقيم ذخيرة بنادق (25 طلقة)',
    category: 'ammo',
    cost: { scrapMetal: 2, chemicals: 2 },
    outputCount: 25,
    description: 'Precise rifle ammunition compatible with M4A1 and Hunting Rifle.',
    descriptionAr: 'ذخيرة دقيقة عالية الضغط لبندقية M4 وقناصة الصيد.',
    craftEffect: (state) => {
      state.ammoStock['rifle'] += 25;
    }
  }
];

export const SUPERMARKET_AISLES = [
  {
    id: 'grocery',
    name: 'Aisle 1 & 2: Food & Drinks',
    nameAr: 'الرواق 1 و 2: الأغذية والمشروبات',
    descEn: 'Packed with canned soup, beans, tuna, and bottled mineral water.',
    descAr: 'رفوف المعلبات، التونة، العصائر، وقوارير المياه الصالحة للشرب.',
    icon: '🥫',
    lootFocus: 'High Food & Water'
  },
  {
    id: 'pharmacy',
    name: 'Aisle 3: Pharmacy & Health',
    nameAr: 'الرواق 3: الصيدلية والعناية الطبية',
    descEn: 'Medicine shelves, rubbing alcohol, sterile bandages, and antiseptics.',
    descAr: 'أدراج الأدوية، الكحول المطهر، الشاش الطبي، والمضادات الحيوية.',
    icon: '💊',
    lootFocus: 'High Medical, Alcohol & Cloth'
  },
  {
    id: 'hardware',
    name: 'Aisle 4: Hardware & Electronics',
    nameAr: 'الرواق 4: الخردوات والإلكترونيات',
    descEn: 'Wire coils, heavy nails, power tool batteries, and duct tape.',
    descAr: 'لفائف الأسلاك، المسامير، بطاريات المعدات، وأدوات الصيانة.',
    icon: '🔧',
    lootFocus: 'High Scrap Metal, Wire & Batteries'
  },
  {
    id: 'warehouse',
    name: 'Back Area: Loading Bay & Security',
    nameAr: 'المنطقة الخلفية: المستودع وغرفة الأمن',
    descEn: 'Chemical cleaning barrels, security lockboxes, and weapon caches.',
    descAr: 'براميل المنظفات والبارود، خزائن الحراسة، ومخابئ الأسلحة.',
    icon: '📦',
    lootFocus: 'Weapons, Ammo & Chemicals'
  }
];
