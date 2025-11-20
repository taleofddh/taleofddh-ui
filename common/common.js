import { library } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab, faFacebookF, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faHome, faKey, faDollarSign, faPoundSign, faRupeeSign, faHandshake, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { post } from "aws-amplify/api";
import {MONTH_SHORT_NAMES, MONTH_NAMES, PREPOSITION_LIST} from "./constants";

library.add(far, fab, faFacebookF, faGoogle, faHome, faKey, faDollarSign, faPoundSign, faRupeeSign, faHandshake, faThumbsUp);

export const ruler = (measure) => {
    let ruler = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    }

    if(measure) {
        let s = measure.split(' ');
        if(s.length === 1) {
            ruler = {...ruler, top: parseInt(s[0]), right: parseInt(s[0]), bottom: parseInt(s[0]), left: parseInt(s[0])};
        } else if(s.length === 2) {
            ruler = {...ruler, top: parseInt(s[0]), right: parseInt(s[1]), bottom: parseInt(s[0]), left: parseInt(s[1])};
        } else if(s.length === 3) {
            ruler = {...ruler, top: parseInt(s[0]), right: parseInt(s[1]), bottom: parseInt(s[2]), left: parseInt(s[1])};
        } else if(s.length === 4) {
            ruler = {...ruler, top: parseInt(s[0]), right: parseInt(s[1]), bottom: parseInt(s[2]), left: parseInt(s[3])};
        }
    }

    return ruler;
};

export const formatMoney = (amount, decimalCount = 2, decimal = ".", thousands = ",") => {
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
        console.log(e)
    }
};

export const getQuoteOfTheDay = (capturedQuote) => {
    let new_line = "\n";
    let hiphen = " - ";
    let str = "";
    let str1 = "";
    let str2 = "";
    let replace_pattern = ["br.writeln(\"", "<br>\");"];
    let replace_more_pattern = ["\");", "\\"];

    let str_split = capturedQuote.split(new_line);

    //echo $captured_quote;

    for(let temp in str_split) {
        if(temp.indexOf("=document;") !== -1) {
            str1 = temp;
            for(let i in replace_pattern) {
                str1 = str1.replace(i, "");
            }
            str2 = str1;
            for(let i in replace_more_pattern) {
                str2 = str2.replace(i, "");
            }

            if(str2.length > 0) {
                str += str2 + hiphen;
            }
        }
    }
    return str.substring(0, str.length - 3);
}

export const groupBy = (arr, key) => {
    return arr.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

export const dateDifference = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    return d1.getTime() === d2.getTime()
}
export const dateFormatWithShortMonthToString = (date) => {
    const mm = date.getMonth(); // getMonth() is zero-based
    const dd = date.getDate();

    return [dd,
        '-',
        MONTH_SHORT_NAMES[mm],
        '-',
        date.getFullYear()
    ].join('');
}

export const dateFormatWithLongMonthToString = (date) => {
    const mm = date.getMonth(); // getMonth() is zero-based
    const dd = date.getDate();

    return [dd,
        ' ',
        MONTH_NAMES[mm],
        ' ',
        date.getFullYear()
    ].join('');
}

export const dateFormatToString = (date) => {
    const mm = date.getMonth() + 1; // getMonth() is zero-based
    const dd = date.getDate();

    return [date.getFullYear(),
        '-',
        (mm > 9 ? '' : '0') + mm,
        '-',
        (dd > 9 ? '' : '0') + dd
    ].join('');
};

export const yearFormatToString = (date) => {
    return date.getFullYear();
};

export const timeFormatToString = (date) => {
    const hh = date.getHours() + 1; // getMonth() is zero-based
    const mi = date.getMinutes();

    return [
        (hh > 9 ? '' : '0') + hh,
        ':',
        (mi > 9 ? '' : '0') + mi
    ].join('');
};

export const dateTimeFormatToString = (date) => {
    var mm = date.getMonth() + 1; // getMonth() is zero-based
    var dd = date.getDate();
    var hh = date.getHours();
    var mi = date.getMinutes();

    return [date.getFullYear(),
        '-',
        (mm > 9 ? '' : '0') + mm,
        '-',
        (dd > 9 ? '' : '0') + dd,
        ' ',
        (hh > 9 ? '' : '0') + hh,
        ':',
        (mi > 9 ? '' : '0') + mi
    ].join('');
};

export const dateTimeFullFormatToString = (date) => {
    var mm = date.getMonth() + 1; // getMonth() is zero-based
    var dd = date.getDate();
    var hh = date.getHours();
    var mi = date.getMinutes();
    var ss = date.getSeconds();

    return [date.getFullYear(),
        '-',
        (mm > 9 ? '' : '0') + mm,
        '-',
        (dd > 9 ? '' : '0') + dd,
        'T',
        (hh > 9 ? '' : '0') + hh,
        ':',
        (mi > 9 ? '' : '0') + mi,
        ':',
        (ss > 9 ? '' : '0') + ss
    ].join('');
};

export const capitalizeFirstLetters = (str) => {
    const words = str.split(" ");
    return words.map((word) => {
        if(PREPOSITION_LIST.includes(word.toLowerCase())) {
            return word;
        } else {
            return word[0].toUpperCase() + word.substring(1);
        }
    }).join(" ");
}

export const base64ToBlob = (b64Data, contentType='', sliceSize= 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
}

export const postAuditEntry = async (data) => {
    return post({
        apiName: 'createAuditEntry',
        path: '/auditEntry',
        options: {
            response: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: data,
        }
    });
}
