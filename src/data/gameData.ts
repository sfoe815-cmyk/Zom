import { Weapon, Survivor, CraftingRecipe, WeaponId } from '../types/game';

export const INITIAL_WEAPONS: Record<WeaponId, Weapon> = {
  nail_gun: {
    id: 'nail_gun',
    name: 'Twin Nail Gun',
    nameAr: 'مسدس المسامير (مسدس البسامير)',
    category: 'pistol',
    damage: 22, // 22 damage per nail = 44 total twin impact (balanced power)
    fireRate: 380, // Balanced semi-automatic cycling rate (neither machine gun nor sluggish)
    clipSize: 20,
    reloadTime: 1.5,
    spread: 0.04,
    pellets: 2, // Fires 2 nails per trigger pull
    range: 850,
    unlocked: true, // Player starts with this on Night 1!
    ammoType: 'nails',
    isAutomatic: false,
    description: 'Hardware pneumatic nail gun modified for survival. Fires two heavy steel nails per pull with balanced recoil and steady cadence.',
    descriptionAr: 'مسدس مسامير هوائي متوازن القوة والسرعة، يطلق مسمارين فولاذيين متوازيين مع كل ضغطة زناد للدفاع عن السوبرماركت في الليلة الأولى.'
  },
  mp40: {
    id: 'mp40',
    name: 'MP40 Submachine Gun',
    nameAr: 'رشاش MP40',
    category: 'smg',
    damage: 24,
    fireRate: 140, // Fast fire rate slightly below average (~430 RPM)
    clipSize: 30, // 30-round magazine
    reloadTime: 1.8,
    spread: 0.07,
    pellets: 1,
    range: 850,
    unlocked: false,
    ammoType: 'smg', // SMG ammo
    isAutomatic: true,
    description: 'Classic durable submachine gun. Delivers controlled, rapid automatic bursts using 30-round SMG box magazines.',
    descriptionAr: 'رشاش أوتوماتيكي بمخزن يتسع لـ 30 طلقة، ومعدل إطلاق سريع متزن ومحكوم بذخيرة SMG.'
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
  }
};

export const INITIAL_SURVIVORS: Survivor[] = [
  {
    id: 'omar',
    name: 'Baraq - Security Guard',
    nameAr: 'براق رجل الأمن',
    role: 'Security Guard',
    roleAr: 'حارس أمن السوبرماركت',
    bioAr: 'كان في نوبة الحراسة الليلية عند بدء تفشي الوباء. قناص ماهر يعرف كل زوايا المتجر ويحمل الشوزن الدفاعي.',
    bioEn: 'Store security guard with razor-sharp aim. Carries a shotgun and executes instant headshots.',
    health: 100,
    maxHealth: 100,
    hunger: 70,
    thirst: 65,
    isRecruited: false,
    isDead: false,
    weaponId: 'shotgun',
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
    bioAr: 'اختبأت داخل صيدلية المتجر ومعها مواد كيميائية حارقة وإمدادات طبية. تحمل رشاش MP40 وتطلق سهاماً كيميائية حارقة وتزيد فرص العثور على بطاريات.',
    bioEn: 'Supermarket pharmacist armed with MP40 SMG and chemical incendiary arrows. Doubles battery scavenge chances.',
    health: 90,
    maxHealth: 90,
    hunger: 60,
    thirst: 50,
    isRecruited: false,
    isDead: false,
    weaponId: 'mp40',
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
    id: 'craft_nails',
    name: 'Craft Steel Nails (60 nails)',
    nameAr: 'تصنيع مسامير فولاذية (60 مسمار)',
    category: 'ammo',
    cost: { scrapMetal: 1 },
    outputCount: 60,
    description: 'Forges supermarket scrap wire and metal into 60 sharp nails for the Twin Nail Gun.',
    descriptionAr: 'يعيد تدوير الخردة والأسلاك لصناعة 60 مسماراً فولاذياً لمسدس المسامير.',
    craftEffect: (state) => {
      state.ammoStock.nails += 60;
    }
  },
  {
    id: 'craft_smg',
    name: 'Craft SMG Ammunition (60 rounds)',
    nameAr: 'تصنيع ذخيرة SMG لرشاش MP40 (60 طلقة)',
    category: 'ammo',
    cost: { scrapMetal: 1, chemicals: 1 },
    outputCount: 60,
    description: 'Molds scrap lead and gunpowder into 60 rounds of SMG ammunition for the MP40.',
    descriptionAr: 'يعيد تدوير الخردة والبارود لصناعة 60 طلقة ذخيرة SMG لرشاش MP40.',
    craftEffect: (state) => {
      state.ammoStock.smg += 60;
    }
  },
  {
    id: 'craft_shells',
    name: 'Handload Shotgun Shells (60 shells)',
    nameAr: 'تصنيع خراطيش الشوزن (60 خرطوشة)',
    category: 'ammo',
    cost: { scrapMetal: 1, chemicals: 1 },
    outputCount: 60,
    description: 'Loads empty plastic shells with metal ball bearings. Yields 60 shotgun shells.',
    descriptionAr: 'يملأ أظرف البنادق بالكرات الفولاذية والبارود للحصول على 60 طلقة شوزن.',
    craftEffect: (state) => {
      state.ammoStock.shell += 60;
    }
  },
  {
    id: 'craft_rifle',
    name: 'Machined Rifle Cartridges (60 rounds)',
    nameAr: 'تصنيع ذخيرة رشاش PKC (60 طلقة)',
    category: 'ammo',
    cost: { scrapMetal: 2, chemicals: 2 },
    outputCount: 60,
    description: 'High-caliber linked ammunition compatible with the PKC Heavy Machine Gun.',
    descriptionAr: 'ذخيرة دقيقة عالية القوة لرشاش PKC الثقيل (60 طلقة).',
    craftEffect: (state) => {
      state.ammoStock.rifle += 60;
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
