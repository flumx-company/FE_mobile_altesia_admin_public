// export const loverCaseFirstLetter = (string) => typeof string === 'string'
//     ? string.charAt(0).toLowerCase() + string.slice(1)
//     : '';
//
// export const reduceObject = (object) => Object
//     .keys(object)
//     .reduce((prev, cur) => ({
//         ...prev,
//         [cur]: object[cur]
//     }),  {});
//
// function deepClone(clObj = {}, obj) {
//     for(const i in obj) {
//         if (typeof obj[i] === 'object') {
//             clObj[i] = deepClone(obj[i]);
//             continue;
//         }
//         clObj[i] = obj[i];
//     }
//     return clObj;
// }
//
// export const compareClass = (classA, classB) => ({
//     ...deepClone(classA),
//     ...classB
// });


/**
 *
 *  @const {{
 *      OBJECT: string,
 *      FUNCTION: string,
 *      BOOLEAN: string
 *  }}
 *
 */

const JS_TYPES_ENUM = {
    OBJECT: 'object',
    FUNCTION: 'function',
    BOOLEAN: "boolean"
};

/**
 *
 *  checkIfExistType
 *
 *  definition - the checked parameter, exception and type are accepted,
 *               if the checked parameters do not match the type, then
 *               the exception will work
 *
 *  usage - used by 2 functions isObject and isFunction
 *
 *  @example
 *
 *  checkIfExistType(1, '2', 'string')
 *  // returns '2'
 *
 *  @example
 *
 *  checkIfExistType(1, 2, 'number')
 *  // returns 1
 *
 *  @template varA
 *  @template varB
 *
 *  @param { * } varA - can be any kind of data that will be checked
 *                      for the type passed by the "type" parameter
 *  @param { * } varB - can be any kind of data that will return as exception
 *  @param { string } type
 *  @return {(varA | varB)}
 */

const checkIfExistType = (varA, varB, type) => typeof varA === type
    ? varA
    : varB;

/**
 *  isObject
 *
 *  definition - works exactly like checkIfExistType only more
 *               specifically for checking for type "object",
 *               will check the first parameter for an object and
 *               return it if it is an object or return an exception
 *
 *  usage - used to check for an object, in the default
 *          function to generate parallel requests and custom function
 *
 *  @example
 *
 *
 *
 *  @template varA
 *  @template varB
 *
 *  @param { * } varA - can be any kind of data that will be checked
 *                      for the type passed by the type
 *  @param { * } varB - can be any kind of data that will return as exception
 *  @return {(varA | varB)}
 */

export const isObject = (varA, varB) => checkIfExistType(
    varA,
    varB,
    JS_TYPES_ENUM.OBJECT
);

/**
 *  isFunction
 *
 *  definition - works exactly like checkIfExistType only more
 *               specifically for checking for type "function"
 *
 *  usage - used to check that the input parameter is a function,
 *          since the corresponding call is made after that;
 *          that is, this was done so that if a custom parameter
 *          is passed, then it will work or the default implementation
 *
 *  @example
 *
 *  isFunction(
 *      () => {},
 *      () => Promise.resolve(),
 *  )()
 *
 *  // returns first param () => {}
 *
 *  @template varA
 *  @template varB
 *
 *  @param { * } varA - can be any kind of data that will be checked
 *                      for the type passed by the type
 *  @param { * } varB - can be any kind of data that will return as exception
 *  @return {(varA | varB | function)}
 */

export const isFunction = (varA, varB) => checkIfExistType(
    varA,
    varB,
    JS_TYPES_ENUM.FUNCTION
);

/**
 *  VueResolver
 *
 *  definition - creates methods, hooks, properties designed to control the
 *               intermediate moment of transition through routing vue.js
 *
 *  usage - used only in vue.js, namely in the beforeEnter router hook
 *
 */


export class AlphaColor {

    constructor(color) {
        this.color = color
    }

    parseAlphaColor() {
        if (/^rgba\((\d{1,3}%?\s*,\s*){3}(\d*(?:\.\d+)?)\)$/.test(this.color)) {
            return this.parseRgba()
        } else if (/^hsla\(\d+\s*,\s*([\d.]+%\s*,\s*){2}(\d*(?:\.\d+)?)\)$/.test(this.color)) {
            return this.parseHsla()
        } else if (/^#([0-9A-Fa-f]{4}|[0-9A-Fa-f]{8})$/.test(this.color)) {
            return this.parseAlphaHex()
        } else if (/^transparent$/.test(this.color)) {
            return this.parseTransparent()
        }

        return {
            color: this.color,
            opacity: '1'
        }
    }

    parseRgba() {
        return {
            color: this.color.replace(/,(?!.*,).*(?=\))|a/g, ''),
            opacity: this.color.match(/\.\d+|[01](?=\))/)[0]
        }
    }

    parseHsla() {
        return {
            color: this.color.replace(/,(?!.*,).*(?=\))|a/g, ''),
            opacity: this.color.match(/\.\d+|[01](?=\))/)[0]
        }
    }

    parseAlphaHex() {
        return {
            color: this.color.length === 5 ? this.color.substring(0, 4) : this.color.substring(0, 7),
            opacity: this.color.length === 5 ? (parseInt(this.color.substring(4, 5) + this.color.substring(4, 5), 16) / 255).toFixed(2) : (parseInt(this.color.substring(7, 9), 16) / 255).toFixed(2)

        }
    }

    parseTransparent() {
        return {
            color: '#fff',
            opacity: 0
        }
    }
}
