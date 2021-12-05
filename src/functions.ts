async function getCard(tosolve: String[]):Promise<String> {
    return new Promise(async (resolve, reject) => {
        var solvedCard = "";
        var originalCard = tosolve.join(" ");

        let tosolvestring = tosolve
            .join("")
            .toLowerCase()
            .replace(/[^a-zA-Z0-9+]|card|play/g, ""); //  Removes everything but letters, numbers, and + symbol

        //  Replace spelt out numbers with numbers
        if (tosolvestring.match(/zero|one|two|three|four|five|six|seven|eight|nine/)) {
            if (tosolvestring.includes("zero")) tosolvestring = tosolvestring.replace(/zero/g, "0");
            else if (tosolvestring.includes("one")) tosolvestring = tosolvestring.replace(/one/g, "1");
            else if (tosolvestring.includes("two")) tosolvestring = tosolvestring.replace(/two/g, "2");
            else if (tosolvestring.includes("three")) tosolvestring = tosolvestring.replace(/three/g, "3");
            else if (tosolvestring.includes("four")) tosolvestring = tosolvestring.replace(/four/g, "4");
            else if (tosolvestring.includes("five")) tosolvestring = tosolvestring.replace(/five/g, "5");
            else if (tosolvestring.includes("six")) tosolvestring = tosolvestring.replace(/six/g, "6");
            else if (tosolvestring.includes("seven")) tosolvestring = tosolvestring.replace(/seven/g, "7");
            else if (tosolvestring.includes("eight")) tosolvestring = tosolvestring.replace(/eight/g, "8");
            else if (tosolvestring.includes("nine")) tosolvestring = tosolvestring.replace(/nine/g, "9");
        }

        //  Searches string for a color
        if (tosolvestring.includes("red")) {
            tosolvestring = tosolvestring.replace(/red/g, "");
            solvedCard += "red";
        } else if (tosolvestring.includes("green")) {
            tosolvestring = tosolvestring.replace(/green/g, "");
            solvedCard += "green";
        } else if (tosolvestring.includes("blue")) {
            tosolvestring = tosolvestring.replace(/blue/g, "");
            solvedCard += "blue";
        } else if (tosolvestring.includes("yellow")) {
            tosolvestring = tosolvestring.replace(/yellow/g, "");
            solvedCard += "yellow";
        }

        //  Check for abbreviated colors
        if (solvedCard == "") {
            if (tosolvestring.startsWith("r") && !tosolvestring.startsWith("rev")) {
                solvedCard += "red";
                tosolvestring = tosolvestring.substring(1);
                if (tosolvestring.startsWith("ed")) tosolvestring = tosolvestring.substring(2);
            } else if (tosolvestring.startsWith("g")) {
                solvedCard += "green";
                tosolvestring = tosolvestring.substring(1);
                if (tosolvestring.startsWith("reen")) tosolvestring = tosolvestring.substring(4);
            } else if (tosolvestring.startsWith("b")) {
                solvedCard += "blue";
                tosolvestring = tosolvestring.substring(1);
                if (tosolvestring.startsWith("lue")) tosolvestring = tosolvestring.substring(3);
            } else if (tosolvestring.startsWith("y")) {
                solvedCard += "yellow";
                tosolvestring = tosolvestring.substring(1);
                if (tosolvestring.startsWith("ellow")) tosolvestring = tosolvestring.substring(5);
            }
        }

        //  Searches string for numbers
        if (tosolvestring.match(/[0-9]/g)) {
            if (tosolvestring.match(/(\+2)|(draw2)|(d2)|(plus2)|(p2)/)) {
                tosolvestring = tosolvestring.replace(/(\+2)|(draw2)|(d2)|(plus2)|(p2)/g, "");
                solvedCard += "draw2";
            } else if (tosolvestring.match(/(\+4)|(w\+4)|(wildraw4)|(draw4)|(d4)|wild4|(w4)|(plus4)|(p4)|(wild)/)) {
                tosolvestring = tosolvestring.replace(
                    /(\+4)|(w\+4)|(wildraw4)|(draw4)|(d4)|wild4|(w4)|(plus4)|(p4)|(wild)/g,
                    ""
                );
                solvedCard += "wilddraw4";
            } else {
                solvedCard += tosolvestring.match(/[0-9]/);
                tosolvestring = tosolvestring.replace(/[0-9]/g, "");
            }
        }

        //  If no number is found, look for skip, reverse, or wild cards
        else {
            if (tosolvestring.startsWith("s")) {
                solvedCard += "skip";
                tosolvestring = tosolvestring.substring(1);
                if (tosolvestring.startsWith("kip")) tosolvestring = tosolvestring.substring(3);
            } else if (tosolvestring.startsWith("r")) {
                solvedCard += "reverse";
                tosolvestring = tosolvestring.substring(1);
                if (tosolvestring.startsWith("eversed")) tosolvestring = tosolvestring.substring(7);
                else if (tosolvestring.startsWith("everse")) tosolvestring = tosolvestring.substring(6);
            } else if (tosolvestring.startsWith("w")) {
                solvedCard += "wild";
                tosolvestring = tosolvestring.substring(1);
                if (tosolvestring.startsWith("ild")) tosolvestring = tosolvestring.substring(3);
            } else {
                console.log(`> ${originalCard} => NO NUMBER`);
                return reject("NO_NUMBER");
            }
        }

        //  Check for colors if solvedCard still does not have them
        if (!getCardColor(solvedCard, true)) {
            if (tosolvestring.startsWith("r")) solvedCard = "red" + solvedCard;
            else if (tosolvestring.startsWith("g")) solvedCard = "green" + solvedCard;
            else if (tosolvestring.startsWith("b")) solvedCard = "blue" + solvedCard;
            else if (tosolvestring.startsWith("y")) solvedCard = "yellow" + solvedCard;
            else {
                if (solvedCard.includes("wild")) {
                    console.log(`> ${originalCard} => NO WILD COLOR`);
                } else {
                    console.log(`> ${originalCard} => NO COLOR`);
                    return reject("NO_COLOR");
                }
            }
        }

        console.log(`> ${originalCard} => ${solvedCard}`);
        return resolve(solvedCard.replace('1', 'one').replace('2', 'two').replace('3', 'three').replace('4', 'four').replace('5', 'five').replace('6', 'six').replace('7', 'seven').replace('8', 'eight').replace('9', 'nine').replace('red', 'red ').replace('green', 'green ').replace('yellow', 'yellow ').replace('blue', 'blue ').replace('wild', 'wild ').replace('drawtwo', 'draw two').replace('drawfour', 'draw four'));
    });
}
function getCardColor(card: String, raw = false) {
    if (card) {
        var cardColor = card.match(/(red)|(green)|(blue)|(yellow)/);

        if (!cardColor) {
            if (card.includes("wild") && !raw) return "red";
            return false;
        } else return cardColor[0];
    } else return false;
}
const functions = {
    getCard:getCard, getCardColor:getCardColor
}
export default functions