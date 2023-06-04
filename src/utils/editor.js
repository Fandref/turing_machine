import htmlentities from "./stringUtils";
import { spaceMark } from "../config/settings";

const commandFormat = /^(.)(\d+)(>)(.)(\d+|END)([RLH])\s*(\/\/)*$/;

const commandParts = {
    foundSymbol: /^(.)/,
    foundState: /^(.)(\d+)/,
    transitionSymbol: /^(.)(\d+)/,
    newSymbol: /^(.\d+>)(.)/,
    newState: /^(.\d+>.)(\d+|END)/,
    caretDirection: /^(.\d+>.(?:\d+|END))([RLH])/i,
    comment: /(\/\/.*)$/,
    commentLine: /^(\s*)(\/\/.*)$/
}

const hightlights = {
    foundSymbol: 'found-symbol',
    foundState: 'found-state',
    transitionSymbol: 'transition-symbol',
    newSymbol: 'new-symbol',
    newState: 'new-state',
    caretDirection: 'caret-direction',
    comment: 'comment',
    commentLine: 'comment'
};

//Problems description
const problemsDescriptions = {
    foundState: 'Стан повинен складатися лише з цифр',
    transition: 'Перехід позначається символом «>»',
    newSymbol: 'Після знаку переходу повинен бути новий символ для заміни',
    newState: 'Стан повинен бути числом або кінцевим станом «END»',
    aretDirection: 'Каретка має лише три напрямки:  «R» - вправо, «L» - вліво, «H» - на місці',
    lineFormat: 'Неправильний формат команди'
};

const foundStateProblemDescription = 'Стан повинен складатися лише з цифр';
const transitionProblemDescription = 'Перехід позначається символом «>»';
const newSymbolProblemDescription = 'Після знаку переходу повинен бути новий символ для заміни';
const newStateProblemDescription = 'Стан повинен бути числом або кінцевим станом «END»';
const caretDirectionProblemDescription = 'Каретка має лише три напрямки:  «R» - вправо, «L» - вліво, «H» - на місці';
const lineFormatProblemDescription = 'Неправильний формат команди';


const caretDirectionDir = {
    'R': 1,
    'L': -1,
    'H': 0
};


/**
 * Replace plain text to formatted unit of command.
 *
 * @param {string} line The line of code.
 * @param {string} regex The regex for command item.
 * @param {string} className Plain code.
 * @param {string} customReplacer Plain code.
 * @return {string} The line with formatted unit of command
 */
function plainCodeReplacer(line, regex, className, customReplacer = null) {
    if (!customReplacer){
        customReplacer = function (str, p1, p2, offset, string) {
            if (typeof p2 !== 'string') {
                const classes = p1 === ' ' ? className + ' ' + spaceMark : className;
                let prepareElement = p1 === ' ' ? '&nbsp;' : htmlentities(p1);
                return `<span class="${classes}">${prepareElement}</span>`
            }
            let prepareElement = p2 === ' ' ? '&nbsp;' : htmlentities(p2);
            const classes = p2 === ' ' ? className + ' ' + spaceMark : className;
            return `${p1}<span class="${classes}">${prepareElement}</span>`
        }
    }

    return line.replace(regex, customReplacer)
}

/**
 * Hightlighting turing machine code.
 *
 * @param {string} code Plain code.
 * @return {string} Hightlighted code.
 */
export function formatHightlight(code) {
    const codeLines = code.split('\n');

    const formatedLines = codeLines.map(line => {
        let formatedLine = '<div class="line">';

        if (line.length > 0) {
            if(commandParts.commentLine.test(line)){
                line = plainCodeReplacer(line, commandParts.commentLine, hightlights.commentLine);
            }
            else{
                line = Object.keys(commandParts).reverse().reduce((newLine, commandPartKey) => {
                    return plainCodeReplacer(newLine, commandParts[commandPartKey], hightlights[commandPartKey]);
                }, line);
            }

            formatedLine += line;
        }

        formatedLine += '</div>'

        return formatedLine;
    });

    return formatedLines.join('');
}

/**
 * Detect problems in code.
 *
 * @param {string} code Plain code.
 * @return {array} Array of detected problems.
 */
export function detectProblems(code) {
    const codeLines = code.split('\n');
    const problems = [];
    const problemsSetup = [
        'foundState',
        'transitionSymbol',
        'newSymbol',
        'newState',
        'caretDirection'
    ];

    codeLines.forEach((line, index) => {
        if (!commandParts.commentLine.test(line)) {

            if (line.length > 1) {

                for (let problemSetup of problemsSetup) {

                    if (!commandParts[problemSetup].test(line)) {
                        problems.push({
                            line: index + 1,
                            problem: problemsDescriptions[problemSetup]
                        });

                        break;
                    }
                }
                if(!commandFormat.test(line)){
                    problems.push({
                        line: index + 1,
                        problem: problemsDescriptions.lineFormat
                    });
                }

            }
            else if (line.length === 1) {
                problems.push({
                    line: index + 1,
                    problem: problemsDescriptions.lineFormat
                });
            }

        }

    });

    return problems;

}

/**
 * Convert code string to a command object
 *
 * @param {string} code Plain code.
 * @return {object} Object of command.
 */
export function codeToCommands(code) {
    const commands = {};
    const codeLines = code.split('\n');
    const commandMatcher = /^(.|\s)(\d+)(>)(.)(\d+|END)([RLH])/i;

    codeLines.forEach((line, index) => {
        const parsed_line = line.match(commandMatcher);

        if (parsed_line) {
            const symbol = parsed_line[1] === ' ' ? spaceMark : parsed_line[1];
            const state = parsed_line[2];
            const replaceTo = parsed_line[4];
            const swichStateTo = parsed_line[5];
            const caretDirectionTo = parsed_line[6].toUpperCase();

            if (!commands.hasOwnProperty(symbol)) {
                commands[symbol] = {};
            }

            commands[symbol][state] = {
                replaceTo,
                swichStateTo,
                caretDirection: caretDirectionDir[caretDirectionTo],
                line: index + 1
            };

        }

    });

    return commands && Object.keys(commands).length > 0 ? commands : null;
}
