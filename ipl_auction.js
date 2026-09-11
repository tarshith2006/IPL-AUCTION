// 1. Players Database (500 players loaded dynamically from players_data.js)


// 2. Teams Configuration Databases (IPL Franchises vs. International Nations)
const defaultIplTeams = [
    { id: "CSK", name: "CSK", purse: 30000, slots: 0, foreign: 0, color: "#f7ca18", strategy: "calculated" },
    { id: "MI", name: "MI", purse: 30000, slots: 0, foreign: 0, color: "#004ba0", strategy: "aggressive" },
    { id: "RCB", name: "RCB", purse: 30000, slots: 0, foreign: 0, color: "#d11919", strategy: "aggressive" },
    { id: "KKR", name: "KKR", purse: 30000, slots: 0, foreign: 0, color: "#3a225d", strategy: "balanced" },
    { id: "RR", name: "RR", purse: 30000, slots: 0, foreign: 0, color: "#ea2c62", strategy: "calculated" },
    { id: "SRH", name: "SRH", purse: 30000, slots: 0, foreign: 0, color: "#ff5c00", strategy: "aggressive" },
    { id: "DC", name: "DC", purse: 30000, slots: 0, foreign: 0, color: "#0078ff", strategy: "balanced" },
    { id: "LSG", name: "LSG", purse: 30000, slots: 0, foreign: 0, color: "#00b4d8", strategy: "balanced" },
    { id: "GT", name: "GT", purse: 30000, slots: 0, foreign: 0, color: "#0b2240", strategy: "calculated" },
    { id: "PBKS", name: "PBKS", purse: 30000, slots: 0, foreign: 0, color: "#e61a29", strategy: "wildcard" }
];

const defaultIntTeams = [
    { id: "IND", name: "India", purse: 30000, slots: 0, foreign: 0, strategy: "calculated" },
    { id: "AUS", name: "Australia", purse: 30000, slots: 0, foreign: 0, strategy: "aggressive" },
    { id: "ENG", name: "England", purse: 30000, slots: 0, foreign: 0, strategy: "balanced" },
    { id: "RSA", name: "South Africa", purse: 30000, slots: 0, foreign: 0, strategy: "wildcard" },
    { id: "PAK", name: "Pakistan", purse: 30000, slots: 0, foreign: 0, strategy: "aggressive" },
    { id: "NZ", name: "New Zealand", purse: 30000, slots: 0, foreign: 0, strategy: "calculated" },
    { id: "WI", name: "West Indies", purse: 30000, slots: 0, foreign: 0, strategy: "wildcard" },
    { id: "SL", name: "Sri Lanka", purse: 30000, slots: 0, foreign: 0, strategy: "balanced" },
    { id: "AFG", name: "Afghanistan", purse: 30000, slots: 0, foreign: 0, strategy: "aggressive" },
    { id: "BAN", name: "Bangladesh", purse: 30000, slots: 0, foreign: 0, strategy: "calculated" }
];

let teams = defaultIplTeams.map(t => ({ ...t, rtmCards: 3 }));

// 3. Application State Variable
let state = {
    currentPlayerIndex: 0,
    currentBid: 0,          // in Lakhs
    currentBidder: null,    // Team ID
    auctionStatus: "idle",  // 'idle', 'bidding', 'sold', 'unsold'
    timerVal: 15,
    defaultTimerVal: 15,    // Default 15s
    timerInterval: null,
    isAIActive: true,       // Enabled by default!
    aiDelay: 1200,          // ms
    aiTimeoutId: null,
    aiThinkingTimeoutId: null,
    selectedTab: "all",
    searchQuery: "",
    soundEnabled: true,
    userTeam: "MI",
    auctionMode: "IPL"      // 'IPL' or 'INT'
};

// Web Audio API Synthesis Objects
let audioCtx = null;

const superstarPhotos = {
    "Virat Kohli": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Virat_Kohli_in_PMO_New_Delhi.jpg/220px-Virat_Kohli_in_PMO_New_Delhi.jpg",
    "MS Dhoni": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Mahendra_Singh_Dhoni_undergoing_training_with_the_Territorial_Army.jpg/220px-Mahendra_Singh_Dhoni_undergoing_training_with_the_Territorial_Army.jpg",
    "Rohit Sharma": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Prime_Minister_Of_India_Shri_Narendra_Modi_With_Indian_Cricket_Team_After_Winning_T20_World_Cup_2024_%28cropped_Rohit_Sharma%29.jpg/220px-Prime_Minister_Of_India_Shri_Narendra_Modi_With_Indian_Cricket_Team_After_Winning_T20_World_Cup_2024_%28cropped_Rohit_Sharma%29.jpg",
    "Jasprit Bumrah": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Jasprit_Bumrah_in_2019.jpg/220px-Jasprit_Bumrah_in_2019.jpg",
    "Hardik Pandya": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Hardik_Pandya_in_2018.jpg/220px-Hardik_Pandya_in_2018.jpg",
    "Shubman Gill": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Shubman_Gill_in_2023.jpg/220px-Shubman_Gill_in_2023.jpg",
    "Suryakumar Yadav": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Suryakumar_Yadav_in_2023.jpg/220px-Suryakumar_Yadav_in_2023.jpg",
    "Ravindra Jadeja": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Ravindra_Jadeja_in_2018.jpg/220px-Ravindra_Jadeja_in_2018.jpg",
    "Babar Azam": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Babar_Azam_in_2020.jpg/220px-Babar_Azam_in_2020.jpg",
    "Shaheen Afridi": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Shaheen_Shah_Afridi_in_2020.jpg/220px-Shaheen_Shah_Afridi_in_2020.jpg",
    "Kane Williamson": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Kane_Williamson_in_2019.jpg/220px-Kane_Williamson_in_2019.jpg",
    "Rashid Khan": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Rashid_Khan_in_2019.jpg/220px-Rashid_Khan_in_2019.jpg",
    "Jos Buttler": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Jos_Buttler_in_2018.jpg/220px-Jos_Buttler_in_2018.jpg",
    "David Warner": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/David_Warner_in_2019.jpg/220px-David_Warner_in_2019.jpg",
    "Pat Cummins": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Pat_Cummins_in_2019.jpg/220px-Pat_Cummins_in_2019.jpg",
    "Mitchell Starc": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Mitchell_Starc_in_2019.jpg/220px-Mitchell_Starc_in_2019.jpg",
    "Trent Boult": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Trent_Boult_in_2016.jpg/220px-Trent_Boult_in_2016.jpg",
    "Quinton de Kock": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Quinton_de_Kock_in_2016.jpg/220px-Quinton_de_Kock_in_2016.jpg",
    "Kagiso Rabada": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Kagiso_Rabada_in_2020.jpg/220px-Kagiso_Rabada_in_2020.jpg",
    "Glenn Maxwell": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Glenn_Maxwell_in_2019.jpg/220px-Glenn_Maxwell_in_2019.jpg"
};

function getPlayerPhotoUrl(playerName, id) {
    if (superstarPhotos[playerName]) {
        return superstarPhotos[playerName];
    }
    // Fallback to high-resolution real face portraits
    const photoId = ((id * 7) % 99) + 1;
    return `https://randomuser.me/api/portraits/men/${photoId}.jpg`;
}

// Initialize
window.addEventListener("DOMContentLoaded", () => {
    initApp();
});

function initApp() {
    loadStateFromStorage();
    renderPurseBoard();
    renderCatalog();
    loadPlayer(state.currentPlayerIndex);
    setupEventListeners();
    updateUIElements();
}

// 4. Setup Custom Event Handlers
function setupEventListeners() {
    // Auction Mode Selector change
    const modeSelect = document.getElementById("auction-mode-select");
    if (modeSelect) {
        modeSelect.addEventListener("change", (e) => {
            if (confirm("Reset current draft to change Auction Mode?")) {
                state.auctionMode = e.target.value;
                resetAuctionForMode(state.auctionMode);
            } else {
                e.target.value = state.auctionMode;
            }
        });
    }

    // Timer Duration Selector change
    const timerSelect = document.getElementById("timer-duration-select");
    if (timerSelect) {
        timerSelect.addEventListener("change", (e) => {
            state.defaultTimerVal = parseInt(e.target.value);
            state.timerVal = state.defaultTimerVal;
            resetTimer();
            logMessage(`Default timer updated to <strong>${state.defaultTimerVal} seconds</strong>.`, "info");
        });
    }

    // User Select Franchise
    document.getElementById("user-team-select").addEventListener("change", (e) => {
        state.userTeam = e.target.value;
        saveStateToStorage();
        renderPurseBoard();

        const labelText = state.auctionMode === "IPL" ? "team" : "country";
        logMessage(`You are now managing ${labelText} <span class="team-txt-${state.userTeam}">${state.userTeam}</span>`, "info");
    });

    // Speed Controls
    document.querySelectorAll(".speed-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".speed-btn").forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            state.aiDelay = parseInt(e.target.getAttribute("data-speed"));
        });
    });

    // Bid Interaction Buttons
    document.getElementById("bid-inc-1").addEventListener("click", () => handleUserBid(10));
    document.getElementById("bid-inc-2").addEventListener("click", () => handleUserBid(25));
    document.getElementById("bid-inc-3").addEventListener("click", () => handleUserBid(50));
    document.getElementById("bid-inc-4").addEventListener("click", () => handleUserBid(100));

    // Control Buttons
    document.getElementById("btn-start").addEventListener("click", startBidding);
    document.getElementById("btn-simulate").addEventListener("click", toggleSimulation);
    document.getElementById("btn-pass").addEventListener("click", handleUserPass);
    document.getElementById("btn-sold").addEventListener("click", hammerSold);
    document.getElementById("btn-clear-log").addEventListener("click", clearLogs);
    document.getElementById("btn-reset-auction").addEventListener("click", resetAllAuctions);

    // Audio Switch Toggle
    document.getElementById("btn-toggle-sound").addEventListener("click", (e) => {
        state.soundEnabled = !state.soundEnabled;
        const btn = e.target.closest("button");
        if (state.soundEnabled) {
            btn.classList.add("active");
            btn.innerHTML = `<i class="fa-solid fa-volume-high"></i> ON`;
        } else {
            btn.classList.remove("active");
            btn.innerHTML = `<i class="fa-solid fa-volume-xmark"></i> OFF`;
        }
    });

    // Tabs triggers
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            state.selectedTab = e.target.getAttribute("data-tab");
            renderCatalog();
        });
    });

    // Search bar
    document.getElementById("search-players").addEventListener("input", (e) => {
        state.searchQuery = e.target.value.toLowerCase();
        renderCatalog();
    });

    // Overlay Actions
    document.getElementById("btn-close-overlay").addEventListener("click", () => {
        document.getElementById("sold-overlay").classList.remove("show");
        advanceNextPlayer();
    });

    // RTM Overlay Actions
    document.getElementById("btn-rtm-match").addEventListener("click", () => {
        const p = players[state.currentPlayerIndex];
        const prevTeam = teams.find(t => t.id === p.previousTeam);
        const finalPrice = state.currentBid;

        document.getElementById("rtm-overlay").classList.remove("show");
        logMessage(`<strong>RTM EXERCISED!</strong> You matched the bid of ${formatCurrency(finalPrice)} to retain ${p.name}!`, "sold");
        executeRtmPurchase(prevTeam, finalPrice);
    });

    document.getElementById("btn-rtm-decline").addEventListener("click", () => {
        const p = players[state.currentPlayerIndex];
        const winningTeam = teams.find(t => t.id === state.currentBidder);
        const finalPrice = state.currentBid;

        document.getElementById("rtm-overlay").classList.remove("show");
        logMessage(`<strong>RTM DECLINED!</strong> You declined RTM for ${p.name}.`, "info");
        executeStandardPurchase(winningTeam, finalPrice);
    });
}

// 5. App Data Loader
function loadPlayer(index) {
    if (index < 0 || index >= players.length) return;

    // Stop any animations or cycles
    resetTimer();

    const p = players[index];
    state.currentPlayerIndex = index;
    state.currentBid = 0;
    state.currentBidder = null;
    state.timerVal = state.defaultTimerVal;
    state.auctionStatus = p.status;

    // Dynamic/deterministic previous team assignment if not set or invalid for current mode
    const isValidTeam = teams.some(t => t.id === p.previousTeam);
    if (!p.previousTeam || !isValidTeam) {
        const teamIndex = p.id % teams.length;
        p.previousTeam = teams[teamIndex].id;
    }

    // Update display items
    document.getElementById("current-player-index").innerText = `${String(index + 1).padStart(2, '0')} / ${String(players.length).padStart(2, '0')}`;
    document.getElementById("player-name-display").innerText = p.name;
    document.getElementById("player-role-badge").innerText = p.role.toUpperCase();
    document.getElementById("player-role-badge").style.backgroundColor = getRoleColor(p.role);
    document.getElementById("player-country-flag").innerText = p.country;

    // Display Previous Team
    const prevTeamEl = document.getElementById("player-prev-team-badge");
    if (prevTeamEl) {
        const prevTeamInfo = teams.find(t => t.id === p.previousTeam);
        prevTeamEl.innerText = `PREV: ${prevTeamInfo ? prevTeamInfo.name : p.previousTeam}`;
        if (prevTeamInfo && prevTeamInfo.color) {
            prevTeamEl.style.color = prevTeamInfo.color;
            prevTeamEl.style.borderColor = `${prevTeamInfo.color}40`;
            prevTeamEl.style.backgroundColor = `${prevTeamInfo.color}15`;
        } else {
            prevTeamEl.style.color = "var(--accent-cyan)";
            prevTeamEl.style.borderColor = "rgba(0, 240, 255, 0.2)";
            prevTeamEl.style.backgroundColor = "rgba(0, 240, 255, 0.05)";
        }
    }

    // Build avatar profile
    const avatar = document.getElementById("player-image-display");
    avatar.style.backgroundImage = `url("${getPlayerPhotoUrl(p.name, p.id)}")`;
    avatar.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
    avatar.style.borderColor = "var(--accent-cyan)";
    avatar.innerHTML = "";

    document.getElementById("stat-matches").innerText = p.matches;
    document.getElementById("stat-primary").innerText = p.primaryStat;
    document.getElementById("stat-secondary").innerText = p.secondaryStat;

    document.getElementById("base-price-lbl").innerText = formatCurrency(p.price);

    if (p.status === "available") {
        document.getElementById("current-bid-lbl").innerText = "₹0";
        document.getElementById("leading-bidder-name").innerText = "NO BIDS YET";
        state.auctionStatus = "idle";
    } else if (p.status === "sold") {
        document.getElementById("current-bid-lbl").innerText = formatCurrency(p.winningPrice);
        document.getElementById("leading-bidder-name").innerText = p.winningTeam;
        state.auctionStatus = "sold";
    } else {
        document.getElementById("current-bid-lbl").innerText = "UNSOLD";
        document.getElementById("leading-bidder-name").innerText = "NONE";
        state.auctionStatus = "unsold";
    }

    updateUIElements();
    updateTabCounts();
    highlightCatalogCard(p.id);
}

// 6. Main Action: Start Bidding
function startBidding() {
    const p = players[state.currentPlayerIndex];
    if (p.status !== "available" && state.auctionStatus !== "idle") {
        alert("This player has already been auctioned.");
        return;
    }

    state.auctionStatus = "bidding";
    state.currentBid = p.price;
    state.currentBidder = null;
    state.timerVal = state.defaultTimerVal;

    logMessage(`Auction started for <strong>${p.name}</strong> at Base Price of <span class="amt-lbl">${formatCurrency(p.price)}</span>.`, "info");
    playSfxGavel();

    updateUIElements();
    startTimer();

    if (state.isAIActive) {
        scheduleAIBid();
    }
}

// 7. Timer Logic
function startTimer() {
    resetTimer();
    updateTimerProgress();

    state.timerInterval = setInterval(() => {
        state.timerVal--;
        document.getElementById("timer-seconds").innerText = state.timerVal;

        let timerSecElement = document.getElementById("timer-seconds");
        if (state.timerVal <= 3) {
            timerSecElement.classList.add("warning");
            playSfxBeep(600, 0.05); // Synthesize quick warning sound
        } else {
            timerSecElement.classList.remove("warning");
        }

        updateTimerProgress();

        if (state.timerVal <= 0) {
            clearInterval(state.timerInterval);
            handleTimeout();
        }
    }, 1000);
}

function resetTimer() {
    if (state.timerInterval) clearInterval(state.timerInterval);
    document.getElementById("timer-seconds").innerText = state.defaultTimerVal;
    document.getElementById("timer-seconds").classList.remove("warning");
    updateTimerProgress();
}

function updateTimerProgress() {
    const ring = document.getElementById("ring-timer");
    const circumference = 2 * Math.PI * 45; // ~282.74
    // timer ranges from defaultTimerVal to 0
    const offset = circumference - (state.timerVal / state.defaultTimerVal) * circumference;
    ring.style.strokeDashoffset = offset;

    if (state.timerVal <= 3) {
        ring.style.stroke = "var(--accent-red)";
    } else {
        ring.style.stroke = "var(--accent-cyan)";
    }
}

// Timeout Logic
function handleTimeout() {
    if (state.currentBidder) {
        // Hammer Sold
        hammerSold();
    } else {
        // Player Unsold
        markPlayerUnsold();
    }
}

// 8. Bid Placements
function handleUserBid(increment) {
    if (state.auctionStatus !== "bidding") return;

    const targetBid = state.currentBid + increment;
    placeBid(state.userTeam, targetBid);
}

function handleUserPass() {
    if (state.auctionStatus !== "bidding") return;

    logMessage(`You passed on player index. AI simulation continues.`, "info");
    // Speed up AI bidding or just let timer run out
}

function placeBid(teamId, bidAmt) {
    if (state.auctionStatus !== "bidding") return;

    const team = teams.find(t => t.id === teamId);
    if (!team) return;

    if (team.purse < bidAmt) {
        if (teamId === state.userTeam) {
            alert(`Insufficient funds! ${teamId}'s remaining purse is: ${formatCurrency(team.purse)}`);
        }
        return;
    }

    // Capture bid
    state.currentBid = bidAmt;
    state.currentBidder = teamId;
    state.timerVal = state.defaultTimerVal; // reset countdown

    // Update screen
    document.getElementById("current-bid-lbl").innerText = formatCurrency(bidAmt);
    document.getElementById("leading-bidder-name").innerHTML = `<span class="team-txt-${teamId}">${team.name}</span>`;

    logMessage(`<span class="team-lbl team-txt-${teamId}">${team.name}</span> raised bid to <span class="amt-lbl">${formatCurrency(bidAmt)}</span>`, "bid");
    playSfxGavel();

    // Restart timer
    startTimer();

    // Re-schedule AI
    if (state.isAIActive) {
        scheduleAIBid();
    }
}

// 9. AI Simulation Opponent Logic
function toggleSimulation() {
    state.isAIActive = !state.isAIActive;
    const simBtn = document.getElementById("btn-simulate");

    if (state.isAIActive) {
        simBtn.classList.add("active");
        simBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> SIM RUNNING`;
        logMessage("AI automated competitor system activated.", "info");
        if (state.auctionStatus === "bidding") {
            scheduleAIBid();
        }
    } else {
        simBtn.classList.remove("active");
        simBtn.innerHTML = `<i class="fa-solid fa-robot"></i> RUN SIMULATOR`;
        if (state.aiTimeoutId) clearTimeout(state.aiTimeoutId);
        logMessage("AI automated competitor system deactivated.", "info");
    }
}

let thinkingMessages = [
    "is considering a counter-bid...",
    "is checking their remaining budget...",
    "is preparing to raise...",
    "is looking at their player slots...",
    "is talking to the analyst table..."
];

function scheduleAIBid() {
    if (state.aiTimeoutId) clearTimeout(state.aiTimeoutId);
    if (state.aiThinkingTimeoutId) clearTimeout(state.aiThinkingTimeoutId);

    if (state.auctionStatus !== "bidding" || !state.isAIActive) return;

    const p = players[state.currentPlayerIndex];
    let eligibleTeams = teams.filter(t => {
        // Can't bid against self (if leading)
        if (t.id === state.currentBidder) return false;

        // User team is handled by manual input, not AI script
        if (t.id === state.userTeam) return false;

        // Cannot bid if they don't have budget
        const nextIncrement = getAutoIncrementValue(state.currentBid);
        const proposalBid = state.currentBid + nextIncrement;
        if (t.purse < proposalBid) return false;

        // Team bidding caps based on player rating and team strategies
        let strategyMult = 1.0;
        if (t.strategy === "aggressive") strategyMult = 1.45;
        else if (t.strategy === "balanced") strategyMult = 1.20;
        else if (t.strategy === "calculated") strategyMult = 0.90;
        else if (t.strategy === "wildcard") strategyMult = 0.70 + Math.random() * 0.90;

        const willingnessToPay = (p.rating * p.rating * 0.06 + p.price * 1.5) * strategyMult + (Math.random() * 50 - 25);
        if (proposalBid > willingnessToPay) return false;

        return true;
    });

    if (eligibleTeams.length === 0) {
        return; // All teams dropped out
    }

    // Pick a random team from willing bidders
    const chosenTeam = eligibleTeams[Math.floor(Math.random() * eligibleTeams.length)];

    // 1. Schedule "thinking" log message
    const thinkingDelay = 400 + Math.random() * 400;
    state.aiThinkingTimeoutId = setTimeout(() => {
        if (state.auctionStatus !== "bidding" || chosenTeam.id === state.currentBidder) return;
        const msg = thinkingMessages[Math.floor(Math.random() * thinkingMessages.length)];
        logMessage(`<span class="team-lbl team-txt-${chosenTeam.id}">${chosenTeam.name}</span> ${msg}`, "info");
    }, thinkingDelay);

    // 2. Schedule actual bid placement
    const bidDelay = thinkingDelay + 800 + Math.random() * 800;
    state.aiTimeoutId = setTimeout(() => {
        if (state.auctionStatus !== "bidding" || chosenTeam.id === state.currentBidder) return;
        const nextIncrement = getAutoIncrementValue(state.currentBid);
        const finalBid = state.currentBid + nextIncrement;

        if (chosenTeam.purse >= finalBid) {
            placeBid(chosenTeam.id, finalBid);
        }
    }, bidDelay);
}

function getAutoIncrementValue(currentBid) {
    if (currentBid < 200) return 10;     // under 2 Crore: increment 10L
    if (currentBid < 500) return 20;     // 2-5 Crore: increment 20L
    if (currentBid < 1000) return 50;    // 5-10 Crore: increment 50L
    return 100;                          // 10 Crore+: increment 1.00 Cr
}

// 10. End of Bid Handlers
function hammerSold() {
    if (state.auctionStatus !== "bidding" || !state.currentBidder) return;

    resetTimer();

    const p = players[state.currentPlayerIndex];
    const winningTeam = teams.find(t => t.id === state.currentBidder);
    const finalPrice = state.currentBid;

    // Check if RTM retention is possible
    const prevTeamId = p.previousTeam;
    const prevTeam = teams.find(t => t.id === prevTeamId);

    if (prevTeam && prevTeam.id !== winningTeam.id && prevTeam.rtmCards > 0 && prevTeam.purse >= finalPrice) {
        // RTM is possible! Pause the main simulation/bidding
        state.auctionStatus = "rtm_decision";
        if (state.aiTimeoutId) clearTimeout(state.aiTimeoutId);
        if (state.aiThinkingTimeoutId) clearTimeout(state.aiThinkingTimeoutId);

        // Open RTM overlay
        document.getElementById("rtm-player-avatar").src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(p.name)}`;
        document.getElementById("rtm-player-name").innerText = p.name;
        document.getElementById("rtm-winning-price").innerText = formatCurrency(finalPrice);
        document.getElementById("rtm-winning-team").innerText = winningTeam.name;

        // Set who gets the option
        const rtmStatusMsg = document.getElementById("rtm-status-message");
        rtmStatusMsg.innerHTML = `<span class="team-txt-${prevTeam.id}">${prevTeam.name}</span> has the option to match the bid and retain ${p.name}. (RTM Cards: ${prevTeam.rtmCards})`;

        // Show overlay
        document.getElementById("rtm-overlay").classList.add("show");

        if (prevTeam.id === state.userTeam) {
            // User gets the decision
            document.getElementById("rtm-decision-controls").style.display = "block";
            document.getElementById("rtm-ai-status").style.display = "none";
        } else {
            // AI gets the decision
            document.getElementById("rtm-decision-controls").style.display = "none";
            document.getElementById("rtm-ai-status").style.display = "block";
            document.getElementById("rtm-ai-text").innerText = `${prevTeam.name} is considering the RTM option...`;

            // Simulating AI decision making delay
            setTimeout(() => {
                // How does the AI decide?
                // AI bids up to willingness to pay based on current strategy.
                let strategyMult = 1.0;
                if (prevTeam.strategy === "aggressive") strategyMult = 1.45;
                else if (prevTeam.strategy === "balanced") strategyMult = 1.20;
                else if (prevTeam.strategy === "calculated") strategyMult = 0.90;
                else if (prevTeam.strategy === "wildcard") strategyMult = 0.70 + Math.random() * 0.90;

                const willingnessToPay = (p.rating * p.rating * 0.06 + p.price * 1.5) * strategyMult + (Math.random() * 30 - 15);
                const wantsToRetain = finalPrice <= willingnessToPay && finalPrice <= prevTeam.purse;

                if (wantsToRetain) {
                    // AI Matches!
                    logMessage(`<strong>RTM EXERCISED!</strong> <span class="team-txt-${prevTeam.id}">${prevTeam.name}</span> matched the bid of ${formatCurrency(finalPrice)} to retain ${p.name}!`, "sold");
                    document.getElementById("rtm-ai-text").innerText = `${prevTeam.name} has MATCHED the bid and RETAINED the player!`;

                    setTimeout(() => {
                        document.getElementById("rtm-overlay").classList.remove("show");
                        executeRtmPurchase(prevTeam, finalPrice);
                    }, 1500);
                } else {
                    // AI Declines!
                    logMessage(`<strong>RTM DECLINED!</strong> <span class="team-txt-${prevTeam.id}">${prevTeam.name}</span> declined RTM for ${p.name}.`, "info");
                    document.getElementById("rtm-ai-text").innerText = `${prevTeam.name} has DECLINED the RTM option.`;

                    setTimeout(() => {
                        document.getElementById("rtm-overlay").classList.remove("show");
                        executeStandardPurchase(winningTeam, finalPrice);
                    }, 1500);
                }
            }, 1800);
        }
    } else {
        // Standard sale directly
        executeStandardPurchase(winningTeam, finalPrice);
    }
}

function executeStandardPurchase(winningTeam, finalPrice) {
    const p = players[state.currentPlayerIndex];
    // Record sale
    p.status = "sold";
    p.winningPrice = finalPrice;
    p.winningTeam = winningTeam.name;

    // Deduct Purse & increase counts
    winningTeam.purse -= finalPrice;
    winningTeam.slots += 1;
    if (p.country !== "🇮🇳 IND") {
        winningTeam.foreign += 1;
    }

    state.auctionStatus = "sold";

    // Audio trigger
    playSfxSold();

    // Log
    logMessage(`<strong>HAMMER SOLD!</strong> ${p.name} acquired by <span class="team-txt-${winningTeam.id}">${winningTeam.name}</span> for <span class="amt-lbl">${formatCurrency(finalPrice)}</span>.`, "sold");

    // UI update
    renderPurseBoard();
    renderCatalog();
    updateTabCounts();
    saveStateToStorage();

    // Trigger overlay celebration
    showSoldOverlay(p.name, winningTeam.name, formatCurrency(finalPrice));
}

function executeRtmPurchase(retainingTeam, finalPrice) {
    const p = players[state.currentPlayerIndex];
    // Record sale
    p.status = "sold";
    p.winningPrice = finalPrice;
    p.winningTeam = retainingTeam.name;

    // Deduct Purse & increase counts
    retainingTeam.purse -= finalPrice;
    retainingTeam.slots += 1;
    retainingTeam.rtmCards -= 1; // Decrement RTM card!
    if (p.country !== "🇮🇳 IND") {
        retainingTeam.foreign += 1;
    }

    state.auctionStatus = "sold";

    // Audio trigger
    playSfxSold();

    // Log
    logMessage(`<strong>HAMMER SOLD (RTM)!</strong> ${p.name} retained by <span class="team-txt-${retainingTeam.id}">${retainingTeam.name}</span> for <span class="amt-lbl">${formatCurrency(finalPrice)}</span>.`, "sold");

    // UI update
    renderPurseBoard();
    renderCatalog();
    updateTabCounts();
    saveStateToStorage();

    // Trigger overlay celebration
    showSoldOverlay(p.name, retainingTeam.name, formatCurrency(finalPrice));
}

function markPlayerUnsold() {
    const p = players[state.currentPlayerIndex];
    p.status = "unsold";
    p.winningPrice = 0;
    p.winningTeam = "NONE";

    resetTimer();
    state.auctionStatus = "unsold";

    logMessage(`<strong>PASSED UNSOLD!</strong> ${p.name} went unsold.`, "unsold");
    playSfxDoubleTap();

    renderCatalog();
    updateTabCounts();
    updateUIElements();
    saveStateToStorage();
}

function advanceNextPlayer() {
    let nextIndex = state.currentPlayerIndex + 1;
    if (nextIndex >= players.length) {
        // wrap back to beginning if they want to view details, or just stop
        alert("All players have been auctioned! You can reset matching button to restart.");
        return;
    }
    loadPlayer(nextIndex);
}

// Overlay Celebration
function showSoldOverlay(playerName, teamName, bidAmountFormatted) {
    document.getElementById("sold-player-avatar").src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(playerName)}`;
    document.getElementById("sold-player-name").innerText = playerName;
    document.getElementById("sold-winning-team").innerText = teamName;

    // Give team text proper color
    const match = teams.find(t => t.name === teamName);
    const winTeamEl = document.getElementById("sold-winning-team");
    winTeamEl.className = "winning-team-glow";
    if (match) {
        winTeamEl.classList.add(`team-txt-${match.id}`);
    }

    document.getElementById("sold-winning-price").innerText = bidAmountFormatted;
    document.getElementById("sold-overlay").classList.add("show");

    // Confetti explosion
    if (typeof confetti === "function") {
        const duration = 2.5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1100 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }
}

// 11. UI Helpers
function updateUIElements() {
    const btnStart = document.getElementById("btn-start");
    const btnPass = document.getElementById("btn-pass");
    const btnSold = document.getElementById("btn-sold");

    if (state.auctionStatus === "idle") {
        btnStart.disabled = false;
        btnPass.disabled = true;
        btnSold.disabled = true;
        document.getElementById("auction-state-badge").className = "status-badge state-idle";
        document.getElementById("auction-state-badge").innerText = "AVAILABLE";
        document.getElementById("player-card").classList.remove("premium-glow");
    } else if (state.auctionStatus === "bidding") {
        btnStart.disabled = true;
        btnPass.disabled = false;
        btnSold.disabled = state.currentBidder ? false : true;
        document.getElementById("auction-state-badge").className = "status-badge state-bidding";
        document.getElementById("auction-state-badge").innerText = "BIDDING";
        document.getElementById("player-card").classList.add("premium-glow");
    } else if (state.auctionStatus === "sold") {
        btnStart.disabled = true;
        btnPass.disabled = true;
        btnSold.disabled = true;
        document.getElementById("auction-state-badge").className = "status-badge state-sold";
        document.getElementById("auction-state-badge").innerText = "SOLD";
        document.getElementById("player-card").classList.remove("premium-glow");
    } else if (state.auctionStatus === "unsold") {
        btnStart.disabled = true;
        btnPass.disabled = true;
        btnSold.disabled = true;
        document.getElementById("auction-state-badge").className = "status-badge state-unsold";
        document.getElementById("auction-state-badge").innerText = "UNSOLD";
        document.getElementById("player-card").classList.remove("premium-glow");
    } else if (state.auctionStatus === "rtm_decision") {
        btnStart.disabled = true;
        btnPass.disabled = true;
        btnSold.disabled = true;
        document.getElementById("auction-state-badge").className = "status-badge state-idle";
        document.getElementById("auction-state-badge").innerText = "RTM PENDING";
        document.getElementById("player-card").classList.remove("premium-glow");
    }

    // Toggle Increment Button Disabled States
    const increments = [10, 25, 50, 100];
    increments.forEach((inc, i) => {
        const btn = document.getElementById(`bid-inc-${i + 1}`);
        const userDetails = teams.find(t => t.id === state.userTeam);

        if (state.auctionStatus !== "bidding" || (userDetails && userDetails.purse < (state.currentBid + inc))) {
            btn.disabled = true;
        } else {
            btn.disabled = false;
        }
    });

    // Update Simulator button look
    const simBtn = document.getElementById("btn-simulate");
    if (simBtn) {
        if (state.isAIActive) {
            simBtn.classList.add("active");
            simBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> SIM RUNNING`;
        } else {
            simBtn.classList.remove("active");
            simBtn.innerHTML = `<i class="fa-solid fa-robot"></i> RUN SIMULATOR`;
        }
    }
}

function renderPurseBoard() {
    const container = document.getElementById("purse-grid-container");
    container.innerHTML = "";

    teams.forEach(t => {
        const isUserTeam = t.id === state.userTeam;
        const purseCard = document.createElement("div");
        purseCard.className = `purse-card team-${t.id}`;
        purseCard.innerHTML = `
            <div class="team-header-row">
                <span class="team-badge team-txt-${t.id}">${t.name}</span>
                ${isUserTeam ? '<span class="team-user-indicator">USER</span>' : ''}
            </div>
            <div class="purse-amt">${formatCurrency(t.purse)}</div>
            <div class="slots-bar">
                <span>Slots: <span class="slots-indicator">${t.slots}</span></span>
                <span>OS: <span class="slots-indicator">${t.foreign}/8</span></span>
                <span>RTM: <span class="slots-indicator">${t.rtmCards}</span></span>
            </div>
        `;
        container.appendChild(purseCard);
    });
}

function renderCatalog() {
    const container = document.getElementById("catalog-container");
    container.innerHTML = "";

    // Filters
    let filtered = players;

    // Filter by tab
    if (state.selectedTab !== "all") {
        if (state.selectedTab === "sold" || state.selectedTab === "unsold") {
            filtered = players.filter(p => p.status === state.selectedTab);
        } else {
            filtered = players.filter(p => p.role === state.selectedTab && p.status === "available");
        }
    }

    // Filter by search Query
    if (state.searchQuery) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(state.searchQuery));
    }

    if (filtered.length === 0) {
        container.innerHTML = `<div class="log-empty-msg" style="grid-column: 1/-1; padding-top: 20px;">No players match criteria.</div>`;
        return;
    }

    filtered.forEach(p => {
        const activeClass = p.id === players[state.currentPlayerIndex].id ? "active-selected" : "";
        const card = document.createElement("div");
        card.className = `catalog-card ${activeClass}`;
        card.setAttribute("data-id", p.id);

        let statusHtml = "";
        if (p.status === "sold") {
            statusHtml = `
                <span class="catalog-status-lbl sold-lbl">SOLD</span>
                <span class="catalog-buyer team-txt-${p.winningTeam}">${p.winningTeam} (${formatCurrency(p.winningPrice)})</span>
            `;
        } else if (p.status === "unsold") {
            statusHtml = `<span class="catalog-status-lbl unsold-lbl">UNSOLD</span>`;
        } else {
            statusHtml = `
                <span class="catalog-status-lbl available-lbl">AVAILABLE</span>
                <span class="catalog-price">Base: ${formatCurrency(p.price)}</span>
            `;
        }

        card.innerHTML = `
            <div class="catalog-header-flex">
                <img class="catalog-avatar" src="https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(p.name)}" alt="${p.name}">
                <div class="catalog-text-details">
                    <span class="catalog-role" style="background-color: ${getRoleColor(p.role)}20; color: ${getRoleColor(p.role)}">${p.role}</span>
                    <div class="catalog-name" style="margin-top: 5px;">${p.name}</div>
                </div>
            </div>
            <div class="catalog-status-bar">
                ${statusHtml}
            </div>
        `;

        card.addEventListener("click", () => {
            if (state.auctionStatus === "bidding") {
                if (confirm("Choose this player? Bidding in progress will be abandoned.")) {
                    loadPlayer(players.findIndex(x => x.id === p.id));
                }
            } else {
                loadPlayer(players.findIndex(x => x.id === p.id));
            }
        });

        container.appendChild(card);
    });
}

function highlightCatalogCard(playerId) {
    document.querySelectorAll(".catalog-card").forEach(c => {
        c.classList.remove("active-selected");
        if (parseInt(c.getAttribute("data-id")) === playerId) {
            c.classList.add("active-selected");
        }
    });
}

function updateTabCounts() {
    document.getElementById("count-all").innerText = players.filter(p => p.status === "available").length;
    document.getElementById("count-bat").innerText = players.filter(p => p.role === "batsman" && p.status === "available").length;
    document.getElementById("count-bowl").innerText = players.filter(p => p.role === "bowler" && p.status === "available").length;
    document.getElementById("count-wk").innerText = players.filter(p => p.role === "wicketkeeper" && p.status === "available").length;
    document.getElementById("count-ar").innerText = players.filter(p => p.role === "allrounder" && p.status === "available").length;
    document.getElementById("count-sold").innerText = players.filter(p => p.status === "sold").length;
    document.getElementById("count-unsold").innerText = players.filter(p => p.status === "unsold").length;
}

// 12. Log & Formatting Helpers
function logMessage(message, type = "info") {
    const logList = document.getElementById("log-list");
    const emptyMsg = logList.querySelector(".log-empty-msg");
    if (emptyMsg) {
        emptyMsg.remove();
    }

    const item = document.createElement("div");
    item.className = `log-item ${type}`;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    item.innerHTML = `
        <div class="log-meta">
            <span>[${timeStr}]</span>
            <span style="text-transform: uppercase;">${type}</span>
        </div>
        <div class="log-msg">${message}</div>
    `;

    logList.appendChild(item);
    logList.scrollTop = logList.scrollHeight; // Auto Scroll
}

function clearLogs() {
    const logList = document.getElementById("log-list");
    logList.innerHTML = `<div class="log-empty-msg">Waiting for the auction to initiate...</div>`;
}

function resetAllAuctions() {
    if (confirm("Are you sure you want to reset the session? All purchases and team budgets will be rolled back!")) {
        localStorage.removeItem("ipl_auction_arena_state");
        players.forEach(p => {
            p.status = "available";
            p.winningPrice = 0;
            p.winningTeam = "";
        });
        teams.forEach(t => {
            t.purse = 10000;
            t.slots = 0;
            t.foreign = 0;
        });

        state.currentPlayerIndex = 0;
        state.currentBid = 0;
        state.currentBidder = null;
        state.auctionStatus = "idle";
        state.timerVal = state.defaultTimerVal;
        if (state.isAIActive) toggleSimulation(); // turn off AI

        clearLogs();
        initApp();
        logMessage("Auction board database has been successfully reset.", "info");
    }
}

function formatCurrency(valLakhs) {
    if (valLakhs === 0) return "₹0";
    if (valLakhs >= 100) {
        const crValue = (valLakhs / 100).toFixed(2);
        // remove trailing decimal zeroes
        return `₹${crValue.replace(/\.00$/, '')} Cr`;
    }
    return `₹${valLakhs} Lakhs`;
}

function getRoleIcon(role) {
    switch (role) {
        case "batsman": return "fa-cricket-bat-ball";
        case "bowler": return "fa-baseball";
        case "allrounder": return "fa-shield-halved";
        case "wicketkeeper": return "fa-hand-back-fist";
        default: return "fa-user-tie";
    }
}

function getRoleColor(role) {
    switch (role) {
        case "batsman": return "#1e88e5"; // blue
        case "bowler": return "#e53935"; // red
        case "allrounder": return "#43a047"; // green
        case "wicketkeeper": return "#ffb300"; // gold/orange
        default: return "var(--text-secondary)";
    }
}

// 13. HTML5 synthesized audio effects using Web Audio API
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playSfxBeep(freq = 440, duration = 0.1) {
    if (!state.soundEnabled) return;
    try {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.frequency.value = freq;
        osc.type = 'triangle';

        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
        console.warn("Audio Context Error", e);
    }
}

function playSfxGavel() {
    if (!state.soundEnabled) return;
    try {
        initAudio();
        // Synthesizing a gavel drop (wood strike) combined frequencies
        const now = audioCtx.currentTime;

        // Low thump oscillator
        const oscLow = audioCtx.createOscillator();
        const gainLow = audioCtx.createGain();
        oscLow.connect(gainLow);
        gainLow.connect(audioCtx.destination);

        oscLow.frequency.setValueAtTime(150, now);
        oscLow.frequency.exponentialRampToValueAtTime(40, now + 0.15);
        oscLow.type = 'triangle';

        gainLow.gain.setValueAtTime(0.4, now);
        gainLow.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        oscLow.start();
        oscLow.stop(now + 0.15);

        // High wood click oscillator
        const oscHigh = audioCtx.createOscillator();
        const gainHigh = audioCtx.createGain();
        oscHigh.connect(gainHigh);
        gainHigh.connect(audioCtx.destination);

        oscHigh.frequency.setValueAtTime(800, now);
        oscHigh.frequency.exponentialRampToValueAtTime(200, now + 0.05);
        oscHigh.type = 'sine';

        gainHigh.gain.setValueAtTime(0.15, now);
        gainHigh.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        oscHigh.start();
        oscHigh.stop(now + 0.05);
    } catch (e) { }
}

function playSfxDoubleTap() {
    playSfxGavel();
    setTimeout(() => {
        playSfxGavel();
    }, 180);
}

function playSfxSold() {
    if (!state.soundEnabled) return;
    playSfxDoubleTap();
    // Synthesis of standard buzzer/synth fanfare victory chimes
    setTimeout(() => {
        try {
            initAudio();
            const now = audioCtx.currentTime;

            // simple arpeggio
            const melody = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            melody.forEach((note, index) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.type = 'square';
                osc.frequency.setValueAtTime(note, now + index * 0.12);

                gain.gain.setValueAtTime(0.04, now + index * 0.12);
                gain.gain.setValueAtTime(0.04, now + index * 0.12 + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.12 + 0.2);

                osc.start(now + index * 0.12);
                osc.stop(now + index * 0.12 + 0.2);
            });
        } catch (e) { }
    }, 450);
}

// 14. Session Cache Handlers
function saveStateToStorage() {
    const data = {
        players: players,
        teams: teams,
        currentPlayerIndex: state.currentPlayerIndex,
        userTeam: state.userTeam,
        auctionMode: state.auctionMode
    };
    localStorage.setItem("ipl_auction_arena_state", JSON.stringify(data));
}

function loadStateFromStorage() {
    const cache = localStorage.getItem("ipl_auction_arena_state");
    if (cache) {
        try {
            const data = JSON.parse(cache);
            if (data && data.auctionMode) {
                state.auctionMode = data.auctionMode;
            } else {
                state.auctionMode = "IPL";
            }

            // Sync mode selector value
            const modeSelect = document.getElementById("auction-mode-select");
            if (modeSelect) modeSelect.value = state.auctionMode;

            // Re-render label for franchise/country name
            const label = document.querySelector(".user-team-selector label");
            if (label) {
                label.innerText = state.auctionMode === "IPL" ? "YOUR FRANCHISE:" : "YOUR NATION:";
            }

            if (data && Array.isArray(data.players) && data.players.length > 0) {
                players = data.players;
            }

            // Initialize teams structure based on mode
            if (state.auctionMode === "INT") {
                teams = defaultIntTeams.map(t => ({ ...t, rtmCards: 3 }));
            } else {
                teams = defaultIplTeams.map(t => ({ ...t, rtmCards: 3 }));
            }

            if (data && Array.isArray(data.teams) && data.teams.length > 0) {
                teams = data.teams.map(t => {
                    const match = teams.find(x => x.id === t.id);
                    return {
                        ...t,
                        rtmCards: typeof t.rtmCards === "number" ? t.rtmCards : 3,
                        strategy: t.strategy || (match ? match.strategy : "balanced")
                    };
                });
            }
            if (data && typeof data.currentPlayerIndex === "number" && data.currentPlayerIndex < players.length) {
                state.currentPlayerIndex = data.currentPlayerIndex;
            }
            if (data && data.userTeam) {
                state.userTeam = data.userTeam;
            }

            repopulateUserTeamSelector();
        } catch (e) {
            console.error("Localstorage recovery failed", e);
            localStorage.removeItem("ipl_auction_arena_state");
        }
    } else {
        repopulateUserTeamSelector();
    }
}

function resetAuctionForMode(mode) {
    localStorage.removeItem("ipl_auction_arena_state");

    // Clear active timers/timeouts
    if (state.aiTimeoutId) clearTimeout(state.aiTimeoutId);
    if (state.aiThinkingTimeoutId) clearTimeout(state.aiThinkingTimeoutId);
    resetTimer();

    // Set default team settings based on mode
    if (mode === "INT") {
        teams = defaultIntTeams.map(t => ({ ...t, rtmCards: 3 }));
        state.userTeam = "IND";
    } else {
        teams = defaultIplTeams.map(t => ({ ...t, rtmCards: 3 }));
        state.userTeam = "MI";
    }

    // Set label text
    const label = document.querySelector(".user-team-selector label");
    if (label) {
        label.innerText = mode === "IPL" ? "YOUR FRANCHISE:" : "YOUR NATION:";
    }

    // Reset player statuses
    players.forEach(p => {
        p.status = "available";
        p.winningPrice = 0;
        p.winningTeam = "";
    });

    state.currentPlayerIndex = 0;
    state.currentBid = 0;
    state.currentBidder = null;
    state.auctionStatus = "idle";
    state.timerVal = state.defaultTimerVal;

    repopulateUserTeamSelector();
    clearLogs();
    renderPurseBoard();
    renderCatalog();
    loadPlayer(0);
    updateUIElements();
    logMessage(`Switched to <strong>${mode === "IPL" ? "IPL Franchise Mode" : "International Clash Mode"}</strong>.`, "info");
}

function repopulateUserTeamSelector() {
    const dropdown = document.getElementById("user-team-select");
    if (!dropdown) return;
    dropdown.innerHTML = "";
    teams.forEach(t => {
        const option = document.createElement("option");
        option.value = t.id;
        option.innerText = `${t.name} (${t.id})`;
        if (t.id === state.userTeam) {
            option.selected = true;
        }
        dropdown.appendChild(option);
    });
}
