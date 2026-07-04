addLayer("m", {
        name: "Mining", // This displays on the node
        symbol: "M", // The letter shown on the tree node
        position: 0, // Horizontal position on the screen
        startData() { return {
            unlocked: true,
    points: new Decimal(0), // Displays as "Mining Points" or Ores depending on your display
        }},
        color: "#7B3F00", // Earthy brown color for mining
        requires: new Decimal(10), // Cost to get the very first mining point
        resource: "Mining Power", // Name of prestige currency
        baseResource: "points", // What resource it costs to reset
        baseAmount() { return player.points }, // How to get the player's current base resource
        type: "normal", // "normal" or "static"
        exponent: 0.5, // Prestige formula exponent
        gainMult() { // Multipliers to resource gain
            let mult = new Decimal(1)
            return mult
        },
        gainExp() { // Exponent to resource gain
            return new Decimal(1)
        },
        row: 0, // First row of the tree
        layerShown() { return true },

        // Automatically generates your base ores every tick based on Mining Power
        update(diff) {
            if (player.m.unlocked) {
                let speed = player.m.points; // More mining power = faster resource gathering
                player.copperOre = player.copperOre.add(speed.mul(diff).mul(1));
                player.ironOre = player.ironOre.add(speed.mul(diff).mul(0.5));
                player.coal = player.coal.add(speed.mul(diff).mul(0.25));
            }
        },

        tabFormat: {
            "Main Tab": {
                content: [


                    "main-display",
                    "prestige-button",
                    "blank",

                    ["display-text", function() {
                        return "You have <h2 style='color:#b87333'>" + format(player.copperOre) + "</h2> Copper Ore (+1/sec per Mining Power)<br>" +
                               "You have <h2 style='color:#aaa9ad'>" + format(player.ironOre) + "</h2> Iron Ore (+0.5/sec per Mining Power)<br>" +
                               "You have <h2 style='color:#2a2a2a'>" + format(player.coal) + "</h2> Coal (+0.25/sec per Mining Power)"
                    }],
                    "blank",
                    "upgrades"
                ]
            }
        },

        upgrades: {
            11: {
                title: "Sharper Pickaxes",
                description: "Double your base Point generation in mod.js.",
                cost: new Decimal(5),
            },
        }
    })

    addLayer("r", {
        name: "Refining",
        symbol: "R",
        position: 0,


        startData() { return {
            unlocked: false,
    points: new Decimal(0),
        }},

        color: "#aaaaaa", // Silver color for refined metals
        requires: new Decimal(100),
        resource: "Refinery Workers",
        baseResource: "ironOre", // This layer resets your Iron Ore!
        baseAmount() { return player.ironOre },
        type: "normal",
        exponent: 0.5,


        gainMult() { return new Decimal(1) },
        gainExp() { return new Decimal(1) },

        row: 1, // Second row of the tree (appears below row 0)
        layerShown() { return player.m.points.gte(1) || player.r.unlocked },

        update(diff) {
            if (player.r.unlocked) {
                // Uses Coal and Iron Ore to smelt Iron Bars automatically
                let craftRate = player.r.points.mul(diff).mul(1);
                if (player.ironOre.gte(craftRate) && player.coal.gte(craftRate)) {
                    player.ironOre = player.ironOre.sub(craftRate);
                    player.coal = player.coal.sub(craftRate);
                    player.ironBar = player.ironBar.add(craftRate);
                }
            }
        },

        tabFormat: {
            "Smelting": {
                content: [


                    "main-display",
                    "prestige-button",
                    "blank",

                    ["display-text", function() {
                        return "You have <h2 style='color:#d4af37'>" + format(player.ironBar) + "</h2> Iron Bars.<br>" +
                               "Refinery workers consume 1 Iron Ore and 1 Coal per second to make 1 Iron Bar."
                    }],
                ]
            }
        }
    })


    // ============================================================================
    // LAYER 1: MINING (m) - ROW 0
    // ============================================================================


    addLayer("m", {
        name: "Mining",
        symbol: "M",
        position: 0,
        startData() { return {
            unlocked: true,
            points: new Decimal(0),
        }},

        color: "#7B3F00",
        requires: new Decimal(10),
        resource: "Mining Power",
        baseResource: "points",
        baseAmount() { return player.points },


        type: "normal",
        exponent: 0.5,
        gainMult() {

            let mult = new Decimal(1);
            if (hasUpgrade('m', 12)) mult = mult.mul(2);
            if (hasUpgrade('r', 11)) mult = mult.mul(player.r.points.add(1));
            return mult;


        },
        gainExp() { return new Decimal(1) },

        row: 0,
        layerShown() { return true },



        update(diff) {
            if (player.m.unlocked) {
                let speed = player.m.points;

                let mult = new Decimal(1);
                if (hasUpgrade('m', 13)) mult = mult.mul(1.5);
                if (hasUpgrade('m', 14)) mult = mult.mul(player.points.add(1).log10().add(1));
               
                player.copperOre = player.copperOre.add(speed.mul(diff).mul(1).mul(mult));
                player.ironOre = player.ironOre.add(speed.mul(diff).mul(0.5).mul(mult));
                player.coal = player.coal.add(speed.mul(diff).mul(0.25).mul(mult));
            }
        },

        tabFormat: {
            "Extraction": {


                content: [
                    "main-display", "prestige-button", "blank",
                    ["display-text", function() {

                        return "You have <h3 style='color:#b87333'>" + format(player.copperOre) + "</h3> Copper Ore<br>" +
                               "You have <h3 style='color:#aaa9ad'>" + format(player.ironOre) + "</h3> Iron Ore<br>" +
                               "You have <h3 style='color:#2a2a2a'>" + format(player.coal) + "</h3> Coal"


                    }],
                    "blank", "upgrades"
                ]
            }
        },

        upgrades: {

            11: { title: "Sharper Pickaxes", description: "Double point generation.", cost: new Decimal(5) },
            12: { title: "Heavy Machinery", description: "Double Mining Power gain.", cost: new Decimal(15) },
            13: { title: "Deeper Shafts", description: "Increase ore gathering speed by 50%.", cost: new Decimal(50) },
            14: { title: "Synergy Drive", description: "Points boost resource gathering speed.", cost: new Decimal(150) },
        }
    })

    // ============================================================================
    // LAYER 2: REFINING (r) - ROW 1
    // ============================================================================


    addLayer("r", {
        name: "Refining",
        symbol: "R",
        position: 0,
        startData() { return {
            unlocked: false,
            points: new Decimal(0),
        }},
        color: "#aaaaaa",
        requires: new Decimal(100),
        resource: "Refinery Workers",
        baseResource: "ironOre",
        baseAmount() { return player.ironOre },
        type: "normal",
        exponent: 0.5,
        gainMult() { return new Decimal(1) },
        gainExp() { return new Decimal(1) },
        row: 1,
        layerShown() { return player.m.points.gte(1) || player.r.unlocked },

        update(diff) {
            if (player.r.unlocked) {

                let craftRate = player.r.points.mul(diff).mul(1);
                if (hasUpgrade('r', 12)) craftRate = craftRate.mul(2);
               
                // Smelt Iron Bars


                if (player.ironOre.gte(craftRate) && player.coal.gte(craftRate)) {
                    player.ironOre = player.ironOre.sub(craftRate);
                    player.coal = player.coal.sub(craftRate);
                    player.ironBar = player.ironBar.add(craftRate);
                }

                // Smelt Copper Wire from raw Copper
                let copperWireRate = player.r.points.mul(diff).mul(1);
                if (player.copperOre.gte(copperWireRate)) {
                    player.copperOre = player.copperOre.sub(copperWireRate);
                    player.copperWire = player.copperWire.add(copperWireRate);


                }
            }
        },

        tabFormat: {
            "Smelting": {
                content: [
                    "main-display", "prestige-button", "blank",
                    ["display-text", function() {

                        return "You have <h3 style='color:#d4af37'>" + format(player.ironBar) + "</h3> Iron Bars<br>" +
                               "You have <h3 style='color:#ff9999'>" + format(player.copperWire) + "</h3> Copper Wire"


                    }],
                    "blank", "upgrades"
                ]
            }
        },

        upgrades: {

            11: { title: "Blast Furnace", description: "Refinery Workers boost Mining Power gain.", cost: new Decimal(5) },
            12: { title: "Induced Induction", description: "Double refining speeds.", cost: new Decimal(20) },
        }
    })

    // ============================================================================
    // LAYER 3: PARTS (p) - ROW 2
    // ============================================================================


    addLayer("p", {
        name: "Parts",
        symbol: "P",

        position: -10,


        startData() { return {
            unlocked: false,
            points: new Decimal(0),
        }},

        color: "#6c757d",
        requires: new Decimal(50),
        resource: "Assembly Lines",
        baseResource: "ironBar",
        baseAmount() { return player.ironBar },


        type: "normal",
        exponent: 0.5,

        row: 2,
        layerShown() { return player.r.points.gte(1) || player.p.unlocked },

        update(diff) {
            if (player.p.unlocked) {
                let assemblySpeed = player.p.points.mul(diff).mul(0.5);
                // Craft Gears
                if (player.ironBar.gte(assemblySpeed)) {
                    player.ironBar = player.ironBar.sub(assemblySpeed);
                    player.gear = player.gear.add(assemblySpeed);
                }
                // Craft Motors
                let motorCost = assemblySpeed.mul(2);
                if (player.ironBar.gte(motorCost) && player.copperWire.gte(motorCost)) {
                    player.ironBar = player.ironBar.sub(motorCost);
                    player.copperWire = player.copperWire.sub(motorCost);
                    player.motor = player.motor.add(assemblySpeed);
                }
            }
        },

        tabFormat: {
            "Assembly": {


                content: [
                    "main-display", "prestige-button", "blank",
                    ["display-text", function() {

                        return "You have <h3 style='color:#b2beb5'>" + format(player.gear) + "</h3> Gears<br>" +
                               "You have <h3 style='color:#4682b4'>" + format(player.motor) + "</h3> Motors"
                    }],
                ]
            }
        }
    })

    // ============================================================================
    // LAYER 4: FACTORY (f) - ROW 2 (Paired horizontally with Parts)
    // ============================================================================
    addLayer("f", {
        name: "Factory",
        symbol: "F",
        position: +10,


        startData() { return {
            unlocked: false,
            points: new Decimal(0),
        }},

        color: "#4a5d6e",
        requires: new Decimal(100),
        resource: "Industrial Machinery",
        baseResource: "copperWire",
        baseAmount() { return player.copperWire },
        type: "normal",
        exponent: 0.4,
        row: 2,
        layerShown() { return player.p.unlocked || player.f.unlocked },

        update(diff) {
            if (player.f.unlocked) {
                let fabSpeed = player.f.points.mul(diff).mul(0.2);
                // Craft Electronic Boards
                if (player.copperWire.gte(fabSpeed.mul(4)) && player.copperOre.gte(fabSpeed.mul(2))) {
                    player.copperWire = player.copperWire.sub(fabSpeed.mul(4));
                    player.copperOre = player.copperOre.sub(fabSpeed.mul(2));
                    player.electronicBoard = player.electronicBoard.add(fabSpeed);
                }
            }
        },

        tabFormat: {
            "Fabrication": {


                content: [
                    "main-display", "prestige-button", "blank",
                    ["display-text", function() {

                        return "You have <h3 style='color:#00ffcc'>" + format(player.electronicBoard) + "</h3> Electronic Boards"
                    }],
                ]
            }
        }
    })

    // ============================================================================
    // LAYER 5: LOGISTICS (l) - ROW 3
    // ============================================================================
    addLayer("l", {
        name: "Logistics",
        symbol: "L",


        position: 0,
        startData() { return {
            unlocked: false,
            points: new Decimal(0),
        }},

        color: "#e67e22",
        requires: new Decimal(50),
        resource: "Logistics Networks",
        baseResource: "electronicBoard",
        baseAmount() { return player.electronicBoard },


        type: "normal",
        exponent: 0.5,

        row: 3,
        layerShown() { return (player.p.unlocked && player.f.unlocked) || player.l.unlocked },

        // Boosts execution rate of previous steps if unlocked
        update(diff) {
            if (player.l.unlocked) {
                let logisticsBonus = player.l.points.mul(0.1);
                // Directly scale up points/sec dynamically via standard multiplier hooks
            }
        },

        tabFormat: {
            "Supply Chain": {


                content: [
                    "main-display", "prestige-button", "blank",
                    ["display-text", function() {

                        return "Logistics Networks grant a global +10% production velocity scaling per node item."
                    }],
                ]
            }
        }
    })


    // ============================================================================
    // LAYER 6: PRESTIGE / REORGANIZATION (pr) - ROW 4
    // ============================================================================
    addLayer("pr", {
        name: "Reorganization",
        symbol: "PR",


        position: 0,
        startData() { return {
            unlocked: false,
            points: new Decimal(0),
        }},

        color: "#9b59b6",
        requires: new Decimal(1000),
        resource: "Corporate Bureaucracy",
        baseResource: "points",
        baseAmount() { return player.points },
        type: "normal",
        exponent: 0.3,
        row: 4,
        layerShown() { return player.l.unlocked || player.pr.unlocked },
       
        tabFormat: {
            "Corporate Headquarters": {


                content: [
                    "main-display",
                    "prestige-button",
                    "blank",
                    ["display-text", function() {

                        return "Reorganize operations to scale global infrastructure parameters."
                    }],
                ]
            }
        }
    })

    // ============================================================================
    // LAYER 7: ULTRA PRESTIGE / MEGACORP (mc) - ROW 5
    // ============================================================================
    addLayer("mc", {


        name: "Megacorp",
        symbol: "MC",
        position: 0,
        startData() { return {
            unlocked: false,
            points: new Decimal(0),
        }},

        color: "#1abc9c",
        requires: new Decimal(10),
        resource: "Conglomerate Shares",
        baseResource: "pr", // Resets corporate bureaucracy points
        baseAmount() { return player.pr.points },
        type: "static", // Static progression paradigm for the endgame layer
        exponent: 1.2,
        row: 5,
        layerShown() { return player.pr.unlocked || player.mc.unlocked },

        tabFormat: {
            "Monopoly Boardroom": {


                content: [
                    "main-display",
                    "prestige-button",
                    "blank",
                    ["display-text", function() {

                        return "You dominate the galactic market with ultimate industrial monopolies."
                    }],
                ]
            }
        }
    })


    // ============================================================================
    // LAYER 8: SPACE PROGRAM / ORBITALS (s) - ROW 6
    // ============================================================================
    addLayer("s", {
        name: "Space Program",
        symbol: "SP",


        position: 0,
        startData() { return {
            unlocked: false,
            points: new Decimal(0),

            satellites: new Decimal(0),
        }},
        color: "#34495e",
        requires: new Decimal(5), // Costs 5 Megacorp shares to launch
        resource: "Orbital Stations",
        baseResource: "mc",
        baseAmount() { return player.mc.points },
        type: "static",
        exponent: 1.5,
        row: 6,
        layerShown() { return player.mc.unlocked || player.s.unlocked },

        update(diff) {
            if (player.s.unlocked) {
                // Space stations construct orbital satellites automatically
                let buildRate = player.s.points.mul(diff).mul(0.1);
                player.s.satellites = player.s.satellites.add(buildRate);
            }
        },

        tabFormat: {
            "Orbital Command": {


                content: [
                    "main-display", "prestige-button", "blank",
                    ["display-text", function() {

                        return "You have <h3 style='color:#5dade2'>" + format(player.s.satellites) + "</h3> Active Satellites.<br>" +
                               "Satellites multiply your global resource generation speed."
                    }],
                ]
            }
        }
    })

    // ============================================================================
    // LAYER 9: QUANTUM REFINERY / TECH (q) - ROW 7
    // ============================================================================
    addLayer("q", {
        name: "Quantum Tech",
        symbol: "Q",


        position: 0,
        startData() { return {
            unlocked: false,
            points: new Decimal(0),
        }},

        color: "#1abc9c",
        requires: new Decimal(100), // Requires 100 satellites
        resource: "Quantum Processors",
        baseResource: "satellites",
        baseAmount() { return player.s.satellites },
        type: "normal",
        exponent: 0.25,
        row: 7,
        layerShown() { return player.s.points.gte(1) || player.q.unlocked },

        tabFormat: {
            "Subatomic Manipulation": {


                content: [
                    "main-display", "prestige-button", "blank",
                    ["display-text", function() {

                        return "Processors manipulate probability matrices to exponentially amplify point production."
                    }],
                ]
            }
        }
    })

    // ============================================================================
    // LAYER 10: COSMIC SINGULARITY (c) - ROW 8 (ENDGAME LAYER)
    // ============================================================================
    addLayer("c", {
        name: "Singularity",
        symbol: "Ω",


        position: 0,
        startData() { return {
            unlocked: false,
            points: new Decimal(0),
        }},

        color: "#ffffff",
        requires: new Decimal(1e12), // Massive raw data points requirement
        resource: "Singularity Cores",
        baseResource: "points",
        baseAmount() { return player.points },
        type: "normal",
        exponent: 0.1,
        row: 8,
        layerShown() { return player.q.unlocked || player.c.unlocked },

        tabFormat: {
            "The Event Horizon": {


                content: [
                    "main-display", "prestige-button", "blank",
                    ["display-text", function() {

                        return "Compress the entire galaxy into an infinitely dense point to break the math constraints of reality."
                    }],
                ]
            }
        }
    })
