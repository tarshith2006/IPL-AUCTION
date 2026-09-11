const fs = require('fs');
const path = require('path');

// 1. Define seeds (existing 35 players + 15 more top stars for a total of 50 seeds)
const seedPlayers = [
    { name: "Virat Kohli", role: "batsman", country: "🇮🇳 IND", price: 200, rating: 95, matches: 244, primaryStat: "7,800 Runs", secondaryStat: "130.6 SR" },
    { name: "Jasprit Bumrah", role: "bowler", country: "🇮🇳 IND", price: 200, rating: 97, matches: 133, primaryStat: "155 Wkts", secondaryStat: "7.30 Econ" },
    { name: "MS Dhoni", role: "wicketkeeper", country: "🇮🇳 IND", price: 200, rating: 92, matches: 250, primaryStat: "5,082 Runs", secondaryStat: "135.9 SR" },
    { name: "Hardik Pandya", role: "allrounder", country: "🇮🇳 IND", price: 200, rating: 91, matches: 128, primaryStat: "2,350 Runs", secondaryStat: "58 Wkts" },
    { name: "Glenn Maxwell", role: "allrounder", country: "🇦🇺 AUS", price: 150, rating: 89, matches: 130, primaryStat: "2,719 Runs", secondaryStat: "36 Wkts" },
    { name: "Heinrich Klaasen", role: "wicketkeeper", country: "🇿🇦 RSA", price: 150, rating: 93, matches: 30, primaryStat: "940 Runs", secondaryStat: "172.5 SR" },
    { name: "Rashid Khan", role: "bowler", country: "🇦🇫 AFG", price: 150, rating: 94, matches: 115, primaryStat: "145 Wkts", secondaryStat: "6.67 Econ" },
    { name: "Travis Head", role: "batsman", country: "🇦🇺 AUS", price: 200, rating: 92, matches: 28, primaryStat: "850 Runs", secondaryStat: "168.9 SR" },
    { name: "Sunil Narine", role: "allrounder", country: "🌴 WI", price: 150, rating: 90, matches: 170, primaryStat: "1,550 Runs", secondaryStat: "174 Wkts" },
    { name: "Rohit Sharma", role: "batsman", country: "🇮🇳 IND", price: 200, rating: 93, matches: 247, primaryStat: "6,211 Runs", secondaryStat: "130.3 SR" },
    { name: "Mitchell Starc", role: "bowler", country: "🇦🇺 AUS", price: 150, rating: 88, matches: 40, primaryStat: "52 Wkts", secondaryStat: "8.10 Econ" },
    { name: "Nicholas Pooran", role: "wicketkeeper", country: "🌴 WI", price: 100, rating: 90, matches: 75, primaryStat: "1,850 Runs", secondaryStat: "159.2 SR" },
    { name: "Pat Cummins", role: "allrounder", country: "🇦🇺 AUS", price: 200, rating: 91, matches: 54, primaryStat: "55 Wkts", secondaryStat: "8.25 Econ" },
    { name: "Yuzvendra Chahal", role: "bowler", country: "🇮🇳 IND", price: 100, rating: 89, matches: 149, primaryStat: "187 Wkts", secondaryStat: "7.70 Econ" },
    { name: "Rinku Singh", role: "batsman", country: "🇮🇳 IND", price: 50, rating: 87, matches: 42, primaryStat: "890 Runs", secondaryStat: "142.1 SR" },
    { name: "Babar Azam", role: "batsman", country: "🇵🇰 PAK", price: 150, rating: 92, matches: 120, primaryStat: "4,100 Runs", secondaryStat: "129.4 SR" },
    { name: "Shaheen Afridi", role: "bowler", country: "🇵🇰 PAK", price: 150, rating: 91, matches: 66, primaryStat: "95 Wkts", secondaryStat: "7.62 Econ" },
    { name: "Mohammad Rizwan", role: "wicketkeeper", country: "🇵🇰 PAK", price: 100, rating: 89, matches: 98, primaryStat: "3,200 Runs", secondaryStat: "127.8 SR" },
    { name: "Jos Buttler", role: "wicketkeeper", country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 ENG", price: 150, rating: 93, matches: 114, primaryStat: "3,300 Runs", secondaryStat: "144.6 SR" },
    { name: "Sam Curran", role: "allrounder", country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 ENG", price: 150, rating: 88, matches: 50, primaryStat: "810 Runs", secondaryStat: "46 Wkts" },
    { name: "Harry Brook", role: "batsman", country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 ENG", price: 100, rating: 89, matches: 30, primaryStat: "920 Runs", secondaryStat: "145.8 SR" },
    { name: "Kagiso Rabada", role: "bowler", country: "🇿🇦 RSA", price: 150, rating: 90, matches: 80, primaryStat: "106 Wkts", secondaryStat: "8.05 Econ" },
    { name: "Quinton de Kock", role: "wicketkeeper", country: "🇿🇦 RSA", price: 100, rating: 88, matches: 96, primaryStat: "3,100 Runs", secondaryStat: "135.2 SR" },
    { name: "Kane Williamson", role: "batsman", country: "🇳🇿 NZ", price: 100, rating: 87, matches: 89, primaryStat: "2,580 Runs", secondaryStat: "122.5 SR" },
    { name: "Trent Boult", role: "bowler", country: "🇳🇿 NZ", price: 100, rating: 90, matches: 88, primaryStat: "105 Wkts", secondaryStat: "7.88 Econ" },
    { name: "Mitchell Santner", role: "allrounder", country: "🇳🇿 NZ", price: 100, rating: 87, matches: 99, primaryStat: "670 Runs", secondaryStat: "32 Wkts" },
    { name: "Andre Russell", role: "allrounder", country: "🌴 WI", price: 200, rating: 91, matches: 120, primaryStat: "2,440 Runs", secondaryStat: "102 Wkts" },
    { name: "Alzarri Joseph", role: "bowler", country: "🌴 WI", price: 50, rating: 85, matches: 30, primaryStat: "38 Wkts", secondaryStat: "8.65 Econ" },
    { name: "Wanindu Hasaranga", role: "allrounder", country: "🇱🇰 SL", price: 150, rating: 90, matches: 58, primaryStat: "610 Runs", secondaryStat: "91 Wkts" },
    { name: "Matheesha Pathirana", role: "bowler", country: "🇱🇰 SL", price: 100, rating: 89, matches: 20, primaryStat: "34 Wkts", secondaryStat: "7.92 Econ" },
    { name: "Shakib Al Hasan", role: "allrounder", country: "🇧🇩 BAN", price: 100, rating: 88, matches: 115, primaryStat: "2,400 Runs", secondaryStat: "140 Wkts" },
    { name: "Mustafizur Rahman", role: "bowler", country: "🇧🇩 BAN", price: 100, rating: 87, matches: 90, primaryStat: "120 Wkts", secondaryStat: "7.95 Econ" },
    { name: "Devon Conway", role: "batsman", country: "🇳🇿 NZ", price: 150, rating: 90, matches: 33, primaryStat: "1,250 Runs", secondaryStat: "135.0 SR" },
    { name: "Jofra Archer", role: "bowler", country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 ENG", price: 100, rating: 88, matches: 40, primaryStat: "48 Wkts", secondaryStat: "7.75 Econ" },
    { name: "Phil Salt", role: "wicketkeeper", country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 ENG", price: 100, rating: 89, matches: 32, primaryStat: "890 Runs", secondaryStat: "166.4 SR" },
    // 15 additional real players to make it 50 seeds
    { name: "Shubman Gill", role: "batsman", country: "🇮🇳 IND", price: 200, rating: 91, matches: 91, primaryStat: "3,200 Runs", secondaryStat: "135.2 SR" },
    { name: "Yashasvi Jaiswal", role: "batsman", country: "🇮🇳 IND", price: 150, rating: 90, matches: 37, primaryStat: "1,170 Runs", secondaryStat: "150.3 SR" },
    { name: "Suryakumar Yadav", role: "batsman", country: "🇮🇳 IND", price: 200, rating: 93, matches: 139, primaryStat: "3,250 Runs", secondaryStat: "143.5 SR" },
    { name: "Rishabh Pant", role: "wicketkeeper", country: "🇮🇳 IND", price: 200, rating: 91, matches: 98, primaryStat: "2,830 Runs", secondaryStat: "148.5 SR" },
    { name: "Ravindra Jadeja", role: "allrounder", country: "🇮🇳 IND", price: 200, rating: 92, matches: 226, primaryStat: "2,720 Runs", secondaryStat: "152 Wkts" },
    { name: "Mohammed Shami", role: "bowler", country: "🇮🇳 IND", price: 150, rating: 91, matches: 110, primaryStat: "127 Wkts", secondaryStat: "8.12 Econ" },
    { name: "Kuldeep Yadav", role: "bowler", country: "🇮🇳 IND", price: 100, rating: 90, matches: 73, primaryStat: "87 Wkts", secondaryStat: "7.80 Econ" },
    { name: "David Warner", role: "batsman", country: "🇦🇺 AUS", price: 150, rating: 89, matches: 176, primaryStat: "6,400 Runs", secondaryStat: "139.8 SR" },
    { name: "Marcus Stoinis", role: "allrounder", country: "🇦🇺 AUS", price: 150, rating: 88, matches: 82, primaryStat: "1,450 Runs", secondaryStat: "39 Wkts" },
    { name: "Adam Zampa", role: "bowler", country: "🇦🇺 AUS", price: 150, rating: 90, matches: 20, primaryStat: "29 Wkts", secondaryStat: "7.75 Econ" },
    { name: "Liam Livingstone", role: "allrounder", country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 ENG", price: 150, rating: 88, matches: 39, primaryStat: "850 Runs", secondaryStat: "11 Wkts" },
    { name: "Aiden Markram", role: "allrounder", country: "🇿🇦 RSA", price: 150, rating: 89, matches: 33, primaryStat: "780 Runs", secondaryStat: "10 Wkts" },
    { name: "Rachin Ravindra", role: "allrounder", country: "🇳🇿 NZ", price: 100, rating: 88, matches: 18, primaryStat: "530 Runs", secondaryStat: "7 Wkts" },
    { name: "Daryl Mitchell", role: "allrounder", country: "🇳🇿 NZ", price: 150, rating: 89, matches: 28, primaryStat: "720 Runs", secondaryStat: "8 Wkts" },
    { name: "Rahmanullah Gurbaz", role: "wicketkeeper", country: "🇦🇫 AFG", price: 100, rating: 87, matches: 28, primaryStat: "640 Runs", secondaryStat: "133.8 SR" }
];

// Names database by country for generated players
const db = {
    "🇮🇳 IND": {
        first: ["Amit", "Rahul", "Sandeep", "Vijay", "Anil", "Sunil", "Prithvi", "Shivam", "Nitesh", "Harshit", "Ramandeep", "Vaibhav", "Tushar", "Arshdeep", "Mukesh", "Avesh", "Khaleel", "Ravi", "Varun", "Krunal", "Axar", "Deepak", "Shardul", "Prasidh", "Umesh", "Bhuvneshwar", "Ruturaj", "Ishan", "Jitesh", "Sai", "Venkatesh", "Abhishek", "Tilak", "Dhruv", "Sarfaraz", "Ishani", "Devdutt", "Priyam", "Mayank", "Nikhil", "Manish", "Krunal", "Kedar", "Vijay", "Washington", "Riyan", "Ravi", "Sanju", "Dinesh", "Ajinkya", "Cheteshwar"],
        last: ["Sharma", "Kohli", "Pandya", "Yadav", "Pant", "Iyer", "Samson", "Gill", "Jaiswal", "Jurel", "Khan", "Singh", "Reddy", "Rana", "Chavda", "Chahar", "Thakur", "Krishna", "Kumar", "Chahal", "Bishnoi", "Bumrah", "Shami", "Siraj", "Sen", "Mavi", "Arora", "Deshpande", "Chaudhary", "Tyagi", "Gopal", "Tewatia", "Sundar", "Patel", "Dubey", "Gaikwad", "Kishan", "Sudharsan", "Nair", "Dube", "Parag", "Ashwin", "Jadeja", "Karthik", "Rahane", "Pujara", "Prasad"]
    },
    "🇦🇺 AUS": {
        first: ["Steve", "David", "Mitchell", "Pat", "Glenn", "Travis", "Marcus", "Matthew", "Josh", "Adam", "Cameron", "Aaron", "Tim", "Nathan", "Alex", "Jake", "Spencer", "Lance", "Cooper", "Jhye", "Daniel", "Sean", "Ben", "Peter", "Chris", "Ashton", "Jason", "Riley", "Tanveer", "Wes", "Nathan", "Xavier", "Chris", "Hilton", "Kane", "Billy"],
        last: ["Smith", "Warner", "Marsh", "Cummins", "Maxwell", "Head", "Stoinis", "Wade", "Hazlewood", "Zampa", "Green", "Finch", "David", "Lyon", "Carey", "Fraser-McGurk", "Johnson", "Morris", "Connolly", "Richardson", "Sams", "Abbott", "McDermott", "Handscomb", "Lynn", "Agar", "Behrendorff", "Meredith", "Sangha", "Short", "Ellis", "Bartlett", "Green", "Cartwright", "Richardson", "Stanlake"]
    },
    "🏴󠁧󠁢󠁥󠁮󠁧󠁿 ENG": {
        first: ["Jos", "Ben", "Harry", "Joe", "Jonny", "Liam", "Sam", "Chris", "Adil", "Mark", "Jofra", "Reece", "Phil", "Will", "Gus", "Tom", "Jamie", "Luke", "Olly", "Jack", "Dan", "Brydon", "Jordan", "Alex", "Dawid", "Moeen", "Jason", "Craig", "Mason", "Saqib", "Matthew"],
        last: ["Buttler", "Stokes", "Brook", "Root", "Bairstow", "Livingstone", "Curran", "Woakes", "Rashid", "Wood", "Archer", "Topley", "Salt", "Jacks", "Atkinson", "Overton", "Smith", "Stone", "Leach", "Lawrence", "Carse", "Cox", "Hales", "Malan", "Ali", "Roy", "Overton", "Crane", "Mahmood", "Potts", "Duckett"]
    },
    "🇿🇦 RSA": {
        first: ["Quinton", "Aiden", "David", "Heinrich", "Kagiso", "Anrich", "Lungi", "Tabraiz", "Marco", "Tristan", "Gerald", "Nandre", "Reeza", "Ryan", "Keshav", "Bjorn", "Wiaan", "Donovan", "Ottniel", "Tony", "Matthew", "Dewald", "Kwena", "Lizaad", "Wayne"],
        last: ["de Kock", "Markram", "Miller", "Klaasen", "Rabada", "Nortje", "Ngidi", "Shamsi", "Jansen", "Stubbs", "Coetzee", "Burger", "Hendricks", "Rickelton", "Maharaj", "Fortuin", "Mulder", "Ferreira", "Baartman", "de Zorzi", "Breetzke", "Brevis", "Maphaka", "Williams", "Parnell"]
    },
    "🇵🇰 PAK": {
        first: ["Babar", "Shaheen", "Mohammad", "Haris", "Naseem", "Shadab", "Fakhar", "Imad", "Iftikhar", "Usama", "Saim", "Azam", "Abrar", "Zaman", "Abbas", "Salman", "Tayyab", "Saud", "Kamran", "Wahab", "Hasan", "Sarfaraz", "Shoaib", "Asif", "Faheem"],
        last: ["Azam", "Afridi", "Rizwan", "Rauf", "Shah", "Khan", "Zaman", "Wasim", "Ahmed", "Mir", "Ayub", "Ali", "Tahir", "Shakeel", "Akmal", "Riaz", "Ali", "Ahmed", "Malik", "Ali", "Ashraf"]
    },
    "🇳🇿 NZ": {
        first: ["Kane", "Trent", "Devon", "Mitchell", "Daryl", "Glenn", "Rachin", "Lockie", "Tim", "Ish", "Matt", "Finn", "Michael", "Mark", "Tom", "Will", "Jimmy", "Kyle", "Ajaz", "Ben", "Blair", "Henry", "Jacob", "Dean"],
        last: ["Williamson", "Boult", "Conway", "Santner", "Mitchell", "Phillips", "Ravindra", "Ferguson", "Southee", "Sodhi", "Henry", "Allen", "Bracewell", "Chapman", "Latham", "Young", "Neesham", "Jamieson", "Patel", "Sears", "Tickner", "Shipley", "Duffy", "Foxcroft"]
    },
    "🌴 WI": {
        first: ["Andre", "Nicholas", "Sunil", "Jason", "Rovman", "Alzarri", "Shimron", "Kyle", "Sherfane", "Akeal", "Shamar", "Romario", "Odean", "Brandon", "Shai", "Johnson", "Roston", "Obed", "Gudakesh", "Hayden", "Fabian", "Oshane", "Keemo", "Sheldon", "Kieron"],
        last: ["Russell", "Pooran", "Narine", "Holder", "Powell", "Joseph", "Hetmyer", "Mayers", "Rutherford", "Hosein", "Joseph", "Shepherd", "Smith", "King", "Hope", "Charles", "Chase", "McCoy", "Motie", "Walsh", "Allen", "Thomas", "Paul", "Cottrell", "Pollard"]
    },
    "🇱🇰 SL": {
        first: ["Wanindu", "Matheesha", "Kusal", "Charith", "Sadeera", "Pathum", "Maheesh", "Dilshan", "Dasun", "Dushmantha", "Lahiru", "Dunith", "Kamindu", "Avishka", "Bhanuka", "Jeffrey", "Kasun", "Pramod", "Binura", "Asitha"],
        last: ["Hasaranga", "Pathirana", "Mendis", "Asalanka", "Samarawickrama", "Nissanka", "Theekshana", "Madushanka", "Shanaka", "Chameera", "Kumara", "Wellalage", "Fernando", "Rajapaksa", "Vandersay", "Rajitha", "Madushan", "Fernando", "Fernando"]
    },
    "🇦🇫 AFG": {
        first: ["Rashid", "Mohammad", "Rahmanullah", "Fazalhaq", "Mujeeb", "Naveen-ul-Haq", "Azmatullah", "Gulbadin", "Najibullah", "Karim", "Hazratullah", "Noor", "Fareed", "Nangeyalia", "Qais", "Darwish", "Riaz", "Bilal"],
        last: ["Khan", "Nabi", "Gurbaz", "Farooqi", "ur Rahman", "Murid", "Omarzai", "Naib", "Zadran", "Janat", "Zazai", "Ahmad", "Malik", "Kharote", "Ahmad", "Rasooli", "Hassan", "Sami"]
    },
    "🇧🇩 BAN": {
        first: ["Shakib", "Mustafizur", "Litton", "Taskin", "Shoriful", "Towhid", "Mehidy", "Najmul", "Soumya", "Tanzid", "Mahedi", "Rishad", "Jaker", "Anamul", "Mahmudullah", "Mushfiqur", "Mustafiz", "Tamim", "Afif"],
        last: ["Al Hasan", "Rahman", "Das", "Ahmed", "Islam", "Hridoy", "Hasan", "Shanto", "Sarkar", "Hossain", "Ali", "Haque", "Riyad", "Rahim", "Rahman", "Iqbal", "Hossain"]
    },
    "USA/Assoc": {
        first: ["Saurabh", "Monank", "Aaron", "Corey", "Paul", "Josh", "Mark", "Harry", "Scott", "Bas", "Max", "Sandeep", "Dipendra", "Kushal", "Sikandar", "Sean", "Richard", "Ryan", "Brandon", "Gerhard"],
        last: ["Netravalkar", "Patel", "Jones", "Anderson", "Stirling", "Little", "Adair", "Tector", "Edwards", "de Leede", "O'Dowd", "Lamichhane", "Singh", "Bhurtel", "Raza", "Williams", "Ngarava", "Burl", "McMullen", "Erasmus"],
        countries: ["🇺🇸 USA", "🇮🇪 IRE", "🇳🇱 NED", "🇳🇵 NEP", "🇿🇼 ZIM", "󠁳󠁣󠁴󠁿 SCO", "🇳🇦 NAM"]
    }
};

// Generate list
const finalPlayers = [];
const usedNames = new Set(seedPlayers.map(p => p.name));

// Add the seeds first
seedPlayers.forEach((p, idx) => {
    let scaledPrice = p.price;
    if (p.price === 200) scaledPrice = 100;
    else if (p.price === 150) scaledPrice = 75;
    else if (p.price === 100) scaledPrice = 50;
    else if (p.price === 50) scaledPrice = 30;

    finalPlayers.push({
        id: idx + 1,
        name: p.name,
        role: p.role,
        country: p.country,
        price: scaledPrice,
        rating: p.rating,
        matches: p.matches,
        primaryStat: p.primaryStat,
        secondaryStat: p.secondaryStat,
        status: "available",
        winningPrice: 0,
        winningTeam: "",
        imageClass: `avatar-${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
    });
});

const roles = ["batsman", "bowler", "allrounder", "wicketkeeper"];
// Role weight distribution to make it balanced
// batsman: ~30%, bowler: ~34%, allrounder: ~26%, wicketkeeper: ~10%
function getRandomRole() {
    const r = Math.random();
    if (r < 0.30) return "batsman";
    if (r < 0.64) return "bowler";
    if (r < 0.90) return "allrounder";
    return "wicketkeeper";
}

const countryKeys = [
    "🇮🇳 IND", "🇮🇳 IND", "🇮🇳 IND", "🇮🇳 IND", "🇮🇳 IND", // Weight India heavily (50%)
    "🇦🇺 AUS", "🏴󠁧󠁢󠁥󠁮󠁧󠁿 ENG", "🇿🇦 RSA", "🇵🇰 PAK", "🇳🇿 NZ", "🌴 WI", "🇱🇰 SL", "🇦🇫 AFG", "🇧🇩 BAN", "USA/Assoc"
];

// Generate until 500
while (finalPlayers.length < 500) {
    const countryKey = countryKeys[Math.floor(Math.random() * countryKeys.length)];
    let country = countryKey;
    let listKey = countryKey;

    if (countryKey === "USA/Assoc") {
        listKey = "USA/Assoc";
        const cList = db["USA/Assoc"].countries;
        country = cList[Math.floor(Math.random() * cList.length)];
    }

    const firstNames = db[listKey].first;
    const lastNames = db[listKey].last;

    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${first} ${last}`;

    if (usedNames.has(name)) {
        continue; // skip duplicate names
    }

    usedNames.add(name);

    const role = getRandomRole();

    // Rating distribution
    let rating = 75;
    const r = Math.random();
    if (r < 0.05) {
        // Elite 5%
        rating = Math.floor(Math.random() * 8) + 90; // 90-97
    } else if (r < 0.35) {
        // High 30%
        rating = Math.floor(Math.random() * 5) + 85; // 85-89
    } else if (r < 0.85) {
        // Medium 50%
        rating = Math.floor(Math.random() * 5) + 80; // 80-84
    } else {
        // Low 15%
        rating = Math.floor(Math.random() * 5) + 75; // 75-79
    }

    // Base price in Lakhs
    let price = 20;
    if (rating >= 92) price = 100;
    else if (rating >= 88) price = 75;
    else if (rating >= 84) price = 50;
    else if (rating >= 80) price = 30;
    else price = 20;

    const matches = Math.floor(Math.random() * 140) + 10; // 10 to 150 matches

    let primaryStat = "";
    let secondaryStat = "";

    if (role === "batsman") {
        const runs = Math.floor(matches * (Math.random() * 25 + 18));
        const sr = (Math.random() * 30 + 125).toFixed(1);
        primaryStat = `${runs.toLocaleString()} Runs`;
        secondaryStat = `${sr} SR`;
    } else if (role === "wicketkeeper") {
        const runs = Math.floor(matches * (Math.random() * 22 + 15));
        const sr = (Math.random() * 25 + 122).toFixed(1);
        primaryStat = `${runs.toLocaleString()} Runs`;
        secondaryStat = `${sr} SR`;
    } else if (role === "bowler") {
        const wickets = Math.floor(matches * (Math.random() * 0.5 + 0.8));
        const econ = (Math.random() * 2.2 + 6.8).toFixed(2);
        primaryStat = `${wickets} Wkts`;
        secondaryStat = `${econ} Econ`;
    } else { // allrounder
        const runs = Math.floor(matches * (Math.random() * 15 + 10));
        const wickets = Math.floor(matches * (Math.random() * 0.3 + 0.4));
        primaryStat = `${runs.toLocaleString()} Runs`;
        secondaryStat = `${wickets} Wkts`;
    }

    finalPlayers.push({
        id: finalPlayers.length + 1,
        name: name,
        role: role,
        country: country,
        price: price,
        rating: rating,
        matches: matches,
        primaryStat: primaryStat,
        secondaryStat: secondaryStat,
        status: "available",
        winningPrice: 0,
        winningTeam: "",
        imageClass: `avatar-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
    });
}

// Generate the JS file content
const outputFilePath = path.join(__dirname, 'players_data.js');
let fileContent = `// IPL Auction Simulator Players Database (500 Players)
// Generated dynamically on ${new Date().toISOString()}

let players = ${JSON.stringify(finalPlayers, null, 4)};
`;

fs.writeFileSync(outputFilePath, fileContent, 'utf-8');
console.log(`Successfully generated 500 players in ${outputFilePath}`);
